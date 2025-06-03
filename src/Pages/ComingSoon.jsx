import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ComingSoon = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md rounded-2xl p-8 shadow-lg flex flex-col items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className={`rounded-full p-6 mb-6 ${isDarkMode ? 'bg-[#A6E22E]/10' : 'bg-[#005339]/10'}`}>
          <Clock size={56} className={isDarkMode ? 'text-[#A6E22E]' : 'text-[#005339]'} />
        </div>
        <h1 className={`text-3xl font-bold mb-3 text-center font-[Montserrat] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Coming Soon</h1>
        <p className={`text-base mb-8 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>We're working hard to bring you this feature. Stay tuned for updates!</p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${isDarkMode ? 'bg-[#A6E22E] text-gray-900' : 'bg-[#005339] text-white'}`}
        >
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ComingSoon; 