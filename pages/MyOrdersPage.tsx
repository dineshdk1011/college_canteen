
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedOrdersRaw = localStorage.getItem('canteen_orders');
      if (storedOrdersRaw) {
        setOrders(JSON.parse(storedOrdersRaw));
      }
    } catch (error) {
      console.error("Failed to load orders from localStorage", error);
    }
  }, []);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };
  
  if (orders.length === 0) {
    return (
      <div className="text-center bg-white p-12 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800">No Orders Yet</h2>
        <p className="text-gray-600 mt-4">You haven't placed any orders. Let's change that!</p>
        <Link to="/" className="mt-8 inline-block bg-primary-500 text-white font-bold py-3 px-6 rounded-full hover:bg-primary-600 transition-colors">
          Start Ordering
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
      {orders.map(order => (
        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold font-mono text-xs">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="text-right md:text-left">
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-lg text-primary-600">₹{order.totalAmount}</p>
            </div>
            <div className="col-span-2 md:col-span-1 flex justify-end">
              <button 
                onClick={() => toggleOrderDetails(order.id)}
                className="font-semibold text-primary-600 hover:text-primary-800"
              >
                {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>
          </div>
          {expandedOrderId === order.id && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-bold mb-2">Order Details</h4>
              <p><strong>Canteens:</strong> {order.canteenNames.join(', ')}</p>
              <p><strong>Pickup:</strong> {order.userInfo.pickupLocation}</p>
              <ul className="list-disc list-inside mt-2">
                {order.items.map(item => (
                  <li key={item.itemId}>{item.quantity} x {item.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyOrdersPage;
