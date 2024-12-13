import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const OrderConfirm: React.FC = () => {
  const [seconds, setSeconds] = useState(3)
  const navigate = useNavigate()

  // Use useEffect to handle the countdown and redirection
  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer) // Clean up interval on component unmount
    } else {
      navigate('/home')
    }
  }, [seconds, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 border-2 border-red-400 rounded-lg text-red-700 text-center w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-4">Order placed successfully</h2>
        <p className="text-xl">Redirecting to homepage in {seconds} second{seconds !== 1 ? 's' : ''}...</p>
      </div>
    </div>
  )
}

export default OrderConfirm
