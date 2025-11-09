import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="text-center bg-white p-12 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h2>
        <p className="text-gray-600 mt-4">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="mt-8 inline-block bg-primary-500 text-white font-bold py-3 px-6 rounded-full hover:bg-primary-600 transition-colors">
          Browse Canteens
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.itemId} className="flex flex-col md:flex-row items-center justify-between border-b pb-4">
            <div className="flex-grow mb-4 md:mb-0">
              <p className="font-bold text-lg">{item.name}</p>
              <p className="text-sm text-gray-500">{item.canteenName}</p>
              <p className="text-md font-semibold text-primary-600 mt-1">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.itemId, item.quantity - 1)} className="bg-gray-200 h-8 w-8 rounded-full font-bold">-</button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.itemId, item.quantity + 1)} className="bg-gray-200 h-8 w-8 rounded-full font-bold">+</button>
              </div>
              <p className="font-bold w-20 text-right">₹{item.price * item.quantity}</p>
              <button onClick={() => removeFromCart(item.itemId)} className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <h2 className="text-2xl font-bold">Total: <span className="text-primary-600">₹{totalAmount}</span></h2>
        <p className="text-sm text-gray-500">Taxes and charges included</p>
      </div>
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <button onClick={clearCart} className="w-full md:w-auto text-red-600 font-semibold py-2 px-4 rounded-md border border-red-600 hover:bg-red-50">
          Clear Cart
        </button>
        <button onClick={() => navigate('/checkout')} className="w-full md:w-auto bg-primary-500 text-white font-bold py-3 px-8 rounded-full hover:bg-primary-600 transition-colors text-lg">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;