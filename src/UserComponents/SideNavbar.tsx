import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const SideNavbar: React.FC = () => {
  const navigate = useNavigate()

  const handleClick =() => {
    navigate('/profile')
  }
  return (
    <div className="flex flex-col gap-6 pl-10 pt-10 font-bold">
      <div onClick={handleClick} className=' hover:underline cursor-pointer'>
        User
      </div>
      <NavLink
        to="orders"
        className={({ isActive }) =>
          `cursor-pointer hover:underline ${isActive ? 'font-bold' : ''}`
        }
      >
        Orders
      </NavLink>
      <NavLink
        to="add"
        className={({ isActive }) =>
          `cursor-pointer hover:underline ${isActive ? 'font-bold' : ''}`
        }
      >
        Address
      </NavLink>
      <NavLink
        to="payment"
        className={({ isActive }) =>
          `cursor-pointer hover:underline ${isActive ? 'font-bold' : ''}`
        }
      >
        Payment Mode
      </NavLink>
      
    </div>
  )
}

export default SideNavbar
