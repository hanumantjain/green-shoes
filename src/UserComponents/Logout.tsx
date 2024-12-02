import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearUser } from '../Features/cart/UserSlice'

const Logout: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state: any) => state.user)

    const isGuest = user?.userId === 'guest'

    const handleLogout = () => {
        dispatch(clearUser()) 
        navigate('/userSignIn')  
    }

    const handleSignInRedirect = () => {
        navigate('/userSignIn') 
    }

    return (
        <button 
            onClick={isGuest ? handleSignInRedirect : handleLogout} 
            className='text-lg bg-[#f6e0c5] px-5 rounded'
        >
            {isGuest ? 'Sign In' : 'Log Out'}
        </button>
    )
}

export default Logout
