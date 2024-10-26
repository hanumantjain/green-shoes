import React from 'react'
import AddAdmin from '../AdminComponents/AddAdmin'

interface AdminHomeProps {
    onLogOut: () => void
}

const AdminHome: React.FC<AdminHomeProps> = ({ onLogOut }) => {
    return (
        <div className="p-10">
            AdminHome
            <div
                className="border border-black w-1/6 cursor-pointer text-center"
                onClick={onLogOut}
            >
                Log out
            </div>
            <div>
                <AddAdmin />
            </div>
        </div>
    );
};

export default AdminHome;
