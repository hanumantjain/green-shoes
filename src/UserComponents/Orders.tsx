import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; 

interface ShippingAddress {
  street1: string
  street2?: string
  city: string
  state: string
  zip: string
  country: string
}

interface Order {
  id: number
  user_id: number
  product_id: number
  name: string
  size: string
  quantity: number
  total_amount: number
  shipping_address: ShippingAddress
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const userId = useSelector((state: RootState) => state.user.userId)
  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;

  useEffect(() => {
    if (!userId || !backendBaseUrl) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/getOrders`, {
          params: { user_id: userId }, 
        });
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, backendBaseUrl]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Orders</h1>
      {loading && <p>Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <p>No orders available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold"><strong>Order </strong></h3>
            <p className="text-gray-600"><strong>Product :</strong> {order.name}</p>
            <p className="text-gray-600"><strong>Size: </strong>{order.size}</p>
            <p className="text-gray-600"><strong>Quantity: </strong>{order.quantity}</p>
            <p className="text-gray-600"><strong>Total Amount: $</strong>{order.total_amount}</p>

            <div className="text-gray-600">
              <h4 className="font-semibold"><strong>Shipping Address:</strong></h4>
              <p>{order.shipping_address.street1} {order.shipping_address.street2 && `, ${order.shipping_address.street2}`}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
              <p>{order.shipping_address.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
