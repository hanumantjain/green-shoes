import React, { FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Navbar } from '../UserComponents/Navbar';
import { useNavigate } from 'react-router-dom';

const GuestCheckout = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount)
  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;
  const navigate = useNavigate()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    billingAddress: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    paymentDetails: {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
    },
  });

  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [showBillingAddressForm, setShowBillingAddressForm] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: 'personalInfo' | 'address' | 'billingAddress' | 'paymentDetails'
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  const handleCheckboxChange = () => {
    setUseShippingAsBilling((prev) => !prev);
    if (!useShippingAsBilling) {
      setFormData((prevData) => ({
        ...prevData,
        billingAddress: {
          street1: '',
          street2: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        },
      }));
    }
  };

  const validateInput = (): boolean => {
    const errors: Record<string, string> = {};
    const { personalInfo, address, billingAddress, paymentDetails } = formData;

    // Personal Info Validation
    if (!/^[a-zA-Z]+$/.test(personalInfo.firstName)) errors.firstName = "Invalid first name.";
    if (!/^[a-zA-Z]+$/.test(personalInfo.lastName)) errors.lastName = "Invalid last name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) errors.email = "Invalid email.";
    if (!/^\d{10,15}$/.test(personalInfo.phoneNumber)) errors.phoneNumber = "Invalid phone number.";

    // Address Validation
    const addressFields = useShippingAsBilling ? address : billingAddress;
    for (const [key, value] of Object.entries(addressFields)) {
      if (!value.trim()) errors[key] = `Address field \"${key}\" is required.`;
    }
    if (!/^[0-9]+$/.test(addressFields.zip)) errors.zip = "ZIP code must be numeric.";

    // Payment Details Validation
    if (!/^\d{16}$/.test(paymentDetails.cardNumber)) errors.cardNumber = "Invalid card number.";
    if (!/^\d{2}\/\d{4}$/.test(paymentDetails.expiry)) errors.expiry = "Invalid expiry date format.";
    if (new Date(paymentDetails.expiry) < new Date()) errors.expiry = "Card expiry date is in the past.";
    if (!/^\d{3,4}$/.test(paymentDetails.cvv)) errors.cvv = "Invalid CVV.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    const dataToSubmit = {
      ...formData,
      billingAddress: useShippingAsBilling ? formData.address : formData.billingAddress,
    }

    try {
      await axios.post(`${backendBaseUrl}/submitAllDetails`, dataToSubmit);
      if(cartItems.length > 0){
        await axios.post(`${backendBaseUrl}/removeSize`, cartItems)
      }
      localStorage.removeItem('guestCart')
      navigate('/orderConfirm')
    } catch (error) {
      console.error('Failed to save information:', error);
      alert('Failed to save information');
    }
  };

  return (
    <div>
        <Navbar />
    <div className="w-full max-w-7xl mx-auto px-8 py-10 flex gap-12">

  <div className="w-1/3 sticky top-20 h-fit">
    <div>
    <h1 className="text-xl pt-20 pb-5 font-bold text-center">Order Summary</h1>
          <div className="flex justify-between px-12">
            <h1>Subtotal</h1>
            <h1>${totalAmount}</h1>
          </div>
          <div className="flex justify-between px-12">
            <h1>Taxes</h1>
            <h1>$0</h1>
          </div>
          <div className="flex justify-between px-12">
            <h1>Delivery Fee</h1>
            <h1>$0</h1>
          </div>
          <hr className=''/>
          <div className="flex justify-between px-12">
            <h1>Total</h1>
            <h1>${totalAmount}</h1>
          </div>
    </div>
  </div>


  <div className="w-2/3">
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      <div>
        <h2 className="text-2xl font-semibold pb-4">Personal Information</h2>
        <div className="flex gap-4 pb-4">
          {(['firstName', 'lastName'] as const).map((field) => (
            <div key={field} className="flex flex-col gap-2 text-sm w-1/2">
              <label>{field.replace(/\w/, (c) => c.toUpperCase())}</label>
              <input
                type="text"
                name={field}
                value={formData.personalInfo[field]}
                placeholder={`Enter ${field}`}
                className="border border-black p-3 rounded-xl w-full"
                onChange={(e) => handleInputChange(e, 'personalInfo')}
                required
              />
              {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
            </div>
          ))}
        </div>
        {(['email', 'phoneNumber'] as const).map((field) => (
          <div key={field} className="flex flex-col gap-2 text-sm pb-1">
            <label>{field.replace(/\w/, (c) => c.toUpperCase())}</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={formData.personalInfo[field]}
              placeholder={`Enter ${field}`}
              className="border border-black p-3 rounded-xl w-full"
              onChange={(e) => handleInputChange(e, 'personalInfo')}
              required
            />
             {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
          </div>
        ))}
      </div>


<div>
  <h2 className="text-2xl font-semibold pb-4">Shipping Address</h2>
  {(['street1', 'street2'] as const).map((field) => (
    <div key={field} className="flex flex-col gap-2 text-sm pb-1">
      <label>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
      <input
        type="text"
        name={field}
        value={formData.address[field]}
        placeholder={`Enter ${field}`}
        className="border border-black p-3 rounded-xl w-full"
        onChange={(e) => handleInputChange(e, 'address')}
        required
      />
       {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
    </div>
  ))}

  <div className="flex gap-4">
    {(['city', 'state'] as const).map((field) => (
      <div key={field} className="flex flex-col gap-2 text-sm pb-1 w-1/2">
        <label>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
        <input
          type="text"
          name={field}
          value={formData.address[field]}
          placeholder={`Enter ${field}`}
          className="border border-black p-3 rounded-xl w-full"
          onChange={(e) => handleInputChange(e, 'address')}
          required
        />
         {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
      </div>
    ))}
  </div>

  <div className="flex gap-4">
    {(['zip', 'country'] as const).map((field) => (
      <div key={field} className="flex flex-col gap-2 text-sm pb-1 w-1/2">
        <label>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
        <input
          type={field === 'zip' ? 'number' : 'text'}
          name={field}
          value={formData.address[field]}
          placeholder={`Enter ${field}`}
          className="border border-black p-3 rounded-xl w-full"
          onChange={(e) => handleInputChange(e, 'address')}
          required
        />
         {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
      </div>
    ))}
  </div>
</div>

<div>
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={useShippingAsBilling}
      onChange={handleCheckboxChange}
    />
    <label>Billing Address Same as Shipping Address</label>
  </div>
  {!useShippingAsBilling && (
    <button
      type="button"
      className="bg-gray-200 py-2 px-4 rounded-xl mt-4 hover:bg-gray-300"
      onClick={() => setShowBillingAddressForm((prev) => !prev)}
    >
      {showBillingAddressForm ? 'Hide Billing Address Form' : 'Add Billing Address'}
    </button>
  )}
</div>

{showBillingAddressForm && !useShippingAsBilling && (
  <div>
    <h2 className="text-2xl font-semibold pb-4">Billing Address</h2>
    {(['street1', 'street2'] as const).map((field) => (
      <div key={field} className="flex flex-col gap-2 text-sm pb-1">
        <label>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
        <input
          type="text"
          name={field}
          value={formData.billingAddress[field]}
          placeholder={`Enter ${field}`}
          className="border border-black p-3 rounded-xl w-full"
          onChange={(e) => handleInputChange(e, 'billingAddress')}
          required
        />
         {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
      </div>
    ))}

    <div className="flex gap-4">
      {(['city', 'state'] as const).map((field) => (
        <div key={field} className="flex flex-col gap-2 text-sm pb-1 w-1/2">
          <label>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
          <input
            type="text"
            name={field}
            value={formData.billingAddress[field]}
            placeholder={`Enter ${field}`}
            className="border border-black p-3 rounded-xl w-full"
            onChange={(e) => handleInputChange(e, 'billingAddress')}
            required
          />
           {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
        </div>
      ))}
    </div>

    <div className="flex gap-4">
      {(['zip', 'country'] as const).map((field) => (
        <div key={field} className="flex flex-col gap-2 text-sm pb-1 w-1/2">
          <label>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
          <input
            type={field === 'zip' ? 'number' : 'text'}
            name={field}
            value={formData.billingAddress[field]}
            placeholder={`Enter ${field}`}
            className="border border-black p-3 rounded-xl w-full"
            onChange={(e) => handleInputChange(e, 'billingAddress')}
            required
          />
           {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
        </div>
      ))}
    </div>
  </div>
)}


<div>
  <h2 className="text-2xl font-semibold pb-4">Payment Details</h2>
  {/* {(['cardNumber', 'cardName'] as const).map((field) => (
    <div key={field} className="flex flex-col gap-2 text-sm pb-1">
      <label>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
      <input
        type="text"
        name={field}
        value={formData.paymentDetails[field]}
        placeholder={`Enter ${field}`}
        className="border border-black p-3 rounded-xl w-full"
        onChange={(e) => handleInputChange(e, 'paymentDetails')}
        required
      />
       {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
    </div>
  ))} */}

{(['cardNumber', 'cardName', 'expiry', 'cvv'] as const).map((field) => (
    <div key={field} className="flex flex-col gap-2 text-sm pb-4">
      <label>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
      <input
        type={field === 'cvv' || field === 'cardNumber' ? 'number' : 'text'}
        name={field}
        value={formData.paymentDetails[field]}
        placeholder={`Enter ${field}`}
        className={`border border-black p-3 rounded-xl w-full ${
          formErrors[field] ? 'border-red-500' : ''
        }`}
        onChange={(e) => handleInputChange(e, 'paymentDetails')}
        required
      />
      {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
    </div>
  ))}
</div>


        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600"
        >
          Place order
        </button>
      </form>
      </div>
    </div>
    </div>
  );
};

export default GuestCheckout;
