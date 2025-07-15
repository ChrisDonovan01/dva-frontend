// dva-frontend/src/components/Header.js
import React from 'react';
import { Settings, Logout } from '@mui/icons-material';
import Logo from '../assets/adaptive-product-logo.png'; // Assuming this is the correct path to your logo

export default function Header() {
  return (
    <header className="flex justify-between items-center py-3 px-6 border-b border-gray-300 bg-main-bg">
      <div className="flex items-center">
        {/* Logo reduced by 25% from h-[87px] to h-[65px] */}
        <img src={Logo} alt="Adaptive Product" className="h-[65px] mr-3" />
        <h1
          className="text-[1.7rem] font-semibold ml-3 translate-y-1 text-dva-blue" // Font size increased to 1.7rem
        >
          Data Value Accelerator
        </h1>
      </div>
      {/* Settings and Logout icons moved to the header and size increased */}
      <div className="flex items-center space-x-4">
        {/* Icons increased by 25% using text-3xl */}
        <button title="Settings" className="hover:text-gray-800 text-gray-600">
          <Settings className="text-3xl" /> {/* Added text-3xl for size increase */}
        </button>
        <button title="Logout" className="hover:text-gray-800 text-gray-600">
          <Logout className="text-3xl" /> {/* Added text-3xl for size increase */}
        </button>
        {/* Updated welcome message */}
        <span className="text-sm text-gray-600 ml-4">Welcome back Chris!</span>
      </div>
    </header>
  );
}
