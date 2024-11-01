import React, { useState, FormEvent, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import DropDownCategory from '../AdminComponents/DropDownCategory'
import { Navbar } from '../AdminComponents/Navbar'

interface Size {
    size_id: string
    size_label: string
}

interface AddProductsProps {
    onLogOut: () => void
}

const AddProducts: React.FC<AddProductsProps> = ({ onLogOut }) => {
    const [categories, setCategories] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [sizes, setSizes] = useState<Size[]>([])
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [imageURL, setImageURL] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setMessage('')
        try {
            const response = await axios.post(`${backendBaseUrl}/addProducts`, {
                name,
                description,
                price,
                selectedCategory,
                image_URL : imageURL,
                category_id: selectedCategory,
                sizes: Object.entries(quantities).map(([sizeId, quantity]) => ({ size_id: sizeId, quantity })),
            })
            if (response.status === 201) {
                alert("Product added successfully!");
            }
            setCategories([0])
            setName('')
            setDescription('')
            setPrice('')
            setImageURL('')
            setMessage(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            if (axiosError.response) {
                setMessage(axiosError.response.data.message)
            } else {
                setMessage('An error occurred')
            }
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${backendBaseUrl}/getCategory`)
                const categoryOptions = response.data.map((category: { category_id : number, category_name: string }) => ({
                    value: category.category_id.toString(),
                    label: category.category_name,
                }))
                setCategories(categoryOptions)
            } catch (error) {
                console.log('Error fetching categories', error)
            }
        }

        const fetchSizes = async () => {
            try {
                const response = await axios.get(`${backendBaseUrl}/getSizes`)
                const sizeOptions = response.data.map((size: { size_id : number, size_label: string }) => ({
                    size_id: size.size_id.toString(),
                    size_label: size.size_label,
                }))
                setSizes(sizeOptions)
            } catch (error) {
                console.log('Error fetching sizes', error)
            }
        }
        fetchCategories()
        fetchSizes()
    }, [backendBaseUrl])

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value)
    }
    const handleQuantityChange = (sizeId: string, value: string) => {
        setQuantities((prev) => ({ ...prev, [sizeId]: parseInt(value) || 0 }))
    }

    return (
        <div>
            <Navbar onLogOut={onLogOut}/>
        <div className="flex justify-center items-center">
            <div className="flex flex-col gap-6 border border-black w-1/3 p-10 text-center rounded">
                <div>Add Products</div>
                {message && <p className="text-red-500">{message}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <DropDownCategory categories={categories} onChange={handleCategoryChange}/>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        placeholder="Enter name"
                        className="border border-black p-4 rounded-xl w-full"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        value={description}
                        placeholder="Enter Description"
                        className="border border-black p-4 rounded-xl w-full"
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
                        name="imageURL"
                        value={imageURL}
                        placeholder="Enter image URL"
                        className="border border-black p-4 rounded-xl w-full"
                        onChange={(e) => setImageURL(e.target.value)}
                    />
                    
                    <div className="">
                        <h2 className="">Enter Stock Quantities per Size:</h2>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                            {sizes.map((size) => (
                                <div key={size.size_id} className="flex items-center">
                                    <label className="mr-2">{size.size_label}:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder='0'
                                        value={quantities[size.size_id] || ''}
                                        onChange={(e) => handleQuantityChange(size.size_id, e.target.value)}
                                        className="border border-black py-4 rounded-xl w-full text-center"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <button className="border border-black h-8 px-5 rounded" type="submit">
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    )
}

export default AddProducts