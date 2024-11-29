import React from 'react'
import { Navbar } from '../UserComponents/Navbar'
import SideNavbar from '../UserComponents/SideNavbar'
import { Outlet } from 'react-router-dom'

const Profile: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <div>
        <Navbar />
      </div>
      {/* Layout with Sticky Sidebar and Main Content */}
      <div className="w-full flex">
        <div className="w-1/6 sticky top-0 h-screen">
          <SideNavbar />
        </div>
        <div className="w-5/6 p-5">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Profile
