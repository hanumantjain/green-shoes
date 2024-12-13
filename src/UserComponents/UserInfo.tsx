import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface UserDetail {
  firstname: string;
  lastname: string;
  useremail: string;
  phonenumber: string;
}

const UserInfoPage: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const [userInfo, setUserInfo] = useState<UserDetail | null>(null);
  const [updatedUserInfo, setUpdatedUserInfo] = useState<UserDetail>({
    firstname: '',
    lastname: '',
    useremail: '',
    phonenumber: '',
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error state for displaying inside modal
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>(''); // Added state for current password
  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;

  // Fetch user details when component is mounted or userId changes
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/user/${userId}`);
      setUserInfo(response.data);
      setUpdatedUserInfo({
        firstname: response.data.firstname,
        lastname: response.data.lastname,
        useremail: response.data.useremail,
        phonenumber: response.data.phonenumber,
      });
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
  }, [userId, backendBaseUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserInfo({ ...updatedUserInfo, [name]: value });
  };

  const handleUpdateUserInfo = async () => {
    try {
      const { firstname, lastname, useremail, phonenumber } = updatedUserInfo;

      if (!firstname || !lastname || !useremail || !phonenumber) {
        setErrorMessage('All fields are required!');
        return; // Ensure all fields are filled
      }

      await axios.put(`${backendBaseUrl}/user/${userId}`, updatedUserInfo);

      setSuccessMessage('User info updated successfully!');
      setIsModalOpen(false); // Close modal after successful update
      fetchUserInfo(); // Refetch updated user details
      setErrorMessage(''); // Clear error if update is successful
    } catch (err) {
      console.error('Error updating user info:', err);
      setErrorMessage('Error updating user info');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match!");
      return;
    }
  
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }
  
    try {
      const response = await axios.put(`${backendBaseUrl}/user/${userId}/password`, {
        password: currentPassword,  // Send the current password
        newPassword,
        confirmPassword,
      });
  
      // If password update is successful
      setSuccessMessage(response.data.message);
      setErrorMessage(''); // Clear any previous errors
      setIsPasswordModalOpen(false); // Close password modal after successful update
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {  // Type `err` as `unknown`
      if (axios.isAxiosError(err)) {  // Use Axios's built-in method to check for AxiosError
        // Handle errors from the backend
        setErrorMessage(err.response?.data.error || 'Error updating password.');
      } else {
        // Handle network or server errors
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUpdatedUserInfo(userInfo || {
      firstname: '',
      lastname: '',
      useremail: '',
      phonenumber: '',
    });
    setErrorMessage(''); // Reset the error message when closing the modal
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage(''); // Reset error when closing the password modal
  };

  return (
    <div className="container mx-auto p-4 flex flex-col text-xl gap-4">
      <h2 className="text-2xl font-bold text-center">User Information</h2>
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <div className="mt-4">
        {userInfo ? (
          <div>
            <p><strong>First Name:</strong> {userInfo.firstname}</p>
            <p><strong>Last Name:</strong> {userInfo.lastname}</p>
            <p><strong>Email:</strong> {userInfo.useremail}</p>
            <p><strong>Phone Number:</strong> {userInfo.phonenumber}</p>
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={() => setIsModalOpen(true)}
              >
                Update Info
              </button>
              <button
                className="bg-yellow-500 text-white p-2 rounded ml-4"
                onClick={() => setIsPasswordModalOpen(true)} // Open password modal
              >
                Change Password
              </button>
            </div>
          </div>
        ) : (
          <div>No user info found.</div>
        )}
      </div>

      {/* Modal for Update User Information */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold">Update User Information</h3>

            {/* Error Message Inside Modal */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <div className="flex flex-col gap-4 mt-4">
              <input
                type="text"
                className="border border-black p-4 rounded-xl w-full"
                placeholder="First Name"
                name="firstname"
                value={updatedUserInfo.firstname}
                onChange={handleInputChange}
              />
              <input
                type="text"
                className="border border-black p-4 rounded-xl w-full"
                placeholder="Last Name"
                name="lastname"
                value={updatedUserInfo.lastname}
                onChange={handleInputChange}
              />
              <input
                type="email"
                className="border border-black p-4 rounded-xl w-full"
                placeholder="Email"
                name="useremail"
                value={updatedUserInfo.useremail}
                onChange={handleInputChange}
              />
              <div className="w-full h-full flex items-center border border-black rounded-xl">
                <div className="flex items-center justify-center h-full px-4 border-black rounded-l-xl">
                  <span className="text-xl pr-2">🇺🇸</span>
                  <span className="text-lg font-semibold">+1</span>
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={updatedUserInfo.phonenumber}
                  placeholder="Enter your phone number"
                  required
                  className="flex-1 h-full p-4 outline-none rounded-r-xl"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                className="w-full bg-blue-500 text-white p-2 rounded"
                onClick={handleUpdateUserInfo}
              >
                Update Info
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

      {/* Modal for Change Password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold">Change Password</h3>

            {/* Error Message Inside Modal */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <div className="flex flex-col gap-4 mt-4">
              <input
                type="password"
                className="border border-black p-4 rounded-xl w-full"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                className="border border-black p-4 rounded-xl w-full"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className="border border-black p-4 rounded-xl w-full"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                className="w-full bg-blue-500 text-white p-2 rounded"
                onClick={handlePasswordChange}
              >
                Change Password
              </button>
              <button
                className="w-full bg-gray-500 text-white p-2 rounded"
                onClick={closePasswordModal}
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

export default UserInfoPage;
