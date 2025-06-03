import React from 'react';
import { motion } from 'framer-motion';
import { Home, LineChart, ScanLine, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleScanClick = () => {
    navigate('/dashboard', { state: { openQRScanner: true } });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center w-full pb-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`w-[90%] max-w-md h-[70px] backdrop-blur-md ${
          isDarkMode 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/90 border-white/30'
        } border rounded-3xl flex items-center justify-evenly px-3 shadow-xl`}
      >
        <Link to="/dashboard">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
              isActive('/dashboard')
                ? isDarkMode
                  ? 'bg-[#A6E22E] text-gray-800'
                  : 'bg-[#005339] text-white'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Home size={22} />
          </motion.button>
        </Link>

        <Link to="/transactions">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
              isActive('/transactions')
                ? isDarkMode
                  ? 'bg-[#A6E22E] text-gray-800'
                  : 'bg-[#005339] text-white'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <LineChart size={22} />
          </motion.button>
        </Link>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleScanClick}
          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-label="Scan QR code"
        >
          <ScanLine size={22} />
        </motion.button>

        <Link to="/profile">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
              isActive('/profile')
                ? isDarkMode
                  ? 'bg-[#A6E22E] text-gray-800'
                  : 'bg-[#005339] text-white'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <User size={22} />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Navbar;
