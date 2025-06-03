import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Banknote, CreditCard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const sheetVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.3 } },
};

const MyProfileModal = ({ show, onClose, user, qrUrl }) => {
  const { isDarkMode } = useTheme();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={sheetVariants}
          onClick={onClose}
        >
          <motion.div
            className={`w-full max-w-md mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl p-6 relative shadow-xl flex flex-col`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10" onClick={onClose} aria-label="Close"><X size={22} /></button>
            
            <h2 className={`text-xl font-semibold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>My Profile</h2>

            <div className="space-y-4 overflow-y-auto">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}><User size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} /></div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user.name || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}><Mail size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} /></div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}><Banknote size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} /></div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account Number</p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user.zenbankAccount || 'N/A'}</p>
                </div>
              </div>

              {qrUrl && (
                <div className="flex flex-col items-center gap-4 mt-6">
                   <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>My QR Code</p>
                   <img src={qrUrl} alt="My QR Code" className="w-48 h-48 rounded-xl" />
                </div>
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MyProfileModal; 