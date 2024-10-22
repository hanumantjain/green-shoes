import React from 'react'
import img from '../assets/shoes.jpg'
import { useParams } from 'react-router-dom';
import { NotFound } from '../components/NotFound';

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

const ProductDetails:React.FC = () => {
    const {id} = useParams<{id: string}>()
    const card = cardData.find((card) => card.id === parseInt(id || '', 10))
    if(!card){
        return <div><NotFound /></div>
    }

    
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <img src={card.image} alt={card.title} className="w-full h-64 object-cover mb-4" />
        <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
        <p>{card.description}</p>
        <p>{card.description}</p>
      </div>
    </div>
  )
}

export default ProductDetails