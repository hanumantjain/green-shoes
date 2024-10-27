import React from 'react'
import img from '../assets/shoes.jpg'

const CartCard:React.FC = () => {
  return (
    <div className='bg-white flex'>
        <div className='w-1/4'>
            <img src={img} alt="" className=' object-fit p-2 rounded-xl' />
        </div>
        <div className='w-2/4'>
            <div>
                <p>title: </p>
                <p>Size: </p>
                <p>Color: </p>
                <p>Price: </p>
            </div>
        </div>
        <div className='w-1/4 flex justify-center items-center'>
            <div className='border border-black flex gap-4 px-3 py-0.5 rounded-full'>
                <div className=' cursor-pointer'>
                    -
                </div>
                <div>
                    1
                </div>
                <div className=' cursor-pointer'>
                    +
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartCard