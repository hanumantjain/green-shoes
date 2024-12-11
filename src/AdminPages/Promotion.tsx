import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Navbar } from '../AdminComponents/Navbar'

interface PromotionProps {
    onLogOut: () => void
}
const Promotion: React.FC<PromotionProps> = ({ onLogOut }) => {
    const [promotions, setPromotions] = useState([]);
    const [newPromotion, setNewPromotion] = useState({
        product_id: 0,
        discount_type: '',
        discount_value: '',
        discount_start: '',
        discount_end: '',
        is_active: true,
    });
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL
    // Fetch promotions on load
    useEffect(() => {
        fetchPromotions();
    }, []);
    const fetchPromotions = async () => {
        try {
            const response = await axios.get(`${backendBaseUrl}/getProducts/promotions`); // Replace with your API endpoint
            setPromotions(response.data);
        } catch (error) {
            console.error('Error fetching promotions:', error);
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPromotion({ ...newPromotion, [name]: value });
    };
    const handleAddPromotion = async () => {
        const productId = parseInt(newPromotion.product_id as unknown as string, 10);
        if (isNaN(productId)) {
            console.error("Invalid product ID");
            return;
        }
        try {
            console.log(newPromotion)
            const response = await axios.put(
                `${backendBaseUrl}/addProducts/${productId}/discount`, // Pass the product_id in the URL
                {
                    discountType: newPromotion.discount_type,
                    discountValue: newPromotion.discount_value,
                    discountStart: newPromotion.discount_start,
                    discountEnd: newPromotion.discount_end,
                    isActive: newPromotion.is_active,
                }
            );
            fetchPromotions();
            setNewPromotion({
                product_id: 0,
                discount_type: '',
                discount_value: '',
                discount_start: '',
                discount_end: '',
                is_active: true,
            });
        } catch (error) {
            console.error('Error adding promotion:', error);
        }
    };
    const togglePromotionStatus = async (id: number, currentStatus: boolean) => {
        try {
            await axios.patch(`/getProducts/promotions/${id}`, { is_active: !currentStatus }); // Replace with your API endpoint
            fetchPromotions();
        } catch (error) {
            console.error('Error toggling promotion status:', error);
        }
    };
    return (
        <div><Navbar onLogOut={onLogOut} />
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">Promotion Management</h1>
            {/* Add Promotion Form */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Add New Promotion</h2>
                <div className="grid gap-4">
                    <input
                        type="text"
                        name="product_id"
                        placeholder="Product ID"
                        value={newPromotion.product_id}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 rounded"
                    />
                    <select
                        name="discount_type"
                        value={newPromotion.discount_type}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Select Discount Type</option>
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                    </select>
                    <input
                        type="number"
                        name="discount_value"
                        placeholder="Discount Value"
                        value={newPromotion.discount_value}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input
                        type="date"
                        name="discount_start"
                        value={newPromotion.discount_start}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input
                        type="date"
                        name="discount_end"
                        value={newPromotion.discount_end}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 rounded"
                    />
                    <button
                        onClick={handleAddPromotion}
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Add Promotion
                    </button>
                </div>
            </div>
            {/* Display Existing Promotions */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Existing Promotions</h2>
                <table className="w-full border border-gray-300 text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border border-gray-300">Product ID</th>
                            <th className="p-2 border border-gray-300">Type</th>
                            <th className="p-2 border border-gray-300">Value</th>
                            <th className="p-2 border border-gray-300">Start</th>
                            <th className="p-2 border border-gray-300">End</th>
                            <th className="p-2 border border-gray-300">Status</th>
                            <th className="p-2 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.map((promotion: any) => (
                            <tr key={promotion.id} className="hover:bg-gray-50">
                                <td className="p-2 border border-gray-300">{promotion.product_id}</td>
                                <td className="p-2 border border-gray-300">{promotion.discount_type}</td>
                                <td className="p-2 border border-gray-300">{promotion.discount_value}</td>
                                <td className="p-2 border border-gray-300">{promotion.discount_start}</td>
                                <td className="p-2 border border-gray-300">{promotion.discount_end}</td>
                                <td className="p-2 border border-gray-300">
                                    {promotion.is_active ? 'Active' : 'Inactive'}
                                </td>
                                <td className="p-2 border border-gray-300">
                                    <button
                                        onClick={() =>
                                            togglePromotionStatus(promotion.id, promotion.is_active)
                                        }
                                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                    >
                                        {promotion.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    );
}
export default Promotion;