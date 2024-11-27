// Cart.tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { Navbar } from '../UserComponents/Navbar';
import CartCard from '../UserComponents/CartCard';
import { addItem, removeItem } from '../Features/cart/CartSlice';

const Cart: React.FC = () => {
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  return (
    <div>
      <Navbar />
      <div className="w-full flex px-20 text-xl">
        <div className="w-3/5 pt-20">
          {cart.items.length > 0 ? (
            cart.items.map((item) => (
              <CartCard
                key={item.id}
                id={item.id}
                title={item.name}
                image={item.image}
                size={item.size}
                price={item.price}
                quantity={item.quantity}
                onAdd={() =>
                  dispatch(
                    addItem({
                      id: item.id,
                      name: item.name,
                      image: item.image,
                      size: item.size,
                      price: item.price,
                      quantity: 1,
                    })
                  )
                }
                onRemove={() => dispatch(removeItem(item.id))}
              />
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
        <div className="flex flex-col gap-2 px-20 w-2/5">
          <h1 className="text-xl pt-20 pb-5">Order Summary</h1>
          <div className="flex justify-between">
            <h1>Subtotal</h1>
            <h1>${cart.totalAmount}</h1>
          </div>
          <div className="flex justify-center items-center">
            <button className="bg-white px-8 py-2 rounded-full">Go to checkout -</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
