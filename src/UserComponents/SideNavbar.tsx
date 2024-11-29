import React from 'react'
import { NavLink } from 'react-router-dom'

const SideNavbar: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 pl-10 pt-10">
      <h1 className="pb-10 text-xl font-medium">Hello!</h1>
      <NavLink
        to="orders"
        className={({ isActive }) =>
          `cursor-pointer hover:underline ${isActive ? 'font-bold' : ''}`
        }
      >
        Orders
      </NavLink>
      <NavLink
        to="address"
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
