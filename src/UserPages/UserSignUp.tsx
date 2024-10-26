import React, { FormEvent, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useLocation } from 'react-router-dom'
import view from '../assets/view.png'
import hide from '../assets/hide.png'

interface LocationState{
    userEmail: string
}

const UserSignUp:React.FC = () => {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [userPassword, setUserPassword] = useState<string>('')
    const [confirmUserPassword, setConfirmUserPassword] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL

    const location = useLocation()
    const userEmail = (location.state as LocationState)?.userEmail


    const handleUserSignUp = async (e: FormEvent) => {
        e.preventDefault()
        setMessage('')
        if(userPassword !== confirmUserPassword){
            setMessage('Password do not match')
            return
        }
        try{
            await axios.post(`${backendBaseUrl}/userSignUp`, {
                firstName,
                lastName,
                userEmail,
                userPassword
            })
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
    const handleShowPassword = () => {
        setShowPassword(prevState => !prevState)
    }

  return (
    <div className='flex justify-center pt-20'>
        <div className='flex flex-col gap-5 w-1/3'>
            <p className='text-4xl'>Let's become a member </p>
            <p>{userEmail}</p>
            <form onSubmit={handleUserSignUp} className='flex flex-col gap-6'>
            <div className='flex gap-8'>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            placeholder="Enter first name"
                            className="border border-black p-4 rounded-xl w-full"
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            placeholder="Enter last name"
                            className="border border-black p-4 rounded-xl w-full"
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <input
                        type='password'
                        name="userPassword"
                        value={userPassword}
                        placeholder="Password*"
                        required
                        className="border border-black p-4 rounded-xl w-full"
                        onChange={(e) => setUserPassword(e.target.value)}
                        />
                    <div className='relative'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmUserPassword"
                        value={confirmUserPassword}
                        placeholder="Rewrite Password*"
                        required
                        className="border border-black p-4 rounded-xl w-full"
                        onChange={(e) => setConfirmUserPassword(e.target.value)}
                        />
                        <div className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer' onClick={handleShowPassword}>
                            {showPassword ? 
                                <img src={view} alt="" className='w-5'/> 
                                : <img src={hide} alt="" className='w-5'/>}

                        </div>
                    </div>
                    {message && <p className='text-red-500'>{message}</p>}
                    <div className='flex gap-2 pl-2'>
                        <input type="checkbox"
                            required
                        />
                        <p>By continuing, I agree to our <span className=' underline'><a href="https://hanumantjain.com/" target='_blank' rel='noreferrer'>Privacy Policy</a></span></p>
                    </div>
                    
                    <div className='pr-5'>
                        <button className='float-right border rounded-full p-2.5 px-5 border-black bg-black text-white'>Sign In</button>
                    </div>

            </form>
        </div>
    </div>
  )
}

export default UserSignUp