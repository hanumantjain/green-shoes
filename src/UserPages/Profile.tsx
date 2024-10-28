import React from 'react'
import { Navbar } from '../UserComponents/Navbar'
import SideNavbar from '../UserComponents/SideNavbar'

const Profile:React.FC = () => {
  return (
    <div>
        <div>
            <Navbar />
        </div>
        <div className='w-full flex'>
            <div className='w-1/6'>
                <SideNavbar />
            </div>
            <div>
                Hi
            </div>
        </div>
    </div>
  )
}

export default Profile