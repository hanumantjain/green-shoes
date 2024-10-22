import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar:React.FC = () => {
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
            <div className='flex gap-5'>
                <Link to='/userSignIn' className='text-[19px] font-medium'>Login/SignUp</Link>
                <Link to='/' className='text-[19px] font-medium'>Cart</Link>
            </div>
        </div>
    </div>
  )
}
