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
  const [cardDetailsToUpdate, setCardDetailsToUpdate] = useState<any | null>(null);
  const [newCardDetails, setNewCardDetails] = useState<any>({
    card_number: '',
    cardholder_name: '',
    expiry_date: '',
    cvv: '',
  });
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isAddingCard, setIsAddingCard] = useState<boolean>(false); // State to track if the add form is shown
  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;

  // Fetch payment details when the component is mounted or when userId changes
  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/payment-details/${userId}`);
      setPaymentDetails(response.data);
    } catch (err) {
      setError('Failed to fetch payment details. Please try again later.');
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
    }
  };

  const handleUpdateCard = async (cardId: number, updatedCardDetails: any) => {
    try {
      const { card_number, cardholder_name, expiry_date, cvv } = updatedCardDetails;

      if (!card_number || !cardholder_name || !expiry_date || !cvv) {
        setError('All fields must be filled in to update the card details.');
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
  
      fetchPaymentDetails(); // Refetch payment details
    } catch (err) {
      setError('An issue occurred while updating the payment details. Please try again later.');
    }
  };

  const handleAddCard = async () => {
    try {
      const { card_number, cardholder_name, expiry_date, cvv } = newCardDetails;

      if (!card_number || !cardholder_name || !expiry_date || !cvv) {
        setError('All fields must be filled in to add the card details.');
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
      setIsAddingCard(false); // Hide form after submission
    } catch (err) {
      setError('An issue occurred while adding the payment details. Please try again later.');
    }
  };

  const handleRemoveCard = async (cardId: number) => {
    try {
      await axios.delete(`${backendBaseUrl}/payment-details/${userId}/${cardId}`);

      setSuccessMessage('Card removed successfully!');
      fetchPaymentDetails(); // Refetch payment details
    } catch (err) {
      setError('An issue occurred while removing the card. Please try again later.');
    }
  };

  const handleNewCardChange = (field: string, value: string) => {
    setNewCardDetails({ ...newCardDetails, [field]: value });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold">Payment Details</h2>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <div className="mt-4">
        {paymentDetails.length > 0 ? (
          <ul>
            {paymentDetails.map((detail) => (
              <li key={detail.id} className="p-2 mb-4 border border-gray-300 rounded">
                <p><strong>Card Number:</strong> **** **** **** {detail.card_number.slice(-4)}</p>
                <p><strong>Cardholder Name:</strong> {detail.cardholder_name}</p>
                <p><strong>Expiry Date:</strong> {detail.expiry_date}</p>
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

      {/* Button to show the "Add Payment Details" form */}
      {!isAddingCard && (
        <button
          className="mt-4 bg-green-500 text-white p-2 rounded"
          onClick={() => setIsAddingCard(true)}
        >
          Add Another Card
        </button>
      )}

      {/* Add payment details form */}
      {isAddingCard && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h3 className="text-xl font-semibold">Add Payment Details</h3>

          <div className="flex flex-col gap-4">
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

          <button
            className="mt-4 bg-green-500 text-white p-2 rounded"
            onClick={handleAddCard}
          >
            Add Card
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentDetailsPage;
