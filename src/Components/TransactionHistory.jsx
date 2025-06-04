import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ArrowUpRight,ArrowDownLeft ,ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TransactionHistory = () => {
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('https://zenpay-backend.vercel.app/api/transaction/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res)
        const latest = res.data.transactions?.slice(0, 4) || [];
        setTransactions(latest);
      } catch (err) {
        console.error("Failed to fetch transaction history:", err.message);
      }
    };

    fetchTransactions();
  }, []);

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const handleTransactionClick = (transaction) => {
  navigate(`/transactions/${transaction._id}`, {
    state: { transaction }
  });
};

  return (
    <motion.div
      className={`rounded-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm border border-gray-100'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`font-[Montserrat] text-[15px] font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Recent Transactions
          </h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/transactions')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
              isDarkMode 
                ? 'bg-gray-700 text-[#A6E22E] hover:bg-gray-600' 
                : 'bg-[#E8F5E9] text-[#005339] hover:bg-[#D7EDE1]'
            }`}
          >
            See All
            <ChevronRight size={16} />
          </motion.button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <motion.div
              key={tx._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between p-3 rounded-xl ${
                isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
              } cursor-pointer`}
              onClick={() => handleTransactionClick(tx)}
            >
              <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center 
  ${tx.type === 'sent' 
    ? 'text-red-500 bg-red-100 dark:bg-red-800/30' 
    : 'text-green-500 bg-green-100 dark:bg-green-800/30'}`}>
  {tx.type === 'sent' ? (
    <ArrowUpRight size={20} />
  ) : (
    <ArrowDownLeft size={20} />
  )}
</div>

                <div>
  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
    {tx.type === 'bank_transfer' ? 'Deposit from ZenBank' : `To ${tx.recipient_name}`}
  </p>
  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    {formatDate(tx.created_at)}  
  </p>
</div>

              </div>
              <p className={`text-sm font-medium text-red-500`}>
                -PKR {tx.amount}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionHistory;
