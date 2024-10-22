import React, { ChangeEvent, FormEvent, useState } from 'react'
import view from '../assets/view.png'
import hide from '../assets/hide.png'
import axios from 'axios'

interface AdminLoginProps {
    onLogin : ( isLoggedIn : boolean ) => void
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [resultMessage, setResultMessage] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const backendBaseUrl = process.env.REACT_APP_BACKEND_BASEURL

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try{
            const response = await axios.post(`${backendBaseUrl}/admin`, { username, password })
            console.log(response)
            if(response.status === 200){
                onLogin(true)
            }
            setResultMessage(response.data.message)
        }catch (error: any) {
            setResultMessage(error.response.data.message)
        }
        setUsername('')
        setPassword('')
    }

    const handleUsernameChange = (e : ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e : ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleShowPassword = () => {
        setShowPassword(prevState => !prevState)
    }

  return (
    <div className='flex justify-center pt-20'>
    <div className='flex flex-col gap-5 w-1/3'>
        <p className='text-4xl pb-10'>Admin Login</p>
        {resultMessage && <p className='text-red-500'>{resultMessage}</p>}
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <input 
                    type='text'
                    value={username}
                    placeholder='Enter your email'
                    className='border border-black p-4 rounded-xl w-full'
                    onChange={handleUsernameChange}
                    required
                />
            <div className='relative'>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
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
