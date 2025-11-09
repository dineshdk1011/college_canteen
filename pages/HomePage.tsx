
import React from 'react';
import { canteensData } from '../data/canteensData';
import CanteenCard from '../components/CanteenCard';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Welcome to the <span className="text-primary-600">College Canteen</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Your one-stop destination for delicious and convenient meals on campus. Choose a canteen to get started.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {canteensData.map(canteen => (
          <CanteenCard key={canteen.id} canteen={canteen} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
