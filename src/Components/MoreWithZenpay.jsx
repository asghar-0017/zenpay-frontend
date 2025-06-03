import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Receipt,
  Phone,
  Landmark,
  WalletCards,
  HeartHandshake,
  MoreHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const services = [
  { icon: Receipt, label: 'Bills', color: '#FF6B6B', darkColor: '#FF8F8F' },
  { icon: Phone, label: 'Top-up', color: '#4ECDC4', darkColor: '#6EEAE1' },
  { icon: Landmark, label: 'Payments', color: '#45B7D1', darkColor: '#67D5EF' },
  { icon: WalletCards, label: 'Budget', color: '#96CEB4', darkColor: '#A8E0C6' },
  { icon: HeartHandshake, label: 'Charity', color: '#FFEEAD', darkColor: '#FFE38C' },
  { icon: MoreHorizontal, label: 'More', color: '#D4A5A5', darkColor: '#E6B7B7' },
];

const MoreWithZenpayCard = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <motion.div
      className={`relative w-full rounded-2xl overflow-hidden mx-auto ${
        isDarkMode ? 'bg-gray-800 shadow-none' : 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          {services.map((service, index) => (
            <motion.button
              key={index}
              onClick={() => navigate('/coming-soon')}
              className={`flex flex-col items-center justify-center rounded-xl p-2 transition-all duration-200 ${
                isDarkMode 
                  ? 'hover:bg-gray-700/50 active:bg-gray-700' 
                  : 'hover:bg-gray-50/80 active:bg-gray-50'
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
                delay: index * 0.1,
              }}
            >
              <div 
                className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-2 ${
                  isDarkMode 
                    ? 'shadow-lg shadow-black/20' 
                    : 'shadow-md shadow-black/5'
                }`}
                style={{ 
                  background: isDarkMode 
                    ? `${service.darkColor}30`
                    : `${service.color}20`,
                  color: isDarkMode ? service.darkColor : service.color
                }}
              >
                <service.icon size={24} strokeWidth={2.5} />
              </div>
              <span className={`text-xs font-medium leading-none ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {service.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MoreWithZenpayCard;
