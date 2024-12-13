import React, { FormEvent, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import view from '../assets/view.png';
import hide from '../assets/hide.png';

interface LocationState {
    userEmail: string;
}

const UserSignUp: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [userPassword, setUserPassword] = useState<string>('');
    const [confirmUserPassword, setConfirmUserPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;

    const location = useLocation();
    const navigate = useNavigate();
    const userEmail = (location.state as LocationState)?.userEmail;

    const validateFields = () => {
        const validationErrors: Record<string, string> = {};

        if (!firstName.trim()) {
            validationErrors.firstName = 'First name is required.';
        }

        if (!lastName.trim()) {
            validationErrors.lastName = 'Last name is required.';
        }

        const phoneRegex = /^\+?\d{10,15}$/;
        if (!phoneRegex.test(phoneNumber)) {
            validationErrors.phoneNumber = 'Enter a valid phone number.';
        }

        if (userPassword.length < 8) {
            validationErrors.userPassword = 'Password must be at least 6 characters long.';
        }

        if (userPassword !== confirmUserPassword) {
            validationErrors.confirmUserPassword = 'Passwords do not match.';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleUserSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (!validateFields()) {
            return;
        }

        try {
            await axios.post(`${backendBaseUrl}/userSignUp`, {
                firstName,
                lastName,
                userEmail,
                phoneNumber,
                userPassword,
            });

            setFirstName('');
            setLastName('');
            setUserPassword('');
            setPhoneNumber('');
            setConfirmUserPassword('');

            navigate('/userPassword', { state: { userEmail } });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            if (axiosError.response) {
                setMessage(axiosError.response.data.message);
            } else {
                setMessage('An error occurred');
            }
        }
    };

    const handleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <div className="flex justify-center pt-20">
            <div className="flex flex-col gap-5 w-1/3">
                <p className="text-4xl">Let's become a member </p>
                <p>{userEmail}</p>
                <form onSubmit={handleUserSignUp} className="flex flex-col gap-6">
                    <div className="flex gap-8">
                        <div className="w-full">
                            <input
                                type="text"
                                name="firstName"
                                value={firstName}
                                placeholder="Enter first name"
                                className="border border-black p-4 rounded-xl w-full"
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                name="lastName"
                                value={lastName}
                                placeholder="Enter last name"
                                className="border border-black p-4 rounded-xl w-full"
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                            {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
                        </div>
                    </div>
                    <div className="w-full h-full flex items-center border border-black rounded-xl">
                        <div className="flex items-center justify-center h-full px-4 bg-gray-100 border-black rounded-l-xl">
                            <span className="text-xl pr-2">🇺🇸</span>
                            <span className="text-lg font-semibold">+1</span>
                        </div>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={phoneNumber}
                            placeholder="Enter your phone number"
                            required
                            className="flex-1 h-full p-4 outline-none rounded-r-xl"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
                    <input
                        type="password"
                        name="userPassword"
                        value={userPassword}
                        placeholder="Password*"
                        required
                        className="border border-black p-4 rounded-xl w-full"
                        onChange={(e) => setUserPassword(e.target.value)}
                    />
                    {errors.userPassword && <p className="text-red-500">{errors.userPassword}</p>}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmUserPassword"
                            value={confirmUserPassword}
                            placeholder="Rewrite Password*"
                            required
                            className="border border-black p-4 rounded-xl w-full"
                            onChange={(e) => setConfirmUserPassword(e.target.value)}
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
                    {errors.confirmUserPassword && <p className="text-red-500">{errors.confirmUserPassword}</p>}
                    {message && <p className="text-red-500">{message}</p>}
                    <div className="flex gap-2 pl-2">
                        <input type="checkbox" required />
                        <p>
                            By continuing, I agree to our{' '}
                            <span className="underline">
                                <a
                                    href="https://hanumantjain.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Privacy Policy
                                </a>
                            </span>
                        </p>
                    </div>

                    <div className="pr-5">
                        <button
                            className="float-right border rounded-full p-2.5 px-5 border-black bg-black text-white"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserSignUp;
