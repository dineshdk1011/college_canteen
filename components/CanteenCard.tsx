
import React from 'react';
import { Link } from 'react-router-dom';
import { Canteen } from '../types';

interface CanteenCardProps {
  canteen: Canteen;
}

const CanteenCard: React.FC<CanteenCardProps> = ({ canteen }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img src={canteen.image} alt={canteen.name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{canteen.name}</h3>
        <p className="text-gray-600 mb-4">{canteen.description}</p>
        <Link 
          to={`/canteen/${canteen.id}`} 
          className="inline-block bg-primary-500 text-white font-bold py-2 px-4 rounded-full hover:bg-primary-600 transition-colors"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
};

export default CanteenCard;
