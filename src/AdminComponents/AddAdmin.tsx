import React, { useState, FormEvent } from 'react'
import axios, { AxiosError } from 'axios'
import { Navbar } from '../AdminComponents/Navbar';

interface AddAdmin {
    onLogOut: () => void;
}

const AddAdmin: React.FC<AddAdmin> = ({onLogOut}) => {
    const [name, setName] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setMessage('')
        try {
            const response = await axios.post(`${backendBaseUrl}/adminHome`, {
                name,
                username,
                password
            })
            setMessage(response.data.message)
            setName('')
            setUsername('')
            setPassword('')
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            if (axiosError.response) {
                setMessage(axiosError.response.data.message)
            } else {
                setMessage('An error occurred')
            }
        }
    }

    return (
        <div>
            <Navbar onLogOut={onLogOut} />
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col gap-6 border border-black w-1/3 p-10 text-center rounded">
                <div>Add Admin</div>
                {message && <p className="text-red-500">{message}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <input
                        type="text"
                        name="name"
                        value={name}
                        placeholder="Enter name"
                        className="border border-black p-4 rounded-xl w-full"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        name="username"
                        value={username}
                        placeholder="Enter email"
                        className="border border-black p-4 rounded-xl w-full"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Enter password"
                        className="border border-black p-4 rounded-xl w-full"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div>
                        <button className="border border-black h-8 px-5 rounded" type="submit">
                            Add Admin
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default AddAdmin;
