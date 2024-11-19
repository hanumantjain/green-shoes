import React, { useState, FormEvent, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import DropDownCategory from '../AdminComponents/DropDownCategory';
import { Navbar } from '../AdminComponents/Navbar';

interface Size {
    size_id: string;
    size_label: string;
}

interface AddProductsProps {
    onLogOut: () => void;
}

const AddProducts: React.FC<AddProductsProps> = ({ onLogOut }) => {
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sizes, setSizes] = useState<Size[]>([]);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [imageURLs, setImageURLs] = useState<string[]>(['', '', '', '']); // For 4 images
    const [color, setColor] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [environmentalMessage, setEnvironmentalMessage] = useState<string>(''); // Changed to environmentalMessage
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await axios.post(`${backendBaseUrl}/addProducts`, {
                name,
                description,
                price,
                selectedCategory,
                color,
                category_id: selectedCategory,
                sizes: Object.entries(quantities).map(([sizeId, quantity]) => ({ size_id: sizeId, quantity })),
                image_urls: imageURLs.filter(url => url !== ''), // Filter out empty URLs
                environmental_message: environmentalMessage, // Changed to environmental_message
            });
            if (response.status === 201) {
                alert("Product added successfully!");
            }
            // Reset the form fields
            setCategories([0]);
            setName('');
            setDescription('');
            setPrice('');
            setImageURLs(['', '', '', '']);
            setColor('');
            setEnvironmentalMessage(''); // Reset environmental message
            setMessage(response.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            if (axiosError.response) {
                setMessage(axiosError.response.data.message);
            } else {
                setMessage('An error occurred');
            }
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${backendBaseUrl}/getCategory`);
                const categoryOptions = response.data.map((category: { category_id: number, category_name: string }) => ({
                    value: category.category_id.toString(),
                    label: category.category_name,
                }));
                setCategories(categoryOptions);
            } catch (error) {
                console.log('Error fetching categories', error);
            }
        };

        const fetchSizes = async () => {
            try {
                const response = await axios.get(`${backendBaseUrl}/getSizes`);
                const sizeOptions = response.data.map((size: { size_id: number, size_label: string }) => ({
                    size_id: size.size_id.toString(),
                    size_label: size.size_label,
                }));
                setSizes(sizeOptions);
            } catch (error) {
                console.log('Error fetching sizes', error);
            }
        };
        fetchCategories();
        fetchSizes();
    }, [backendBaseUrl]);

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    const handleQuantityChange = (sizeId: string, value: string) => {
        setQuantities((prev) => ({ ...prev, [sizeId]: parseInt(value) || 0 }));
    };

    const handleImageChange = (index: number, value: string) => {
        const updatedImageURLs = [...imageURLs];
        updatedImageURLs[index] = value;
        setImageURLs(updatedImageURLs);
    };

    return (
        <div>
            <Navbar onLogOut={onLogOut} />
            <div className="flex justify-center items-center p-4">
                <div className="flex flex-col w-3/4 gap-10 border border-black p-10 rounded">
                    <div className="text-center text-xl font-bold">Add Products</div>
                    {message && <p className="text-red-500 text-center">{message}</p>}
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-16">
                        {/* Left Column */}
                        <div className="flex flex-col gap-4">
                            <DropDownCategory categories={categories} onChange={handleCategoryChange} />
                            <input
                                type="text"
                                name="name"
                                value={name}
                                placeholder="Enter name"
                                className="border border-black p-4 rounded-xl w-full"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <textarea
                                name="description"
                                value={description}
                                placeholder="Enter Description"
                                className="border border-black p-4 rounded-xl w-full"
                                rows={3}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <input
                                type="number"
                                name="price"
                                value={price}
                                placeholder="Enter Price"
                                className="border border-black p-4 rounded-xl w-full"
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <input
                                type="text"
                                name="color"
                                value={color}
                                placeholder="Enter Color"
                                className="border border-black p-4 rounded-xl w-full"
                                onChange={(e) => setColor(e.target.value)}
                            />
                            <textarea
                                name="environmentalMessage"
                                value={environmentalMessage}
                                placeholder="Enter an environmental message"
                                className="border border-black p-4 rounded-xl w-full"
                                rows={4}
                                onChange={(e) => setEnvironmentalMessage(e.target.value)}
                            />
                        </div>
                        {/* Right Column */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <h2>Enter Stock Quantities per Size:</h2>
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                    {sizes.map((size) => (
                                        <div key={size.size_id} className="flex items-center">
                                            <label className="mr-2">{size.size_label}:</label>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                value={quantities[size.size_id] || ''}
                                                onChange={(e) => handleQuantityChange(size.size_id, e.target.value)}
                                                className="border border-black py-4 rounded-xl w-full text-center"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h2>Upload Images:</h2>
                                {imageURLs.map((image, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        name={`imageURL${index}`}
                                        value={image}
                                        placeholder={`Enter image URL ${index + 1}`}
                                        className="border border-black p-4 rounded-xl w-full mt-2"
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <button className="border border-black h-8 px-5 rounded" type="submit">
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProducts;
