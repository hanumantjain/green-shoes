import React, { FormEvent, useState, ChangeEvent } from 'react'
import axios, {AxiosError} from 'axios'
import { useLocation } from 'react-router-dom'
import view from '../assets/view.png'
import hide from '../assets/hide.png'

interface LocationState{
    userEmail: String
}

export const UserPassword:React.FC = () => {
    const[userPassword, setUserPassword] = useState<string>('')
    const[showPassword, setShowPassword] = useState<boolean>(false)
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL

    const location = useLocation()
    const email = (location.state as LocationState)?.userEmail

    const handleEmailSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try{
            const response = await axios.post(`${backendBaseUrl}/checkUser`, {
                email,
                userPassword,
            })
            
            setUserPassword('')

        }catch (error) {
            const axiosError = error as AxiosError<{ message: string }>
                console.error('Error checking user:', axiosError)
        }
    }

    const handleShowPassword = () => {
        setShowPassword(prevState => !prevState)
    }
    const handlePasswordChange = (e : ChangeEvent<HTMLInputElement>) => {
        setUserPassword(e.target.value)
    }

  return (
    <div className='flex justify-center pt-20'>
        <div className='flex flex-col gap-5 w-1/3'>
            <p className='text-4xl'>What's your password?</p>
            <p>{email}</p>
            <form onSubmit={handleEmailSubmit} className='flex flex-col gap-6'>
                <div className='relative'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="userPassword"
                        value={userPassword}
                        placeholder="Password*"
                        required
                        className="border border-black p-4 rounded-xl w-full"
                        onChange={handlePasswordChange}
                        />
                        <div className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer' onClick={handleShowPassword}>
                            {showPassword ? 
                                <img src={view} alt="" className='w-5'/> 
                                : <img src={hide} alt="" className='w-5'/>}

                        </div>
                    </div>
                    <p className=' underline'><a href="https://hanumantjain.com/" target='_blank' rel='noreferrer'>Forgot Password?</a></p>
                    <div className='pr-5'>
                        <button className='float-right border rounded-full p-2.5 px-5 border-black bg-black text-white'>Sign In</button>
                    </div>

            </form>
        </div>
    </div>
  )
}
