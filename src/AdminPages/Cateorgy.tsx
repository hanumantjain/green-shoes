import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Navbar } from '../AdminComponents/Navbar'
import EditProductCard from '../AdminComponents/EditProductCard'

interface CategoryProps {
    onLogOut: () => void
}

const Category: React.FC<CategoryProps> = ({ onLogOut }) => {
    const [categories, setCategories] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [products, setProducts] = useState<any[]>([])
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [allSizes, setAllSizes] = useState<any[]>([])
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${backendBaseUrl}/getCategory`)
                setCategories(response.data)
            } catch (error) {
                console.error('Error fetching categories', error)
            }
        };
        fetchCategories();
    }, [backendBaseUrl]);

    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const response = await axios.get(`${backendBaseUrl}/getSizes`)
                setAllSizes(response.data)
            } catch (error) {
                console.error('Error fetching sizes', error)
            }
        };
        fetchSizes()
    }, [backendBaseUrl])

    useEffect(() => {
        if (selectedCategory) {
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(`${backendBaseUrl}/getCategory/${selectedCategory}/products`)
                    setProducts(response.data);
                } catch (error) {
                    console.error('Error fetching products', error)
                }
            };
            fetchProducts()
        }
    }, [selectedCategory, backendBaseUrl])

    const handleSaveProduct = async (updatedProduct: any) => {
        try {
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(`${backendBaseUrl}/getCategory/${selectedCategory}/products`)
                    setProducts(response.data);
                } catch (error) {
                    console.error('Error fetching products after update', error)
                }
            }
            fetchProducts()

            setEditingProduct(null)
        } catch (error) {
            console.error('Error updating product', error)
        }
    }

    return (
        <div>
            <Navbar onLogOut={onLogOut} />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Categories</h2>
                <div className="flex flex-wrap gap-4 mb-8">
                    {categories.map((category) => (
                        <div
                            key={category.category_id}
                            className={`p-4 border rounded-lg shadow-md cursor-pointer ${
                                selectedCategory === category.category_id ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={() => setSelectedCategory(category.category_id)}
                        >
                            {category.category_name}
                        </div>
                    ))}
                </div>

                {selectedCategory && (
                    <>
                        <h3 className="text-xl font-bold mb-4">
                            Products in {categories.find((cat) => cat.category_id === selectedCategory)?.category_name}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product) => (
                                <div
                                    key={product.product_id}
                                    className="bg-white p-4 rounded shadow cursor-pointer"
                                    onClick={() => setEditingProduct(product)}
                                >
                                    <img
                                        src={product.image_urls?.[0] || 'default-image-url.jpg'}
                                        alt={product.name}
                                        className="h-40 w-full object-cover rounded mb-4"
                                    />
                                    <h4 className="text-lg font-semibold">{product.name}</h4>
                                    <p className="text-gray-600">{product.description}</p>
                                    <p className="text-blue-500 font-bold mt-2">${product.price}</p>
                                    <p className="text-gray-500">Color: {product.color}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {editingProduct && (
                    <EditProductCard
                        product={editingProduct}
                        allSizes={allSizes}
                        onSave={handleSaveProduct}
                        onClose={() => setEditingProduct(null)}
                    />
                )}
            </div>
        </div>
    )
}

export default Category
