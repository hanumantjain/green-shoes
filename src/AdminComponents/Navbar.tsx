import React from 'react'
import { Link } from 'react-router-dom'
import icon from '../assets/icon.png'

interface NavbarProps {
    onLogOut: () => void
  }

export const Navbar:React.FC<NavbarProps> = ({ onLogOut }) => {

  return (
    <div className='h-[93px] bg-white flex'>
        <div className='w-full flex items-center justify-around'>
            <div className='flex justify-center items-center'>
                <img src={icon} alt="icon" className='w-28' />
                <h1 className='text-4xl font-bold'>PRAK</h1>
            </div>
            <div className='flex gap-10 font-semibold'>
                <Link to='/dashboard' className='text-[19px]'>Home</Link>
            </div>
            <div>
                <Link to='/addAdmin' className='text-[19px] font-semibold'>Add Admin</Link>
            </div>
            <div>
                <button className='text-[19px] font-semibold' onClick={onLogOut}>Log Out</button>
            </div>
        </div>
    </div>
  )
}
