import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const AddressForm: React.FC<{
  addressType: string;
  onSubmit: (e: FormEvent) => void;
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ addressType, onSubmit, formData, onChange }) => (
  <div>
    <div className="text-2xl font-semibold pb-5">{addressType} Address</div>
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {['street1', 'street2', 'city'].map((field) => (
        <div key={field} className="flex flex-col gap-2">
          <label>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
          <input
            type="text"
            name={field}
            value={formData[field] || ''}
            placeholder={`Enter ${field}`}
            className="border border-black p-4 rounded-xl w-full"
            onChange={onChange}
            required
          />
        </div>
      ))}
      {/* Grouping state, zip, and country in one line */}
      <div className="flex gap-4">
        {['state', 'zip', 'country'].map((field) => (
          <div key={field} className="flex flex-col gap-2 w-1/3">
            <label>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
            <input
              type={field === 'zip' ? 'number' : 'text'}
              name={field}
              value={formData[field] || ''}
              placeholder={`Enter ${field}`}
              className="border border-black p-4 rounded-xl w-full"
              onChange={onChange}
              required
            />
          </div>
        ))}
      </div>
      <div className="pr-5">
        <button
          type="submit"
          className="float-right border rounded-full p-2.5 px-5 border-black bg-black text-white"
        >
          Update {addressType} Address
        </button>
      </div>
    </form>
  </div>
);

const Address: React.FC = () => {
  // Get user_id from Redux store
  const userId = useSelector((state: RootState) => state.user.userId);

  // State to hold form data for Home, Billing, and Shipping addresses
  const [homeAddress, setHomeAddress] = useState({
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [billingAddress, setBillingAddress] = useState({
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [shippingAddress, setShippingAddress] = useState({
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    addressType: string
  ) => {
    const { name, value } = e.target;
    if (addressType === 'Home') {
      setHomeAddress((prevData) => ({ ...prevData, [name]: value }));
    } else if (addressType === 'Billing') {
      setBillingAddress((prevData) => ({ ...prevData, [name]: value }));
    } else if (addressType === 'Shipping') {
      setShippingAddress((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent, addressType: string) => {
    e.preventDefault();
    let addressData;
    if (addressType === 'Home') {
      addressData = homeAddress;
    } else if (addressType === 'Billing') {
      addressData = billingAddress;
    } else {
      addressData = shippingAddress;
    }

    // Add user_id and addressType to the data being sent
    const dataToSubmit = { ...addressData, user_id: userId, address_type: addressType };
    console.log('Data to be sent to the backend:', dataToSubmit);

    try {
      // Send POST request to the backend to add the address
      await axios.post(`${backendBaseUrl}/addAddress/${userId}`, dataToSubmit);
      alert(`${addressType} Address added successfully`);
    } catch (error) {
      console.error(`Failed to update ${addressType} Address:`, error);
      alert('Failed to update address');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Form for Home Address */}
      <AddressForm
        addressType="Home"
        onSubmit={(e) => handleSubmit(e, 'Home')}
        formData={homeAddress}
        onChange={(e) => handleFormChange(e, 'Home')}
      />
      
      {/* Form for Billing Address */}
      <AddressForm
        addressType="Billing"
        onSubmit={(e) => handleSubmit(e, 'Billing')}
        formData={billingAddress}
        onChange={(e) => handleFormChange(e, 'Billing')}
      />
      
      {/* Form for Shipping Address */}
      <AddressForm
        addressType="Shipping"
        onSubmit={(e) => handleSubmit(e, 'Shipping')}
        formData={shippingAddress}
        onChange={(e) => handleFormChange(e, 'Shipping')}
      />
    </div>
  );
};

export default Address;
