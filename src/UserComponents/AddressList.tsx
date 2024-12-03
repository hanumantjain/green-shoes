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
  const handleEditClick = (address: any) => {
    setSelectedAddress(address);
    setEditFormData({ ...address });
  };

  // Handler to update the form data when user changes it
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  // Submit the form to update the address
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${backendBaseUrl}/updateAddress/${selectedAddress.id}`, editFormData);
      alert('Address updated successfully');
      setSelectedAddress(null); 
      setEditFormData({});
      // Refetch addresses after update
      const response = await axios.get(`${backendBaseUrl}/addresses/${userId}`);
      setAddresses(response.data.addresses);
    } catch (err) {
      console.error('Error updating address:', err);
      alert('Failed to update address');
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-5">User Addresses</h2>

      <div className="flex space-x-6">
        {/* Address List Section */}
        <div className="w-1/2">
          {addresses.length === 0 ? (
            <div className="text-xl text-gray-500">No address available</div>
          ) : (
            <div className="space-y-6">
              {addresses.map((address) => (
                <div key={address.id} className="border p-4 rounded-lg shadow-sm hover:shadow-lg">
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">{address.address_type}</h3>
                  <p className="text-md text-gray-700"><strong>Street 1:</strong> {address.street1}</p>
                  <p className="text-md text-gray-700"><strong>Street 2:</strong> {address.street2 || '-'}</p>
                  <p className="text-md text-gray-700"><strong>City:</strong> {address.city}</p>
                  <p className="text-md text-gray-700"><strong>State:</strong> {address.state}</p>
                  <p className="text-md text-gray-700"><strong>Zip:</strong> {address.zip}</p>
                  <p className="text-md text-gray-700"><strong>Country:</strong> {address.country}</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded w-44"
                      onClick={() => handleEditClick(address)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded w-44"
                      onClick={() => handleDeleteClick(address.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Form Section */}
        <div className="w-1/2">
          {selectedAddress && (
            <div className="p-6 border border-gray-200 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Edit Address</h3>
              <form onSubmit={handleEditFormSubmit}>
                {['street1', 'street2', 'city', 'state', 'zip', 'country'].map((field) => (
                  <div key={field} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
                    <input
                      type="text"
                      name={field}
                      value={editFormData[field] || ''}
                      onChange={handleEditFormChange}
                      className="border border-black p-4 rounded-xl w-full"
                      required
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  Update Address
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAddress(null)}
                  className="mt-2 w-full bg-gray-300 text-black py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressList;
