import React, { useState, useEffect } from 'react'

interface EditProductCardProps {
    product: any
    allSizes: any[]
    onSave: (updatedProduct: any) => void
    onClose: () => void
}

const EditProductCard: React.FC<EditProductCardProps> = ({ product, allSizes, onSave, onClose }) => {
    const [name, setName] = useState<string>(product.name || '')
    const [description, setDescription] = useState<string>(product.description || '')
    const [price, setPrice] = useState<number | string>(product.price || '')
    const [imageURLs, setImageURLs] = useState<string[]>(product.image_urls || ['', '', '', ''])
    const [color, setColor] = useState<string>(product.color || '')
    const [quantities, setQuantities] = useState<any>({})
    const [environmentalMessage, setEnvironmentalMessage] = useState<string>(product.environmental_message || '')

    useEffect(() => {
        const sizeQuantities = product.sizes.reduce((acc: any, size: any) => {
            acc[size.size_label] = size.stock_quantity || 0
            return acc;
        }, {});
        setQuantities(sizeQuantities)
    }, [product])

    const handleSave = () => {
        const updatedProduct = {
            ...product,
            name,
            description,
            price,
            image_urls: imageURLs,
            color,
            environmental_message: environmentalMessage,
            sizes: allSizes.map((size) => ({
                size_id: size.size_id,
                size_label: size.size_label,
                stock_quantity: quantities[size.size_label] || 0,
            })),
        };

        onSave(updatedProduct);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-y-auto">
                <h3 className="text-2xl font-bold mb-4">Edit Product</h3>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Color</label>
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Environmental Message</label>
                        <textarea
                            value={environmentalMessage}
                            onChange={(e) => setEnvironmentalMessage(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Image URLs</label>
                        <div className="grid grid-cols-2 gap-4">
                            {imageURLs.map((url, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={url}
                                    onChange={(e) => {
                                        const updatedURLs = [...imageURLs];
                                        updatedURLs[index] = e.target.value;
                                        setImageURLs(updatedURLs);
                                    }}
                                    className="w-full p-2 border rounded"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 text-white px-4 py-2 rounded ml-4"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProductCard
