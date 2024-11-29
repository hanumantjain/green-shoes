import React, { FormEvent, useState } from 'react'
import { Navbar } from '../UserComponents/Navbar'
import axios, { AxiosError } from 'axios'

const Contact:React.FC = () => {
    const [message, setMessage] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL

  const handleContact = async (e: FormEvent) => {
    e.preventDefault()
    try{
      await axios.post(`${backendBaseUrl}/contact`, {
          message,
          lastName
      })
      setMessage('')
      setLastName('')

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
    <div>
      <Navbar />
      <div>
        <h1 className='text-center text-2xl font-semibold p-10'>WE'D LOVE TO HEAR FROM YOU</h1>
        <p className='text-center'>
          Have questions, feedback, or just want to say hello? <br /> Reach out to us!
          We're here to assist you with any inquiries <br />and make your experience as smooth as possible.
        </p>
        <div className='flex justify-center items-center pt-10'>
          <form onSubmit={handleContact} className='flex flex-col gap-6 w-1/3'>
            <input
                type="text"
                name="firstName"
                value={message}
                placeholder="Enter first name"
                className="border border-black p-4 rounded-xl w-full"
                onChange={(e) => setMessage(e.target.value)}
                required
            />
            <textarea
                name="message"
                value={message}
                placeholder="Enter the message"
                className="border border-black p-4 rounded-xl w-full"
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
            />
            <div className='pr-5'>
                <button className='float-right border rounded-full p-2.5 px-5 border-black bg-black text-white'>Sign In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact