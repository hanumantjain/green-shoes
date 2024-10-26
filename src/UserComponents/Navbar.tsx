import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/UserAuthContext'

export const Navbar:React.FC = () => {
    const { userEmail, isAuthenticated, UserLogout } = useAuth()
    const handleLogout = () => {
        UserLogout();
    }

  return (
    <div className='h-[93px] bg-white flex'>
        <div className='w-full flex items-center justify-around'>
            <div className='text-3xl font-semibold leading-[54px]'>
                GREEN SHOES
            </div>
            <div className='flex gap-10 '>
                <Link to='/' className='text-[19px] font-medium'>Home</Link>
                <Link to='/' className='text-[19px] font-medium'>About</Link>
                <Link to='/products' className='text-[19px] font-medium'>Products</Link>
                <Link to='/' className='text-[19px] font-medium'>Contact</Link>
            </div>
            <div className='flex items-center gap-5'>
                    {isAuthenticated ? (
                        <>
                            <span className='text-[19px] font-medium'>{userEmail}</span>
                            <button
                                className='text-[19px] font-medium text-red-500 hover:text-red-700'
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to='/userSignIn' className='text-[19px] font-medium'>Login/SignUp</Link>
                    )}
                    <Link to='/cart' className='text-[19px] font-medium'>Cart</Link>
                </div>
        </div>
    </div>
  )
}
