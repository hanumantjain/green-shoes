import React, { FormEvent, useState } from 'react'
import axios, {AxiosError} from 'axios'
import { useNavigate } from 'react-router-dom'

export const SignIn:React.FC = () => {
    const[userEmail, setUserEmail] = useState<string>('')
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL
    const navigate = useNavigate()

    const handleEmailSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try{
            const response = await axios.post(`${backendBaseUrl}/checkUser`, {
                userEmail,
            })
            if (response.status === 200) {
                navigate('/userPassword')
            }
            else{
                navigate('/userSignUp')
            }
            setUserEmail('')

        }catch (error) {
            const axiosError = error as AxiosError<{ message: string }>
                console.error('Error checking user:', axiosError)
        }
    }

  return (
    <div className='flex justify-center pt-20'>
        <div className='flex flex-col gap-5 w-1/3'>
            <p className='text-4xl'>Enter your email to join us or sign in.</p>
            <p className='pb-5'>United States</p>
            <form onSubmit={handleEmailSubmit} className='flex flex-col gap-6'>
                <input
                    type="email"
                    name="userEmail"
                    value={userEmail}
                    placeholder="Email*"
                    required
                    className="border border-black p-4 rounded-xl"
                    onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <p>By continuing, I agree to our <span className=' underline'><a href="https://hanumantjain.com/" target='_blank' rel='noreferrer'>Privacy Policy</a></span></p>
                    <div className='pr-5'>
                        <button className='float-right border rounded-full p-2.5 px-5 border-black bg-black text-white'>Continue</button>
                    </div>

            </form>
        </div>
    </div>
  )
}
