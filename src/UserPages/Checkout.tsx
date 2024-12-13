import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import PaymentDetailsPage from '../UserComponents/Payment';
import { Navbar } from '../UserComponents/Navbar'
import { clearCart } from '../Features/cart/CartSlice';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentDetailsAvailable, setPaymentDetailsAvailable] = useState<boolean>(true);
  const [currentAddressType, setCurrentAddressType] = useState<string | null>(null);
  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;
  const userId = useSelector((state: RootState) => state.user.userId);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Open the modal for either adding or editing an address
  const handleAddEditClick = (addressType: string, address: any | null) => {
    setCurrentAddressType(addressType);
    setSelectedAddress(address)
    setEditFormData(address || { address_type: addressType });
    setIsModalOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...editFormData,
      user_id: userId, 
    }
    if (!formData.street1 || !formData.city || !formData.state || !formData.zip || !formData.country) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const url = selectedAddress
        ? `${backendBaseUrl}/updateAddress/${selectedAddress.id}` // For updating
        : `${backendBaseUrl}/createAddress`; // For adding

      const method = selectedAddress ? 'put' : 'post';
      
      // Send the form data to the backend
      await axios[method](url, formData);

      alert(`Address ${selectedAddress ? 'updated' : 'added'} successfully`);
      setSelectedAddress(null);
      setEditFormData({});
      setIsModalOpen(false);

      if (userId) {
        const response = await axios.get(`${backendBaseUrl}/addresses/${userId}`);
        setAddresses(response.data.addresses);
      }
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Failed to save address');
    }
  };

  const handleCloseModal = () => {
    setSelectedAddress(null);
    setEditFormData({});
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (userId) {
          const response = await axios.get(`${backendBaseUrl}/addresses/${userId}`);
          setAddresses(response.data.addresses);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAddresses();
  }, [userId, backendBaseUrl]);

  const getAddressByType = (type: string) => {
    return addresses.find((address) => address.address_type === type);
  };

