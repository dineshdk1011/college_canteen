
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} College Canteen Portal</p>
        <p className="text-sm mt-1">Demo site for illustrative purposes. No real payments are processed.</p>
      </div>
    </footer>
  );
};

export default Footer;
