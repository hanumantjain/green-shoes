import React, { FormEvent, useState } from 'react'
import axios, {AxiosError} from 'axios'
import { useLocation } from 'react-router-dom'

interface LocationState{
    userEmail: String
}

export const UserPassword:React.FC = () => {
    const[userPassword, setUserPassword] = useState<string>('')
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

  return (
    <div className='flex justify-center pt-20'>
        <div className='flex flex-col gap-5 w-1/3'>
            <p className='text-4xl'>What's your password?</p>
            <p>{email}</p>
            <form onSubmit={handleEmailSubmit} className='flex flex-col gap-6'>
                <input
                    type="password"
                    name="userPassword"
                    value={userPassword}
                    placeholder="Email*"
                    required
                    className="border border-black p-4 rounded-xl"
                    onChange={(e) => setUserPassword(e.target.value)}
                    />
                    <p className=' underline'><a href="https://hanumantjain.com/" target='_blank' rel='noreferrer'>Forgot Password?</a></p>
                    <div className='pr-5'>
                        <button className='float-right border rounded-full p-2.5 px-5 border-black bg-black text-white'>Sign In</button>
                    </div>

            </form>
        </div>
    </div>
  )
}
