import React, { FormEvent, useState } from 'react'
import axios, { AxiosError } from 'axios'

export const LandingPage:React.FC = () => {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [userPassword, setUserPassword] = useState<string>('')
    const [confirmUserPassword, setConfirmUserPassword] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL

    // address

    const[userStreet1, setUserStreet1] = useState<string>('')
    const[userStreet2, setUserStreet2] = useState<string>('')
    const[userCity, setUserCity] = useState<string>('')
    const[userState, setUserState] = useState<string>('')
    const[userCountry, setUserCountry] = useState<string>('')
    const[userZipCode, setUserZipCode] = useState<string>('')
    const[userPhoneNumber, setUserPhoneNumber] = useState<string>('')


    const handleUserSignUp = async (e: FormEvent) => {
        e.preventDefault()
        setMessage('')
        if(userPassword !== confirmUserPassword){
            setMessage('Password do not match')
            return
        }
        try{
            const response = await axios.post(`${backendBaseUrl}/userSignUp`, {
                firstName,
                lastName,
                userPassword
            })
            setMessage(response.data.message)
            setFirstName('')
            setLastName('')
            setUserPassword('')
            setConfirmUserPassword('')
        }catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            if (axiosError.response) {
                setMessage(axiosError.response.data.message)
            } else {
                setMessage('An error occurred')
            }
        }
    }

    const handleUserAddress = async (e: FormEvent) => {
        e.preventDefault()
        setMessage('')
        try{
            const response = await axios.post(`${backendBaseUrl}/address`, {
                userStreet1,
                userStreet2, 
                userCity, 
                userState, 
                userCountry, 
                userZipCode, 
                userPhoneNumber
            })
            setMessage(response.data.message)
            setUserStreet1('')
            setUserStreet2('')
            setUserCity('')
            setUserState('')
            setUserCountry('')
            setUserZipCode('')
            setUserPhoneNumber('')
        }catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            if (axiosError.response) {
                setMessage(axiosError.response.data.message)
            } else {
                setMessage('An error occurred')
            }
        }
    }

  return (
    <div className='w-full flex '> 
        <div className='w-1/2 h-screen flex justify-center items-center'>
            <div className='flex flex-col gap-8 text-center'>
                <h1>Sign Up</h1>
                {message && <p className="text-red-500">{message}</p>}
                <form onSubmit={handleUserSignUp} className="flex flex-col gap-8">
                    <div className='flex gap-8'>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            placeholder="Enter first name"
                            className="border border-black p-1"
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            placeholder="Enter last name"
                            className="border border-black p-1"
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <input
                        type="password"
                        name="password"
                        value={userPassword}
                        placeholder="Enter password"
                        className="border border-black p-1"
                        onChange={(e) => setUserPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmUserPassword}
                        placeholder="Rewrite password"
                        className="border border-black p-1"
                        onChange={(e) => setConfirmUserPassword(e.target.value)}
                    />
                    <div>
                        <button className="border border-black h-8 px-5 rounded" type="submit">
                            Add User
                        </button>
                    </div>
                </form>
            </div>
            
        </div>

        <div className=' w-1/2 h-screen flex justify-center items-center'>
        <div className='flex flex-col gap-8 text-center'>
                <h1>Address</h1>
                {message && <p className="text-red-500">{message}</p>}
                <form onSubmit={handleUserAddress} className="flex flex-col gap-8">
                    <input
                        type="text"
                        name="street1"
                        value={userStreet1}
                        placeholder="Address Line 1"
                        className="border border-black p-1"
                        onChange={(e) => setUserStreet1(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        name="street2"
                        value={userStreet2}
                        placeholder="Address Line 2"
                        className="border border-black p-1"
                        onChange={(e) => setUserStreet2(e.target.value)}
                        required
                    />
                    <div className='flex gap-4'>
                        <input
                            type="text"
                            name="city"
                            value={userCity}
                            placeholder="City"
                            className="border border-black p-1"
                            onChange={(e) => setUserCity(e.target.value)}
                        />
                        <input
                            type="text"
                            name="state"
                            value={userState}
                            placeholder="State"
                            className="border border-black p-1"
                            onChange={(e) => setUserState(e.target.value)}
                        /> 
                    </div>
                    <div className='flex gap-4'>
                        <input
                            type="text"
                            name="country"
                            value={userCountry}
                            placeholder="Country"
                            className="border border-black p-1"
                            onChange={(e) => setUserCountry(e.target.value)}
                        />
                        <input
                            type="number"
                            name="zipCode"
                            value={userZipCode}
                            placeholder="Zip Code"
                            className="border border-black p-1"
                            onChange={(e) => setUserZipCode(e.target.value)}
                        />
                    </div>
                    <input
                        type="number"
                        name="phoneNumber"
                        value={userPhoneNumber}
                        placeholder="Phone Number"
                        className="border border-black p-1"
                        onChange={(e) => setUserPhoneNumber(e.target.value)}
                    />
                    <div>
                        <button className="border border-black h-8 px-5 rounded" type="submit">
                            Add Address
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
