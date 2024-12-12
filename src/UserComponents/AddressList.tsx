import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios'; 
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const AddressList: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null); 
  const [editFormData, setEditFormData] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const [currentAddressType, setCurrentAddressType] = useState<string | null>(null); // For selecting address type

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${backendBaseUrl}/addresses/${userId}`);
        setAddresses(response.data.addresses);
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          setError('No addresses found for this user.');
        } else {
          setError('Failed to fetch addresses');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAddresses();
    }
  }, [userId, backendBaseUrl]);

  // Handler to open the edit form with the selected address's data
  const handleAddEditClick = (addressType: string, address: any | null) => {
    setCurrentAddressType(addressType);
    setSelectedAddress(address);
    setEditFormData(address || { address_type: addressType }); // Initialize with address or empty data
    setIsModalOpen(true); // Open the modal
  };

  // Handler to update the form data when user changes it
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  // Submit the form to update the address or create a new one
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      ...editFormData,
      user_id: userId,
    };

    // Validate the form fields
    if (!formData.street1 || !formData.city || !formData.state || !formData.zip || !formData.country) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const url = selectedAddress
        ? `${backendBaseUrl}/updateAddress/${selectedAddress.id}` // For updating
        : `${backendBaseUrl}/createAddress`; // For adding new address

      const method = selectedAddress ? 'put' : 'post';
      
      // Send the form data to the backend
      await axios[method](url, formData);

      alert(`Address ${selectedAddress ? 'updated' : 'added'} successfully`);
      setSelectedAddress(null);
      setEditFormData({});
      setIsModalOpen(false);

      // Refetch addresses after successful addition or update
      const response = await axios.get(`${backendBaseUrl}/addresses/${userId}`);
      setAddresses(response.data.addresses);
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Failed to save address');
    }
  };

  // Handler to delete an address
  const handleDeleteClick = async (addressId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this address?');
    if (confirmDelete) {
      try {
        await axios.delete(`${backendBaseUrl}/deleteAddress/${addressId}`);
        alert('Address deleted successfully');
        // Refetch addresses after deletion
        const response = await axios.get(`${backendBaseUrl}/addresses/${userId}`);
        setAddresses(response.data.addresses);
      } catch (err) {
        console.error('Error deleting address:', err);
        alert('Failed to delete address');
      }
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
    setEditFormData({});
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const addressTypes = ['Home', 'Billing', 'Shipping'];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-5">User Addresses</h2>

      <div className="space-y-8">
        {/* Loop through each address type (Home, Billing, Shipping) */}
        {addressTypes.map((addressType) => {
          const existingAddress = addresses.find((address) => address.address_type === addressType);
          
          return (
            <div key={addressType}>
              
              {/* Show Add Address Button only if no address exists for that type */}
              {!existingAddress && (
                <button
                  className="bg-green-500 text-white p-2 rounded w-44 mb-4"
                  onClick={() => handleAddEditClick(addressType, null)} // Pass null for new address
                >
                  Add {addressType} Address
                </button>
              )}
              
              {/* Address List for the current address type */}
              {existingAddress && (
                <div key={existingAddress.id} className="border p-4 rounded-lg shadow-sm hover:shadow-lg">
                  <h4 className="text-xl font-semibold text-blue-600 mb-3">{existingAddress.address_type} Address</h4>
                  <p className="text-md text-gray-700"><strong>Street 1:</strong> {existingAddress.street1}</p>
                  <p className="text-md text-gray-700"><strong>Street 2:</strong> {existingAddress.street2 || '-'}</p>
                  <p className="text-md text-gray-700"><strong>City:</strong> {existingAddress.city}</p>
                  <p className="text-md text-gray-700"><strong>State:</strong> {existingAddress.state}</p>
                  <p className="text-md text-gray-700"><strong>Zip:</strong> {existingAddress.zip}</p>
                  <p className="text-md text-gray-700"><strong>Country:</strong> {existingAddress.country}</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded w-44"
                      onClick={() => handleAddEditClick(existingAddress.address_type, existingAddress)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded w-44"
                      onClick={() => handleDeleteClick(existingAddress.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for Editing or Adding Address */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">
              {selectedAddress ? 'Edit Address' : `Add ${currentAddressType} Address`}
            </h3>
            <form onSubmit={handleEditFormSubmit}>
              {['street1', 'street2', 'city', 'state', 'zip', 'country'].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.replace(/^\w/, (c) => c.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={editFormData[field] || ''}
                    onChange={handleEditFormChange}
                    className="border border-black p-2.5 rounded-xl w-full"
                    required
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                {selectedAddress ? 'Update Address' : 'Add Address'}
              </button>
            </form>
            <button
              type="button"
              onClick={handleCloseModal}
              className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressList;
