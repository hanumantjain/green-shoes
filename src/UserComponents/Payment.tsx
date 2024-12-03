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

const PaymentDetailsPage: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const [paymentDetails, setPaymentDetails] = useState<CardDetail[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [cardDetailsToUpdate, setCardDetailsToUpdate] = useState<CardDetail | null>(null);
  const [newCardDetails, setNewCardDetails] = useState<any>({
    card_number: '',
    cardholder_name: '',
    expiry_date: '',
    cvv: '',
  });
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isAddingCard, setIsAddingCard] = useState<boolean>(false); 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;

  // Fetch payment details when the component is mounted or when userId changes
  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/payment-details/${userId}`);
      setPaymentDetails(response.data);
    } catch (err) {
      console.error('Error fetching payment details:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPaymentDetails();
    }
  }, [userId, backendBaseUrl]);

  const handleUpdatePayment = (cardId: number) => {
    const cardToUpdate = paymentDetails.find((detail) => detail.id === cardId);
    if (cardToUpdate) {
      setSelectedCardId(cardId);
      setCardDetailsToUpdate(cardToUpdate);
      // Pre-fill the newCardDetails with the current card's details for updating
      setNewCardDetails({
        card_number: cardToUpdate.card_number,
        cardholder_name: cardToUpdate.cardholder_name,
        expiry_date: cardToUpdate.expiry_date,
        cvv: '', // CVV might not be needed for displaying or updating
      });
      setIsModalOpen(true); // Open modal for update
    }
  };

  const handleUpdateCard = async (cardId: number, updatedCardDetails: any) => {
    try {
      const { card_number, cardholder_name, expiry_date, cvv } = updatedCardDetails;

      if (!card_number || !cardholder_name || !expiry_date || !cvv) {
        return;
      }

      await axios.put(`${backendBaseUrl}/payment-details/${userId}`, {
        cardId,
        cardNumber: card_number,
        cardholderName: cardholder_name,
        expiryDate: expiry_date,
        cvv,
      });

      setSuccessMessage('Card details updated successfully!');
      setSelectedCardId(null);
      setCardDetailsToUpdate(null);
      setIsModalOpen(false); // Close modal after update
  
      fetchPaymentDetails(); // Refetch payment details
    } catch (err) {
      console.error('Error updating card details:', err);
    }
  };

  const handleAddCard = async () => {
    try {
      const { card_number, cardholder_name, expiry_date, cvv } = newCardDetails;

      if (!card_number || !cardholder_name || !expiry_date || !cvv) {
        return;
      }

      await axios.post(`${backendBaseUrl}/payment-details/${userId}`, {
        card_number,
        cardholder_name,
        expiry_date,
        cvv,
      });

      setSuccessMessage('Payment details added successfully!');
      setNewCardDetails({
        card_number: '',
        cardholder_name: '',
        expiry_date: '',
        cvv: '',
      });

      fetchPaymentDetails(); // Refetch payment details
      setIsModalOpen(false); // Close modal after adding
    } catch (err) {
      console.error('Error adding card details:', err);
    }
  };

  const handleRemoveCard = async (cardId: number) => {
    try {
      await axios.delete(`${backendBaseUrl}/payment-details/${userId}/${cardId}`);
      
      // Directly filter out the removed card from the local state
      setPaymentDetails(paymentDetails.filter(card => card.id !== cardId));
  
      setSuccessMessage('Card removed successfully!');
    } catch (err) {
      console.error('Error removing card:', err);
    }
  };

  const handleNewCardChange = (field: string, value: string) => {
    setNewCardDetails({ ...newCardDetails, [field]: value });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCardId(null);
    setCardDetailsToUpdate(null);
    setNewCardDetails({
      card_number: '',
      cardholder_name: '',
      expiry_date: '',
      cvv: '',
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold">Payment Details</h2>
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <div className="mt-4">
        {paymentDetails.length > 0 ? (
          <ul>
            {paymentDetails.map((detail) => (
              <li key={detail.id} className="mb-4">
                <p className='p-1'><strong className='text-blue-600'>Card Number:</strong> **** **** **** {detail.card_number.slice(-4)}</p>
                <p className='p-1'><strong className='text-blue-600'>Cardholder Name:</strong> {detail.cardholder_name}</p>
                <p className='p-1'><strong className='text-blue-600'>Expiry Date:</strong> {detail.expiry_date}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={() => handleUpdatePayment(detail.id)}
                  >
                    Update Payment Option
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => handleRemoveCard(detail.id)}
                  >
                    Remove Card
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p>No payment details found.</p>
          </div>
        )}
      </div>

      {/* Button to show the "Add Payment Details" modal only if no cards exist */}
      {paymentDetails.length === 0 && !isModalOpen && (
        <button
          className="mt-4 bg-green-500 text-white p-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add Card
        </button>
      )}

      {/* Modal for Add or Update Payment Details */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold">
              {selectedCardId ? 'Update Payment Details' : 'Add Payment Details'}
            </h3>

            <div className="flex flex-col gap-4 mt-4">
              <input
                type="text"
                className="border border-black p-4 rounded-xl w-full"
                placeholder="Card Number"
                value={newCardDetails.card_number}
                onChange={(e) => handleNewCardChange('card_number', e.target.value)}
              />
              <input
                type="text"
                className="border border-black p-4 rounded-xl w-full"
                placeholder="Cardholder Name"
                value={newCardDetails.cardholder_name}
                onChange={(e) => handleNewCardChange('cardholder_name', e.target.value)}
              />
              <input
                type="text"
                className="border border-black p-4 rounded-xl w-full"
                placeholder="Expiry Date (MM/YY)"
                value={newCardDetails.expiry_date}
                onChange={(e) => handleNewCardChange('expiry_date', e.target.value)}
              />
              <input
                type="text"
                className="block border border-black p-4 rounded-xl w-full"
                placeholder="CVV"
                value={newCardDetails.cvv}
                onChange={(e) => handleNewCardChange('cvv', e.target.value)}
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                className="w-full bg-blue-500 text-white p-2 rounded"
                onClick={selectedCardId ? () => handleUpdateCard(selectedCardId, newCardDetails) : handleAddCard}
              >
                {selectedCardId ? 'Update Card' : 'Add Card'}
              </button>
              <button
                className="w-full bg-gray-500 text-white p-2 rounded"
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
