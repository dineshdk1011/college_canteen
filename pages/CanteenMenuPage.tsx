import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { canteensData } from '../data/canteensData';
import { MenuItem, CartItem, Canteen } from '../types';
import { useCart } from '../hooks/useCart';

// This component now uses the useCart hook directly to be aware of cart state
const MenuItemCard: React.FC<{ item: MenuItem; canteen: Canteen; onShowToast: (message: string) => void; }> = ({ item, canteen, onShowToast }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [localQuantity, setLocalQuantity] = useState(1);

  const itemInCart = useMemo(() => cartItems.find(cartItem => cartItem.itemId === item.id), [cartItems, item.id]);

  const handleAddToCart = () => {
    const cartItemToAdd: CartItem = {
      itemId: item.id,
      canteenId: canteen.id,
      name: item.name,
      price: item.price,
      quantity: localQuantity,
      canteenName: canteen.name,
    };
    addToCart(cartItemToAdd);
    onShowToast(`${localQuantity}x ${item.name} added to cart!`);
    setLocalQuantity(1);
  };

  const handleUpdateCartQuantity = (newQuantity: number) => {
    if (itemInCart) {
      updateQuantity(item.id, newQuantity);
      if (newQuantity <= 0) {
        onShowToast(`${item.name} removed from cart.`);
      } else {
        onShowToast(`Updated ${item.name} to ${newQuantity}.`);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
      <img src={item.image} alt={item.name} className="w-full md:w-32 h-32 object-cover rounded-md" />
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {item.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
        <p className="text-sm text-gray-400 mt-1">{item.category}</p>
      </div>
      <div className="flex flex-col items-end justify-between gap-2 md:w-40">
        <p className="text-lg font-bold text-primary-600">₹{item.price}</p>
        
        {itemInCart ? (
          <div className="flex flex-col items-center w-full mt-2">
            <span className="text-sm font-medium text-green-600 mb-2">Added to Cart</span>
            <div className="flex items-center gap-2">
                <button onClick={() => handleUpdateCartQuantity(itemInCart.quantity - 1)} className="bg-gray-200 h-8 w-8 rounded-full font-bold text-lg flex items-center justify-center hover:bg-gray-300 transition-colors">-</button>
                <span className="w-8 text-center font-semibold text-lg">{itemInCart.quantity}</span>
                <button onClick={() => handleUpdateCartQuantity(itemInCart.quantity + 1)} className="bg-gray-200 h-8 w-8 rounded-full font-bold text-lg flex items-center justify-center hover:bg-gray-300 transition-colors">+</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button onClick={() => setLocalQuantity(q => Math.max(1, q - 1))} className="bg-gray-200 h-8 w-8 rounded-full font-bold">-</button>
              <span className="w-8 text-center font-semibold">{localQuantity}</span>
              <button onClick={() => setLocalQuantity(q => q + 1)} className="bg-gray-200 h-8 w-8 rounded-full font-bold">+</button>
            </div>
            <button onClick={handleAddToCart} className="w-full bg-primary-500 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-600 transition-colors mt-2">
              Add
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const Toast: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed bottom-10 right-10 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg">
      {message}
    </div>
  );
};

const CanteenMenuPage: React.FC = () => {
  const { canteenId } = useParams<{ canteenId: string }>();
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canteen = useMemo(() => canteensData.find(c => c.id === canteenId), [canteenId]);

  const filteredMenu = useMemo(() => {
    if (!canteen) return [];
    return canteen.menu.filter(item => {
      const vegMatch = !filterVeg || item.isVeg;
      const categoryMatch = filterCategory === 'All' || item.category === filterCategory;
      return vegMatch && categoryMatch;
    });
  }, [canteen, filterVeg, filterCategory]);

  const categories = useMemo(() => {
    if (!canteen) return [];
    return ['All', ...Array.from(new Set(canteen.menu.map(item => item.category)))];
  }, [canteen]);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  if (!canteen) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Canteen not found!</h2>
        <Link to="/" className="text-primary-600 mt-4 inline-block">Go back to Home</Link>
      </div>
    );
  }

  return (
    <div>
      {toastMessage && <Toast message={toastMessage} />}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{canteen.name}</h1>
        <p className="text-gray-600 mt-2">{canteen.description}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center gap-4">
        <h3 className="text-lg font-semibold">Filters:</h3>
        <div className="flex items-center gap-4">
          <select 
            value={filterCategory} 
            onChange={e => setFilterCategory(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={filterVeg} 
              onChange={() => setFilterVeg(!filterVeg)}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="font-medium">Veg Only</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMenu.length > 0 ? (
          filteredMenu.map(item => (
            <MenuItemCard key={item.id} item={item} canteen={canteen} onShowToast={showToast} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No items match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default CanteenMenuPage;
