import React from 'react'
import ShoeCard from '../UserComponents/ShoeCard'
import img from '../assets/shoes.jpg'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../UserComponents/Navbar'

interface CardData {
    id: number,
    image: string,
    title: string,
    description: string,
    price: number
  }

const cardData: CardData[] = [
    { id: 1, image: img, title: 'Card 1', description: 'This is a good prodcut to buy', price: 300},
    { id: 2, image: img, title: 'Card 2', description: 'This is a good prodcut to buy', price: 300},
    { id: 3, image: img, title: 'Card 3', description: 'This is a good prodcut to buy', price: 300},
    { id: 4, image: img, title: 'Card 4', description: 'This is a good prodcut to buy', price: 300},
    { id: 5, image: img, title: 'Card 5', description: 'This is a good prodcut to buy', price: 300},
    { id: 6, image: img, title: 'Card 6', description: 'This is a good prodcut to buy', price: 300},
    { id: 7, image: img, title: 'Card 7', description: 'This is a good prodcut to buy', price: 300},
    { id: 8, image: img, title: 'Card 8', description: 'This is a good prodcut to buy', price: 300},
    { id: 9, image: img, title: 'Card 9', description: 'This is a good prodcut to buy', price: 300},
  ];

const Products:React.FC = () => {
    const navigate = useNavigate()

    const handleShoeCardClick = (id: number) => {
        navigate(`/products/${id}`)
    }
  return (
    <div>
      <Navbar />
      {/* <h1 className="text-3xl font-bold text-center mt-8 mb-6">All Products</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-20 py-10">
        {cardData.map((card) => (
            <div key={card.id} onClick={() => handleShoeCardClick(card.id)}>
                <ShoeCard image={card.image} title={card.title} description={card.description} price={card.price} />
            </div>
        ))}
      </div>
    </div>
  )
}

export default Products