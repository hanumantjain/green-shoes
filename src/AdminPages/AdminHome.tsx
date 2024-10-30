import React from 'react'
import { Navbar } from '../AdminComponents/Navbar';

interface AdminHomeProps {
    onLogOut: () => void
}

const AdminHome: React.FC<AdminHomeProps> = ({ onLogOut }) => {
    return (
        <div>
            <div>
                <Navbar onLogOut={onLogOut}/>
            </div>
            <div>
                
            </div>
        </div>
    );
};

export default AdminHome;
