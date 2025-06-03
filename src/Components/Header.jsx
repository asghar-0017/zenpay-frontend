import React from 'react';
import { User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 shadow-sm flex justify-between items-center`}>
      <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h1>
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <User size={20} className={isDarkMode ? 'text-gray-800' : 'text-gray-600'} />
      </div>
    </div>
  );
};

export default Header; 