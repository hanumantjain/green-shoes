import React from 'react'
import { Link } from 'react-router-dom'
import icon from '../assets/icon.png'
import { FaUser, FaShoppingCart } from "react-icons/fa"

export const Navbar:React.FC = () => {

  return (
    <div className='h-[93px] bg-white flex'>
        <div className='w-full flex items-center justify-around'>
            <div className='flex justify-center items-center'>
                <img src={icon} alt="icon" className='w-28' />
                <h1 className='text-4xl font-bold'>PRAK</h1>
            </div>
            <div className='flex gap-10 font-semibold'>
                <Link to='/home' className='text-[19px]'>Home</Link>
                <Link to='/about' className='text-[19px]'>About</Link>
                <Link to='/products' className='text-[19px]'>Products</Link>
                <Link to='/home' className='text-[19px]'>Contact</Link>
            </div>
            <div className='flex gap-6 text-2xl'>
                <Link to='/profile'><FaUser /></Link>
                <Link to='/cart'><FaShoppingCart /></Link>
            </div>
        </div>
    </div>
  )
}
