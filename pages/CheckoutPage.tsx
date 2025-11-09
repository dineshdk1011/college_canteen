import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Order } from '../types';

const CheckoutPage: React.FC = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Main Gate');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h2>
            <p className="text-gray-600 mt-4">You can't checkout with an empty cart.</p>
            <button onClick={() => navigate('/')} className="mt-8 inline-block bg-primary-500 text-white font-bold py-3 px-6 rounded-full hover:bg-primary-600 transition-colors">
                Browse Canteens
            </button>
        </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !collegeId || !phone) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);

    // Simulate an API call
    setTimeout(() => {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      // FIX: Explicitly specify the type for the Set to ensure canteenNames is string[].
      const canteenNames = [...new Set<string>(cartItems.map(item => item.canteenName))];

      const newOrder: Order = {
        id: orderId,
        date: new Date().toISOString(),
        items: cartItems,
        totalAmount,
        status: 'Order Placed',
        canteenNames,
        userInfo: {
          name,
          collegeId,
          phone,
          pickupLocation,
          paymentMethod,
          notes,
        },
      };

      try {
        const existingOrdersRaw = localStorage.getItem('canteen_orders');
        const existingOrders: Order[] = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem('canteen_orders', JSON.stringify(updatedOrders));

        clearCart();
        navigate(`/order-success/${orderId}`);
      } catch (error) {
        console.error("Failed to save order", error);
        alert("There was an error placing your order. Please try again.");
        setIsSubmitting(false);
      }

    }, 1000); // simulate network delay
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label htmlFor="collegeId" className="block text-sm font-medium text-gray-700">College ID</label>
            <input type="text" id="collegeId" value={collegeId} onChange={e => setCollegeId(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">Pickup Location</label>
            <select id="pickupLocation" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500">
              <option>Main Gate</option>
              <option>Hostel Block A</option>
              <option>Library Entrance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="UPI" checked={paymentMethod === 'UPI'} onChange={e => setPaymentMethod(e.target.value)} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300" />
                <span className="ml-3 text-sm text-gray-700">UPI / QR Code</span>
              </label>
               <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="Cash" checked={paymentMethod === 'Cash'} onChange={e => setPaymentMethod(e.target.value)} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300" />
                <span className="ml-3 text-sm text-gray-700">Cash on Pickup</span>
              </label>
            </div>
          </div>
           <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Order Notes (optional)</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" placeholder="e.g., make it less spicy"></textarea>
          </div>
           <button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 text-white font-bold py-3 px-8 rounded-full hover:bg-primary-600 transition-colors text-lg disabled:bg-gray-400">
            {isSubmitting ? 'Placing Order...' : `Place Order (₹${totalAmount})`}
          </button>
        </form>
      </div>

      {/* Order Summary Section */}
      <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-lg h-fit">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
        <div className="space-y-3">
          {cartItems.map(item => (
            <div key={item.itemId} className="flex justify-between items-center text-sm">
                <div>
                    <p className="font-semibold">{item.name} <span className="text-gray-500">x {item.quantity}</span></p>
                    <p className="text-xs text-gray-400">{item.canteenName}</p>
                </div>
              <p className="text-gray-700">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-xl">
          <p>Total</p>
          <p className="text-primary-600">₹{totalAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;