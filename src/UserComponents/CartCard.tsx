import React from 'react'

type CartCardProps = {
    image: string;
    title: string;
    size: number;
    price: number;
}

const CartCard:React.FC<CartCardProps> = ({ image, title, size, price }) =>  {
  return (
    <div className='bg-white flex border p-4 my-4'>
            <div className='w-1/4'>
                <img src={image} alt={title} className='object-cover p-2 rounded-xl' />
            </div>
            <div className='w-2/4'>
                <div>
                    <p className="font-semibold">{title}</p>
                    <p>Size: {size}</p>
                    <p>Price: ${price}</p>
                </div>
            </div>
            <div className='w-1/4 flex justify-center items-center'>
                <div className='border border-black flex gap-4 px-3 py-0.5 rounded-full'>
                    <div className='cursor-pointer'>-</div>
                    <div>1</div>
                    <div className='cursor-pointer'>+</div>
                </div>
            </div>
        </div>
    )
}

export default CartCard