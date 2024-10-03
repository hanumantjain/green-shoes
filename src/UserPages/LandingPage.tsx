import React, { FormEvent, useState } from 'react'

export const LandingPage:React.FC = () => {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    const handleUserSignUp = async (e: FormEvent) => {
        e.preventDefault()

        if(password === confirmPassword){
            setMessage('Profile Created')
            setFirstName('')
            setLastName('')
            setUsername('')
            setPassword('')
            setConfirmPassword('')
        }else{
            setMessage('Password dosen\'t match')
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
                        type="email"
                        name="username"
                        value={username}
                        placeholder="Enter email"
                        className="border border-black p-1"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Enter password"
                        className="border border-black p-1"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        placeholder="Rewrite password"
                        className="border border-black p-1"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div>
                        <button className="border border-black h-8 px-5 rounded" type="submit">
                            Add Admin
                        </button>
                    </div>
                </form>
            </div>
            
        </div>
        <div>
            Hi
        </div>
    </div>
  )
}
