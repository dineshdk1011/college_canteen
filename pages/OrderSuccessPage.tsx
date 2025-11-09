
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../types';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const storedOrdersRaw = localStorage.getItem('canteen_orders');
      if (storedOrdersRaw) {
        const storedOrders: Order[] = JSON.parse(storedOrdersRaw);
        const currentOrder = storedOrders.find(o => o.id === orderId);
        setOrder(currentOrder || null);
      }
    } catch (error) {
      console.error("Failed to load order from localStorage", error);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="text-center bg-white p-12 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800">Order Not Found</h2>
        <p className="text-gray-600 mt-4">We couldn't find the details for this order.</p>
        <Link to="/my-orders" className="mt-8 inline-block bg-primary-500 text-white font-bold py-3 px-6 rounded-full hover:bg-primary-600 transition-colors">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
      <p className="mt-2 text-gray-600">Thank you for your order. Here are the details:</p>
      
      <div className="mt-8 text-left border-t pt-6 space-y-4">
        <p><strong>Order ID:</strong> <span className="font-mono text-sm">{order.id}</span></p>
        <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
        <p><strong>Total Amount:</strong> <span className="font-bold text-primary-600">₹{order.totalAmount}</span></p>
        <p><strong>Pickup Location:</strong> {order.userInfo.pickupLocation}</p>
        <p><strong>Payment Method:</strong> {order.userInfo.paymentMethod}</p>

        <h3 className="text-lg font-bold pt-4 border-t">Items Ordered</h3>
        <ul className="list-disc list-inside text-gray-700">
          {order.items.map(item => (
            <li key={item.itemId}>
              {item.quantity} x {item.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/my-orders" className="w-full sm:w-auto bg-primary-500 text-white font-bold py-3 px-6 rounded-full hover:bg-primary-600 transition-colors">
          View My Orders
        </Link>
         <Link to="/" className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-full hover:bg-gray-300 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
