import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Tag, ArrowLeft, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const AddRecipient = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract scanned values from QR state if available
  const { account_number, name, amount } = location.state || {};

  const [userId, setUserId] = useState('');
  const [alias, setAlias] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  // Prefill form on mount if QR scan values exist
  useEffect(() => {
    if (account_number) setUserId(account_number);
    if (name) setAlias(name);
  }, [account_number, name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !pin || !userId) {
      alert("Missing required fields.");
      return;
    }

    const token = localStorage.getItem('token');

    try {
      setLoading(true);

      await axios.post(
        'https://zenpay-backend.vercel.app/api/recipient/add',
        {
          name: alias,
          account_number: userId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      await axios.post(
        'https://zenpay-backend.vercel.app/api/transaction/transfer',
        {
          amount,
          recipient_account_number: userId,
          description: alias,
          transaction_pin: pin
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedBalance = (parsedUser.balance || 0) - Number(amount);
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...parsedUser,
            balance: updatedBalance
          })
        );
      }

      alert('Transfer successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-[#A6E22E]">
          <ArrowLeft size={18} /> Back
        </button>
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add New Recipient</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User ID */}
          <div>
            <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>User ID</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700">
              <User size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              <input
                type="text"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                className={`flex-1 bg-transparent border-none outline-none ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                placeholder="Enter User ID"
                required
              />
            </div>
          </div>

          {/* Alias */}
          <div>
            <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Alias</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700">
              <Tag size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              <input
                type="text"
                value={alias}
                onChange={e => setAlias(e.target.value)}
                className={`flex-1 bg-transparent border-none outline-none ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                placeholder="Enter Alias"
                required
              />
            </div>
          </div>

          {/* PIN */}
          <div>
            <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Transaction PIN</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700">
              <Lock size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                className={`flex-1 bg-transparent border-none outline-none ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                required
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
              userId && alias && pin.length === 4 && !loading
                ? 'bg-[#A6E22E] text-gray-900'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!userId || !alias || pin.length !== 4 || loading}
          >
            {loading ? "Transferring..." : "Add & Transfer"}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipient;
