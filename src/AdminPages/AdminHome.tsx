import React from 'react'
import { Navbar } from '../AdminComponents/Navbar';
import { Link } from 'react-router-dom';

interface AdminHomeProps {
    onLogOut: () => void
}

const AdminHome: React.FC<AdminHomeProps> = ({ onLogOut }) => {
    return (
        <div>
            <div>
                <Navbar onLogOut={onLogOut}/>
            </div>
            <div className='p-20'>
                <div>
                    <h1>Product Management</h1>
                    <div className='flex gap-10 text-center py-10'>
                        <Link to='/addProducts' className='w-1/4 border border-black p-4 cursor-pointer'>
                            Add New Product
                        </Link>
                        <Link to='/category' className='w-1/4 border border-black p-4 cursor-pointer'>
                            Categorize Product
                        </Link>
                    </div>
                </div>
                <div>
                    <h1>Promotions and Discounts</h1>
                    <div className='flex gap-10 text-center py-10'>
                        <div className='w-full border border-black p-4 cursor-pointer'>
                        <Link to='/managePromotions' className='w-1/4 border border-black p-4 cursor-pointer'>
                            Manage Promotions
                        </Link>
                        {/* <Link to='/addPromotion' className='w-1/4 border border-black p-4 cursor-pointer'>
                            Add New Promotion
                        </Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
