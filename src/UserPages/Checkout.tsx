import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import PaymentDetailsPage from '../UserComponents/Payment';

const Checkout: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddressType, setCurrentAddressType] = useState<string | null>(null);
  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;
  const userId = useSelector((state: RootState) => state.user.userId);

  // Open the modal for either adding or editing an address
  const handleAddEditClick = (addressType: string, address: any | null) => {
    setCurrentAddressType(addressType);
    setSelectedAddress(address);
    setEditFormData(address || { address_type: addressType });
    setIsModalOpen(true);
  };

  // Handle changes in the address form
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission (add or edit address)
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Make sure to include user_id in the form data before submitting
    const formData = {
      ...editFormData,
      user_id: userId,  // Add user_id to the form data (use 'guest' for guest users)
    };

    // Validate that all required fields are filled in
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

      // Refetch addresses after successful addition or update
      if (userId) {
        const response = await axios.get(`${backendBaseUrl}/addresses/${userId}`);
        setAddresses(response.data.addresses);
      }
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Failed to save address');
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedAddress(null);
    setEditFormData({});
    setIsModalOpen(false);
  };

  // Fetch addresses when the userId changes
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

  // Get address by type (e.g., Home, Shipping, Billing)
  const getAddressByType = (type: string) => {
    return addresses.find((address) => address.address_type === type);
  };

  // Address Row Component for rendering each address row
  const AddressRow = ({ type }: { type: string }) => {
    const address = getAddressByType(type);
    return (
      <div className="border p-4 rounded-lg shadow-sm hover:shadow-lg">
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
      <div>Checkout</div>
      <div className="flex flex-col px-20 pt-20 pb-10">
        <div>
          <h1 className="text-3xl font-bold pl-4">Shipping</h1>
          <div className="flex gap-44">
            {['Home', 'Shipping', 'Billing'].map((type) => (
              <AddressRow key={type} type={type} />
            ))}
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
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
      <div>
        <PaymentDetailsPage />
      </div>
    </div>
  );
};

export default Checkout;
