import React, { useState } from 'react'
import img from '../assets/shoes.jpg'
import { useParams } from 'react-router-dom';
import { NotFound } from '../components/NotFound';
import { Navbar } from '../UserComponents/Navbar';

type CartItem = {
  id: number;
  title: string;
  price: number;
  size: number;
  image: string;
}

type ProductDetailsProps = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void;
}

const cardData = [
    { id: 1, image: img, title: 'Card 1', description: 'This is a good prodcut to buy', price: 300},
    { id: 2, image: img, title: 'Card 2', description: 'This is a good prodcut to buy', price: 300},
    { id: 3, image: img, title: 'Card 3', description: 'This is a good prodcut to buy', price: 300},
    { id: 4, image: img, title: 'Card 4', description: 'This is a good prodcut to buy', price: 300},
    { id: 5, image: img, title: 'Card 5', description: 'This is a good prodcut to buy', price: 300},
    { id: 6, image: img, title: 'Card 6', description: 'This is a good prodcut to buy', price: 300},
    { id: 7, image: img, title: 'Card 7', description: 'This is a good prodcut to buy', price: 300},
    { id: 8, image: img, title: 'Card 8', description: 'This is a good prodcut to buy', price: 300},
    { id: 9, image: img, title: 'Card 9', description: 'This is a good prodcut to buy', price: 300},
  ]

const ProductDetails:React.FC<ProductDetailsProps> = ({ addToCart }) => {
    const {id} = useParams<{id: string}>()
    const card = cardData.find((card) => card.id === parseInt(id || '', 10))

    const[selectedSize, setSelectedSize] = useState<number | null>(null)
    const[error, setError] = useState<string | null>(null)

    if(!card){
        return <div><NotFound /></div>
    }

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart({
        id: card.id,
        title: card.title,
        price: card.price,
        size: selectedSize,
        image: card.image,
      })
      alert(`Added ${card.title} - Size ${selectedSize} to cart`)
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
    
  return (
    <div>
      <Navbar />
      <div className="flex px-32 w-full pt-20">
        <div className='w-1/2'>
          <img src={card.image} alt={card.title} className="w-full object-cover" />
        </div>
        <div className='pl-20 flex flex-col gap-3'>
          <div>
            <h2 className="text-4xl font-bold">{card.title}</h2>
            <p>{card.price}</p>
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
            <p>{card.description}</p>
          </div>
          <button className='border border-black p-3 rounded-full'
            onClick={handleAddToCart}>Add to Bag</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails