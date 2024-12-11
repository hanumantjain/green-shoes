import React from 'react'
import { Link } from 'react-router-dom'
import icon from '../assets/icon.png'
import { FaUser, FaShoppingCart } from "react-icons/fa"
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import Logout from './Logout'

export const Navbar: React.FC = () => {
  const firstName = useSelector((state: RootState) => state.user.firstName)
  const userId = useSelector((state: RootState) => state.user.userId) // Assuming there's an id field for the user
  const items = useSelector((state: RootState) => state.cart.items)

  return (
    <div className='h-[93px] bg-white flex'>
      <div className='w-full flex items-center justify-around'>
        <div className='flex justify-center items-center'>
          <Link to='/home' className='flex justify-center items-center'>
            <img src={icon} alt="icon" className='w-28' />
            <h1 className='text-4xl font-bold'>PRAK</h1>
          </Link>
        </div>
        <div className='flex gap-10 font-semibold'>
          <Link to='/home' className='text-[19px]'>Home</Link>
          <Link to='/about' className='text-[19px]'>About</Link>
          <Link to='/products' className='text-[19px]'>Products</Link>
          <Link to='/contact' className='text-[19px]'>Contact</Link>
        </div>
        <div className='flex gap-6 text-2xl'>
          <span className='text-lg font-medium'>Hi, {firstName} </span>

          {userId !== "guest" ? (
            <Link to='/profile'>
              <FaUser />
            </Link>
          ) : (
            <span className='cursor-not-allowed text-gray-500'>
              <FaUser />
            </span>
          )}

          <Link to='/cart' className='relative'>
            <FaShoppingCart />
            {items.length > 0 && (
              <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                {items.length}
              </span>
            )}
          </Link>
          <Logout />
        </div>
      </div>
    </div>
  )
}
