import React from 'react'

interface ShoeCardProps {
    image: string,
    title: string,
    description: string,
    price:number
}
const ShoeCard:React.FC<ShoeCardProps> = ({image, title, description, price}) => {
  return (
    <div className='overflow-hidden cursor-pointer hover:border-2 hover:border-white'>
        <img src={image} alt={title}
        className='w-full object-contain' />
        <div className="p-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p>{description}</p>
        <p>$ {price}</p>
      </div>
    </div>
  )
}

export default ShoeCard