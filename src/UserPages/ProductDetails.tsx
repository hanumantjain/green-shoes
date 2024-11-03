import React, { useEffect, useState } from 'react'
import img from '../assets/shoes.jpg'
import { useParams } from 'react-router-dom';
import { Navbar } from '../UserComponents/Navbar'
import axios from 'axios'

type CartItem = {
  id: number
  title: string
  price: number
  size: number
  image: string
}

type ProductDetailsProps = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
}

const ProductDetails:React.FC<ProductDetailsProps> = ({ addToCart }) => {
    const {id} = useParams<{id: string}>()
    const[product, setProduct] = useState<any>(null)
    const[selectedSize, setSelectedSize] = useState<number | null>(null)
    const[error, setError] = useState<string | null>(null)
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL

    useEffect(() => {
      const fetchProduct = async () => {
        try{
          const response = await axios.get(`${backendBaseUrl}/getProducts/${id}`)
          if(response.status === 200){
            setProduct(response.data)
          }else{
            throw new Error('Product not found')
          }
        }catch (error: any){
          setError(error.message)
        }
      }
      fetchProduct()
    }, [id, backendBaseUrl])

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart({
        id: product.product_id,
        title: product.name,
        price: product.price,
        size: selectedSize,
        image: product.image_url || img
      })
      alert(`Added ${product.name} - Size ${selectedSize} to cart`)
      setSelectedSize(null)
      setError(null)
    }else{
      setError('Please select a size')
    }
  }

  const handleSize = (size: number) =>{
    setSelectedSize(size)
    setError(null)
  }

  if (!product) {
    return <div>Product not found.</div>; // Handle case where product is null
}
    
  return (
    <div>
      <Navbar />
      <div className="flex px-32 w-full pt-20">
        <div className='w-1/2'>
          <img src={img} alt={product.name} className="w-full object-cover" />
        </div>
        <div className='pl-20 flex flex-col gap-3'>
          <div>
            <h2 className="text-4xl font-bold">{product.name}</h2>
            <p>{product.price}</p>
          </div>
          <div>
            <h1>Size</h1>
            <div className={`flex gap-12 ${error ? 'border border-red-500 p-2' : ''}`}>
              <div className='flex flex-col gap-5'>
                <div className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === 6 ? 'bg-gray-200' : ''}`} onClick={() => handleSize(6)}>W 6</div>
                <div className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === 7 ? 'bg-gray-200' : ''}`} onClick={() => handleSize(7)}>W 7</div>
                <div className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === 8 ? 'bg-gray-200' : ''}`} onClick={() => handleSize(8)}>W 8</div>
              </div>
              <div className='flex flex-col gap-5'>
                <div className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === 9 ? 'bg-gray-200' : ''}`} onClick={() => handleSize(9)}>W 9</div>
                <div className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === 10 ? 'bg-gray-200' : ''}`} onClick={() => handleSize(10)}>W 10</div>
                <div className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === 11 ? 'bg-gray-200' : ''}`} onClick={() => handleSize(11)}>W 11</div>
              </div>
              <div className='flex flex-col gap-5'>
                <div className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === 12 ? 'bg-gray-200' : ''}`} onClick={() => handleSize(12)}>W 12</div>
                <div className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === 13 ? 'bg-gray-200' : ''}`} onClick={() => handleSize(13)}>W 13</div>
                <div className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === 14 ? 'bg-gray-200' : ''}`} onClick={() => handleSize(14)}>W 14</div>
              </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <div>
            <p>{product.description}</p>
          </div>
          <button className='border border-black p-3 rounded-full'
            onClick={handleAddToCart}>Add to Bag</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails