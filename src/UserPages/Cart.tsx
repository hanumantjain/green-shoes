import React from 'react'
import { Navbar } from '../UserComponents/Navbar'
import CartCard from '../UserComponents/CartCard'

type CartItem = {
    id: number;
    title: string;
    price: number;
    size: number;
    image: string;
  }
  
type CartProps = {
    cart: CartItem[];
}

const Cart:React.FC<CartProps> = ({ cart }) => {
  return (
    <div>
        <Navbar />
        <div className='w-full flex px-20 text-xl'>
            <div className='w-3/5 pt-20'>
            {cart.length > 0 ? (
                    <ul>
                        {cart.map((item) => (
                            <li key={item.id}>
                                <CartCard 
                                    image={item.image} 
                                    title={item.title} 
                                    size={item.size} 
                                    price={item.price} 
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Your cart is empty</p>
                )}
            </div>
            <div className='flex flex-col gap-2 px-20 w-2/5'>
                <h1 className='text-xl pt-20 pb-5'>Order Summary</h1>
                <div className='flex justify-between'>
                    <h1>Subtotal</h1>
                    <h1>$ 200</h1>
                </div>
                <div className='flex justify-between'>
                    <h1>Discount</h1>
                    <h1>$ 20</h1>
                </div>
                <div className='flex justify-between'>
                    <h1>Delivery Fees</h1>
                    <h1>$ 15</h1>
                </div>
                <div className='flex justify-between'>
                    <h1>Estimated Tax</h1>
                    <h1>$ 15</h1>
                </div>
                <hr className="border-black my-3" />
                <div className='flex justify-between'>
                    <h1>Total</h1>
                    <h1>$ 195</h1>
                </div>
                <hr className="border-black my-3" />
                <div className='flex justify-center items-center'>
                    <button className='bg-white px-8  py-2 rounded-full'>Go to checkout -</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Cart