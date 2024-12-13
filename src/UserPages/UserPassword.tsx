import React, { FormEvent, useState, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import view from '../assets/view.png';
import hide from '../assets/hide.png';
import axiosInstance from '../utils/axios';
import { setUser } from '../Features/cart/UserSlice';
import { fetchCartItems } from '../Features/cart/CartSlice';
import { useAppDispatch } from '../hooks';

interface LocationState {
    userEmail: string;
}

export const UserPassword: React.FC = () => {
    const [userPassword, setUserPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [resultMessage, setResultMessage] = useState<string>('');

    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;
    const navigate = useNavigate();
    const location = useLocation();
    const userEmail = (location.state as LocationState)?.userEmail;
    const dispatch = useAppDispatch();

    const handleEmailSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // Login request
            const loginResponse = await axiosInstance.post(`${backendBaseUrl}/userLogin`, {
                userEmail,
                userPassword,
            });

            if (loginResponse.status === 200) {
                // Dispatch user data (e.g., firstName and userId)
                dispatch(
                    setUser({
                        firstName: loginResponse.data.firstName,
                        userId: loginResponse.data.userId,
                    })
                );
                dispatch(fetchCartItems());

                // Create Stripe Customer after successful login
                const customerResponse = await axiosInstance.post(`${backendBaseUrl}/createCustomer`, {
                    userEmail,
                });

                if (customerResponse.status === 200) {
                    console.log('Stripe customer created:', customerResponse.data);
                    // You can store the customer ID or any relevant info in your state or DB
                } else {
                    console.error('Error creating customer:', customerResponse.data);
                }

                // Redirect user to the home page after successful login and customer creation
                navigate('/home', { replace: true });
            }

            setResultMessage(loginResponse.data.message);
            setUserPassword('');
        } catch (error: any) {
            console.error('Login Error:', error);

            if (error.response) {
                setResultMessage(
                    error.response?.data?.message || 'An error occurred. Please try again.'
                );
            } else if (error.request) {
                setResultMessage('Network error. Please check your connection and try again.');
            } else {
                setResultMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserPassword(e.target.value);
    };

    return (
        <div className="flex justify-center pt-20">
            <div className="flex flex-col gap-5 w-1/3">
                <p className="text-4xl">What's your password?</p>
                <p>{userEmail}</p>
                {resultMessage && <p className="text-red-500">{resultMessage}</p>}
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="userPassword"
                            value={userPassword}
                            placeholder="Password*"
                            required
                            className="border border-black p-4 rounded-xl w-full"
                            onChange={handlePasswordChange}
                        />
                        <div
                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                            onClick={handleShowPassword}
                        >
                            {showPassword ? (
                                <img src={view} alt="" className="w-5" />
                            ) : (
                                <img src={hide} alt="" className="w-5" />
                            )}
                        </div>
                    </div>
                    <p className="underline">
                        <a
                            href="https://hanumantjain.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Forgot Password?
                        </a>
                    </p>
                    <div className="pr-5">
                        <button className="float-right border rounded-full p-2.5 px-5 border-black bg-black text-white">
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
