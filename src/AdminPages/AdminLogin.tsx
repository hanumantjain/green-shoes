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
    <div className='flex items-center justify-center h-screen'>
        <div className='flex flex-col gap-6 border border-black w-1/4 p-10 text-center rounded'>
            <div className=''>
                Admin Login
            </div>
            {resultMessage && <p className='text-red-500'>{resultMessage}</p>}
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                <input 
                    type='text'
                    value={username}
                    placeholder='Enter your email'
                    className='border border-black h-8 p-1 rounded w-full'
                    onChange={handleUsernameChange}
                    required
                />
                <div className='relative '>
                    <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        placeholder='Enter your password'
                        className='border border-black h-8 p-1 rounded w-full'
                        onChange={handlePasswordChange}
                        required
                    />
                    <div className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer' onClick={handleShowPassword}>
                        {showPassword ? 
                            <img src={view} alt="" className='w-5'/> 
                            : <img src={hide} alt="" className='w-5'/>}

                    </div>
                </div>
                

                <div>
                    <button className='border border-black h-8 px-5 rounded' type="submit">
                        Log in
                    </button>
                </div>
            </form>

        </div>
    </div>
  )
}
