import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface CardDetail {
  id: number;
  card_number: string;
  cardholder_name: string;
  expiry_date: string;
  created_at: string;
}

interface PaymentProps {
  setPaymentDetailsAvailable: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentDetailsPage: React.FC<PaymentProps> = ({ setPaymentDetailsAvailable }) => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const [paymentDetails, setPaymentDetails] = useState<CardDetail[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [newCardDetails, setNewCardDetails] = useState({
    card_number: '',
    cardholder_name: '',
    expiry_date: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({
    card_number: '',
    cardholder_name: '',
    expiry_date: '',
    cvv: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASEURL || 'http://localhost:4000';

  // Fetch payment details
  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/payment-details/${userId}`);
      setPaymentDetails(response.data);
      setPaymentDetailsAvailable(response.data.length > 0);
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
    }
  };

  useEffect(() => {
    if (userId) fetchPaymentDetails();
  }, [userId]);

  // Validate inputs
  const validateInputs = () => {
    const newErrors = {
      card_number: '',
      cardholder_name: '',
      expiry_date: '',
      cvv: '',
    };

    // Validate Card Number (16 digits)
    if (!newCardDetails.card_number || !/^\d{16}$/.test(newCardDetails.card_number)) {
      newErrors.card_number = 'Card number must be 16 digits.';
    }

    // Validate Cardholder Name
    if (!newCardDetails.cardholder_name) {
      newErrors.cardholder_name = 'Cardholder name is required.';
    }

    // Validate Expiry Date (MM/YY)
    if (!newCardDetails.expiry_date || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(newCardDetails.expiry_date)) {
      newErrors.expiry_date = 'Expiry date must be in MM/YY format.';
    }

    // Validate CVV (3 digits)
    if (!newCardDetails.cvv || !/^\d{3}$/.test(newCardDetails.cvv)) {
      newErrors.cvv = 'CVV must be 3 digits.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleAddOrUpdateCard = async () => {
    if (!validateInputs()) {
      return; // Don't proceed if validation fails
    }

    try {
      const { card_number, cardholder_name, expiry_date, cvv } = newCardDetails;

      if (selectedCardId) {
        // Update card
        await axios.put(`${backendBaseUrl}/payment-details/${userId}`, {
          cardId: selectedCardId,
          cardNumber: card_number,
          cardholderName: cardholder_name,
          expiryDate: expiry_date,
          cvv,
        });
      } else {
        // Add card
        await axios.post(`${backendBaseUrl}/payment-details/${userId}`, {
          card_number,
          cardholder_name,
          expiry_date,
          cvv,
        });
      }

      setIsModalOpen(false);
      fetchPaymentDetails();
    } catch (error) {
      console.error('Failed to save card details:', error);
    }
  };

  const handleRemoveCard = async (cardId: number) => {
    try {
      await axios.delete(`${backendBaseUrl}/payment-details/${userId}/${cardId}`);
      setPaymentDetails(paymentDetails.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error('Failed to remove card:', error);
    }
  };

  const handleNewCardChange = (field: string, value: string) => {
    setNewCardDetails((prev) => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCardId(null);
    setNewCardDetails({
      card_number: '',
      cardholder_name: '',
      expiry_date: '',
      cvv: '',
    });
    setErrors({
      card_number: '',
      cardholder_name: '',
      expiry_date: '',
      cvv: '',
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Payment Details</h2>

      {paymentDetails.length > 0 ? (
        <ul>
          {paymentDetails.map((detail) => (
            <li key={detail.id} className="mb-4 p-4 rounded-lg">
              <p><strong>Card Number:</strong> **** **** **** {detail.card_number.slice(-4)}</p>
              <p><strong>Cardholder Name:</strong> {detail.cardholder_name}</p>
              <p><strong>Expiry Date:</strong> {detail.expiry_date}</p>
              <div className="mt-2 flex gap-2">
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => {
                    setSelectedCardId(detail.id);
                    setNewCardDetails({
                      card_number: detail.card_number,
                      cardholder_name: detail.cardholder_name,
                      expiry_date: detail.expiry_date,
                      cvv: '', // Never pre-fill CVV
                    });
                    setIsModalOpen(true);
                  }}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => handleRemoveCard(detail.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No payment details available.</p>
      )}

      {/* Add card button only appears if no payment details are available */}
      {paymentDetails.length === 0 && (
        <button
          className="bg-green-500 text-white p-3 rounded mt-4"
          onClick={() => setIsModalOpen(true)}
        >
          Add Card
        </button>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              {selectedCardId ? 'Update Payment Details' : 'Add Payment Details'}
            </h3>
            <input
              type="text"
              placeholder="Card Number"
              value={newCardDetails.card_number}
              onChange={(e) => handleNewCardChange('card_number', e.target.value)}
              className="block w-full p-2 border mb-2"
            />
            {errors.card_number && <p className="text-red-500 text-sm">{errors.card_number}</p>}

            <input
              type="text"
              placeholder="Cardholder Name"
              value={newCardDetails.cardholder_name}
              onChange={(e) => handleNewCardChange('cardholder_name', e.target.value)}
              className="block w-full p-2 border mb-2"
            />
            {errors.cardholder_name && <p className="text-red-500 text-sm">{errors.cardholder_name}</p>}

            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              value={newCardDetails.expiry_date}
              onChange={(e) => handleNewCardChange('expiry_date', e.target.value)}
              className="block w-full p-2 border mb-2"
            />
            {errors.expiry_date && <p className="text-red-500 text-sm">{errors.expiry_date}</p>}

            <input
              type="text"
              placeholder="CVV"
              value={newCardDetails.cvv}
              onChange={(e) => handleNewCardChange('cvv', e.target.value)}
              className="block w-full p-2 border mb-4"
            />
            {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}

            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white p-2 rounded w-full"
                onClick={handleAddOrUpdateCard}
              >
                {selectedCardId ? 'Update Card' : 'Add Card'}
              </button>
              <button
                className="bg-gray-500 text-white p-2 rounded w-full"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetailsPage;