const handleOrder = async () => {
    try {
      if (!userId) {
        alert('User not logged in.');
        return;
      }
      if (!cartItems.length) {
        alert('No items in the cart.');
        return;
      }
  
      const shippingAddress = getAddressByType('Shipping');
      const billingAddress = getAddressByType('Billing');
      const homeAddress = getAddressByType('Home');
  
      if (!shippingAddress || !billingAddress || !homeAddress) {
        alert('Please ensure all address types are added.');
        return;
      }
  
      // Check payment details availability
      if (!paymentDetailsAvailable) {
        alert('Payment details are missing. Please add payment details.');
        return;
      }
  
      const orderDetails = cartItems.map((item) => ({
        user_id: userId,
        product_id: item.product_id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        order_time: new Date().toISOString(),
        total_amount: totalAmount,
        shipping_address: shippingAddress,
      }));
  
      const response = await axios.post(`${backendBaseUrl}/createOrder`, { orders: orderDetails });
  
      if (response.status === 201 || response.status === 200) {
        // Navigate to the 'Order Confirmation' page (or any other page you wish)
        navigate('/orderConfirm'); // Change '/order-confirmation' to your desired route
  
        const removeCartResponse = await axios.post(`${backendBaseUrl}/removeCart`, {
          user_id: userId,
          cartItems: cartItems,  // cartItems is already an array of { product_id, size }
        });
  
        if (removeCartResponse.status === 200) {
          // Successfully removed cart items
          console.log('Cart items removed successfully');
        } else {
          // Handle failure in removing cart items
          console.error('Failed to remove cart items from the database');
        }
  
        // Clear the cart after successful order placement
        dispatch(clearCart());
      } else if (response.data.error === 'Item is not in stock') {  // Check for the new error message
        alert('Item is not in stock. Please reduce the quantity or remove the item from the cart.');
      } else {
        alert('Unexpected response from the server.');
        console.error('Server response:', response.data);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Item is not in stock.');
    }
  };

  const AddressRow = ({ type }: { type: string }) => {
    const address = getAddressByType(type);
    return (
      <div className="p-5">
        <h3 className="text-xl font-semibold text-blue-600 mb-3">{type}</h3>
        {address ? (
          <>
            <p className="text-md text-gray-700">{address.street1}</p>
            <p className="text-md text-gray-700">{address.street2 || '-'}</p>
            <p className="text-md text-gray-700">{address.city}, {address.state}</p>
            <p className="text-md text-gray-700">{address.zip}</p>
            <p className="text-md text-gray-700">{address.country}</p>
            <button
              className="bg-blue-500 text-white p-2 rounded w-44 mt-2"
              onClick={() => handleAddEditClick(type, address)}
            >
              Edit
            </button>
          </>
        ) : (
          <button
            className="bg-green-500 text-white p-2 rounded w-44 mt-2"
            onClick={() => handleAddEditClick(type, null)}
          >
            Add Address
          </button>
        )}
      </div>
    );
  };

  return (
<div>
  <Navbar />
  {/* Shipping Section */}
  <div className="flex flex-col px-20 pt-10 ">
    <div>
      <h1 className="text-3xl font-bold pl-4 text-center">Shipping</h1>
      <div className="flex gap-44">
        {['Home', 'Shipping', 'Billing'].map((type) => (
          <AddressRow key={type} type={type} />
        ))}
      </div>
    </div>
  </div>

  {/* Main Content Layout: Payment Details & Order Summary */}
  <div className="flex gap-12 px-20 pt-10">
    {/* Payment Details Section */}
    <div className="w-1/2">
      <PaymentDetailsPage setPaymentDetailsAvailable={setPaymentDetailsAvailable}/>
    </div>

    {/* Order Summary Section */}
    <div className="w-1/2">
      <h1 className="text-3xl pb-5 font-bold text-center">Order Summary</h1>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full flex justify-between px-12">
          <h1>Subtotal</h1>
          <h1>${totalAmount}</h1>
        </div>
        <div className="w-full flex justify-between px-12">
          <h1>Discount</h1>
          <h1>${totalAmount}</h1>
        </div>
        <div className="w-full flex justify-between px-12">
          <h1>Delivery Fee</h1>
          <h1>$0</h1>
        </div>
        <hr className="" />
        <div className="w-full flex justify-between px-12">
          <h1>Total</h1>
          <h1>${totalAmount}</h1>
        </div>
      </div>
    </div>
  </div>
  <div className='flex justify-center items-center'>
  <button
  className="bg-green-500 text-white p-2 rounded w-44 mt-2"
  onClick={handleOrder} // Removed unnecessary arrow function
>
  Place Order
</button>
  </div>
  {/* Modal for Address Edit */}
  {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
        <h2 className="text-2xl font-semibold mb-4">
          {selectedAddress ? 'Edit Address' : 'Add Address'}
        </h2>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={handleCloseModal}
        >
          ✖
        </button>
        <form onSubmit={handleEditFormSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Street 1</label>
            <input
              type="text"
              name="street1"
              value={editFormData.street1 || ''}
              onChange={handleEditFormChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Street 2</label>
            <input
              type="text"
              name="street2"
              value={editFormData.street2 || ''}
              onChange={handleEditFormChange}
              className="border rounded w-full p-2"
            />
          </div>
          <div>
            <label className="block font-medium">City</label>
            <input
              type="text"
              name="city"
              value={editFormData.city || ''}
              onChange={handleEditFormChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">State</label>
            <input
              type="text"
              name="state"
              value={editFormData.state || ''}
              onChange={handleEditFormChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Zip</label>
            <input
              type="text"
              name="zip"
              value={editFormData.zip || ''}
              onChange={handleEditFormChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={editFormData.country || ''}
              onChange={handleEditFormChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded mt-4"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )}
</div>
  )
};

export default Checkout;
