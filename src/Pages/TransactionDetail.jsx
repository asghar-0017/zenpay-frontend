import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Hash, Tag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../Components/Navbar';

const TransactionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const transaction = location.state?.transaction;

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400">Transaction not found</p>
        </div>
        <Navbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Transaction Details
          </h1>
        </div>

        {/* Transaction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {transaction.name}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {transaction.category}
              </p>
            </div>
            <span className={`text-xl font-semibold ${
              transaction.type === 'deposit'
                ? isDarkMode ? 'text-[#A6E22E]' : 'text-[#005339]'
                : isDarkMode ? 'text-red-400' : 'text-red-500'
            }`}>
              {transaction.type === 'deposit' ? '+' : '-'}{Math.abs(transaction.amount).toLocaleString()}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Calendar size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date</p>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {transaction.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Clock size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time</p>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {transaction.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Hash size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Transaction ID</p>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {transaction.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Tag size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {transaction.status}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Navbar />
    </div>
  );
};

export default TransactionDetail; 