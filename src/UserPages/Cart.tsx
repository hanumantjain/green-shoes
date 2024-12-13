// Cart.tsx
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { Navbar } from '../UserComponents/Navbar';
import CartCard from '../UserComponents/CartCard';
import { fetchCartItems } from '../Features/cart/CartSlice';
import { updateCartItemQuantity } from '../Features/cart/CartSlice'; // Import updateCartItemQuantity
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const cart = useAppSelector((state: RootState) => state.cart);
  const dispatch = useAppDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);
  const checkoutRoute = userId === 'guest' ? '/guest-checkout' : '/checkout'

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, userId]);

  const handleIncreaseQuantity = (itemId: string, size: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + 1;
    dispatch(updateCartItemQuantity({
      productId: itemId,
      size: size,
      quantity: newQuantity,
    }));
  };
  
  const handleDecreaseQuantity = (itemId: string, size: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      dispatch(updateCartItemQuantity({
        productId: itemId,
        size: size,
        quantity: newQuantity,
      }));
    } else {
      dispatch(updateCartItemQuantity({
        productId: itemId,
        size: size,
        quantity: 0, // Quantity reaches 0, so remove item
      }));
    }
  };

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (cart.items.length === 0) {
      e.preventDefault()
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-full flex px-20 text-xl">
        <div className="w-3/5 pt-20">
          {cart.items.length > 0 ? (
            cart.items.map((item) => (
              <CartCard
                key={`${item.id}-${item.size}`}
                id={item.id}
                title={item.name}
                image={item.image}
                size={item.size}
                price={item.price}
                quantity={item.quantity}
                onAdd={() => handleIncreaseQuantity(item.id, item.size, item.quantity)}
                onRemove={() => handleDecreaseQuantity(item.id, item.size, item.quantity)}
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
          <div className="flex justify-between">
            <h1>Delivery Fee</h1>
            <h1>$0</h1>
          </div>
          <div className="flex justify-between">
            <h1>Tax</h1>
            <h1>$0</h1>
          </div>
          <hr className=''/>
          <div className="flex justify-between">
            <h1>Total</h1>
            <h1>${cart.totalAmount}</h1>
          </div>
          <div className="flex justify-center items-center pt-5">
            {/* Conditionally disable the button if the cart is empty */}
            <Link
              to={checkoutRoute}
              className={`bg-white px-12 py-2 rounded-full ${cart.items.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={handleCheckoutClick} // Add onClick handler to prevent navigation if the cart is empty
            >
              Go to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
