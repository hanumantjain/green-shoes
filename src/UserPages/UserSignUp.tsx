import React, { FormEvent, useState } from 'react'
import axios, { AxiosError } from 'axios'

interface UserSignUp {
    userEmail: String
}

const UserSignUp:React.FC = () => {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [userPassword, setUserPassword] = useState<string>('')
    const [confirmUserPassword, setConfirmUserPassword] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL

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

  return (
    <div className='flex justify-center pt-20'>
        <div className='flex flex-col gap-5 w-1/3'>
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
  )
}

export default UserSignUp