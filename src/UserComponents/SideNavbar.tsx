import React from 'react'
import { Link } from 'react-router-dom'

const SideNavbar:React.FC = () => {
  return (
    <div className='flex flex-col gap-3 pl-10 pt-10'>
      <h1 className='pb-10 text-xl font-medium'>Hello !</h1>
      <Link to='/' className=' cusrsor-pointer hover:underline'>Account</Link>
      <Link to='/' className=' cusrsor-pointer hover:underline'>Orders</Link>
      <Link to='/' className=' cusrsor-pointer hover:underline'>Address</Link>
      <Link to='/' className=' cusrsor-pointer hover:underline'>Payment Mode</Link>
    </div>
    
  )
}

export default SideNavbar