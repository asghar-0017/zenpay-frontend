import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import profileimg from '../assets/profileimg.png';
import {
  ArrowUpRight, ArrowDownLeft, ChevronRight,
  ShoppingBag, Coffee, Smartphone, Utensils,
  Calendar, Filter, Moon, Sun, DollarSign, Banknote, ChevronDown, X, Clock, Hash, Tag
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import BudgetModule from '../Components/BudgetModule';
import BudgetCard from '../Components/BudgetCard';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const iconMap = {
  shopping: ShoppingBag,
  food: Utensils,
  utilities: Smartphone,
  cafe: Coffee,
  salary: ArrowDownLeft,
  default: ArrowUpRight,
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TransactionHistory = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [budgetTotal, setBudgetTotal] = useState(100000);
  const [budgetSpent, setBudgetSpent] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [graphData, setGraphData] = useState(weekDays.map(day => ({ date: day, amount: 0 })));
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [totals, setTotals] = useState({ deposits: 0, transfers: 0 });
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:9000/api/transaction/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const formattedTransactions = response.data.transactions.map(transaction => ({
          id: transaction._id,
          name: transaction.recipient_name || 'Transaction',
          amount: transaction.type === 'send' ? -transaction.amount : transaction.amount,
          type: transaction.type === 'send' ? 'transfer' : 'deposit',
          category: transaction.category || 'other',
          date: new Date(transaction.created_at).toLocaleDateString(),
          time: new Date(transaction.created_at).toLocaleTimeString(),
          status: transaction.status || 'completed',
          color: getCategoryColor(transaction.category)
        }));

        setTransactions(formattedTransactions);
        
        // If there's a transaction ID in the URL, find and expand that transaction
        if (id) {
          const transaction = formattedTransactions.find(t => t.id === id);
          if (transaction) {
            setExpandedTransaction(transaction.id);
            setSelectedTransaction(transaction);
          }
        }

        // Update graph data based on actual transactions
        const now = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - i));
          return date.toLocaleDateString();
        });

        const newGraphData = last7Days.map(day => {
          const dayTransactions = formattedTransactions.filter(t => t.date === day);
          const total = dayTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
          return { date: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }), amount: total };
        });
        setGraphData(newGraphData);

        // Update totals
        const newTotals = formattedTransactions.reduce((acc, t) => {
          if (t.type === 'deposit') {
            acc.deposits += Math.abs(t.amount);
          } else {
            acc.transfers += Math.abs(t.amount);
          }
          return acc;
        }, { deposits: 0, transfers: 0 });
        setTotals(newTotals);

      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [id]);

  const getCategoryColor = (category) => {
    const colorMap = {
      food: '#FF6B6B',
      shopping: '#4ECDC4',
      transport: '#45B7D1',
      entertainment: '#96CEB4',
      bills: '#FFEEAD',
      other: '#D4A5A5'
    };
    return colorMap[category?.toLowerCase()] || '#D4A5A5';
  };

  const maxAmount = useMemo(() => Math.max(100, ...graphData.map(d => d.amount)), [graphData]);

  const filteredTransactions = useMemo(() => {
    if (selectedCategory === 'all') {
      return transactions;
    } else if (selectedCategory === 'sent') {
      return transactions.filter(t => t.type === 'transfer');
    } else if (selectedCategory === 'received') {
      return transactions.filter(t => t.type === 'deposit');
    }
    return transactions.filter(t => t.category === selectedCategory);
  }, [transactions, selectedCategory]);

  const handleBudgetUpdate = (update) => {
    switch (update.type) {
      case 'add':
        setBudgetTotal(prev => prev + update.budget.amount);
        break;
      case 'edit': {
        const old = budgets.find(b => b.id === update.budget.id);
        if (old) setBudgetTotal(prev => prev - old.amount + update.budget.amount);
        break;
      }
      case 'delete': {
        const deleted = budgets.find(b => b.id === update.budgetId);
        if (deleted) setBudgetTotal(prev => prev - deleted.amount);
        break;
      }
      default:
        break;
    }
  };

  const barColor = (value) => {
    const percent = (value / maxAmount) * 100;
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-yellow-500';
    return isDarkMode ? 'bg-[#A6E22E]' : 'bg-[#005339]';
  };

  const handleTransactionClick = (transaction) => {
    if (expandedTransaction === transaction.id) {
      setExpandedTransaction(null);
      navigate('/transactions', { replace: true });
    } else {
      setExpandedTransaction(transaction.id);
      navigate(`/transactions/${transaction.id}`, { 
        state: { transaction },
        replace: true 
      });
    }
  };

  const handleViewDetails = (transaction, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedTransaction(transaction);
    navigate(`/transactions/${transaction.id}`, { 
      state: { transaction },
      replace: true 
    });
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
    navigate('/transactions', { replace: true });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-start">
          <h1 className={`font-[Montserrat] font-semibold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Transactions & Budget
          </h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <img 
              src={profileimg} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-white" 
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <BudgetCard budgetTotal={budgetTotal} budgetSpent={budgetSpent} />
          <BudgetModule onBudgetUpdate={handleBudgetUpdate} />
        </div>

        <div className="flex gap-4 p-4 overflow-x-auto">
          <SummaryCard label="Total Deposits" value={totals.deposits} color={isDarkMode ? '#A6E22E' : '#005339'} />
          <SummaryCard label="Total Transfers" value={totals.transfers} color={isDarkMode ? '#A6E22E' : '#005339'} />
        </div>

        <motion.div 
          className={`m-4 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 shadow-sm`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Balance Overview</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last 7 days</p>
            </div>
            <div className="flex gap-2">
              <PeriodButton period="week" selected={selectedPeriod} setSelected={setSelectedPeriod} isDarkMode={isDarkMode} />
              <PeriodButton period="month" selected={selectedPeriod} setSelected={setSelectedPeriod} isDarkMode={isDarkMode} />
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 mt-4">
  {graphData.map((d, i) => (
    <div key={`${d.date}-${i}`} className="flex-1 flex flex-col items-center">
      <motion.div
        layout
        initial={{ height: 0 }}
        animate={{ height: `${d.amount > 0 ? Math.max(20, (d.amount / maxAmount) * 100) : 2}px` }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        className={`w-full rounded-t-lg ${
          d.amount > 0 
            ? isDarkMode ? 'bg-[#A6E22E]' : 'bg-[#005339]'
            : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
        }`}
      />
      <span className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {d.date}
      </span>
      {d.amount > 0 && (
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {d.amount.toLocaleString()}
        </span>
      )}
    </div>
  ))}
</div>


        </motion.div>

        <motion.div 
          className={`m-4 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 shadow-sm`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recent Transactions</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedCategory === 'all'
                    ? isDarkMode ? 'bg-[#A6E22E] text-gray-800' : 'bg-[#005339] text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setSelectedCategory('sent')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedCategory === 'sent'
                    ? isDarkMode ? 'bg-red-500 text-white' : 'bg-red-600 text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Sent
              </button>
              <button 
                onClick={() => setSelectedCategory('received')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedCategory === 'received'
                    ? isDarkMode ? 'bg-[#A6E22E] text-gray-800' : 'bg-[#005339] text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Received
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005339]" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : filteredTransactions.length === 0 ? (
            <div className={`text-center p-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No transactions found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((t) => {
                const Icon = iconMap[t.category] || iconMap.default;
                return (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col p-3 rounded-xl ${
                      expandedTransaction === t.id 
                        ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    } cursor-pointer hover:bg-opacity-80 transition-all duration-200`}
                    onClick={() => handleTransactionClick(t)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center" 
                          style={{ 
                            background: `${t.color || '#ccc'}20`, 
                            color: t.color || '#888' 
                          }}
                        >
                          <Icon size={20} />
                        </div>
                        <div>
                          <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.name}</h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {t.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${t.type === 'deposit' ? 
                          (isDarkMode ? 'text-[#A6E22E]' : 'text-[#005339]') : 
                          (isDarkMode ? 'text-red-400' : 'text-red-500')}`}
                        >
                          {t.type === 'deposit' ? '+' : '-'}{Math.abs(t.amount).toLocaleString()}
                        </span>
                        {expandedTransaction === t.id ? (
                          <ChevronDown size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                        ) : (
                          <ChevronRight size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                        )}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedTransaction === t.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(t);
                          }}
                        >
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</p>
                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.category}</p>
                              </div>
                              <div>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.status}</p>
                              </div>
                              <div className="col-span-2">
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Transaction ID</p>
                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} break-all`}>{t.id}</p>
                              </div>
                              <div>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time</p>
                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.time}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <Navbar />
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex-1 min-w-[200px] rounded-2xl p-4 shadow-sm bg-white dark:bg-gray-800"
  >
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-xl font-semibold" style={{ color }}>{value.toLocaleString()}</p>
  </motion.div>
);

const PeriodButton = ({ period, selected, setSelected, isDarkMode }) => (
  <button
    onClick={() => setSelected(period)}
    className={`px-3 py-1 rounded-lg text-sm ${selected === period
      ? isDarkMode ? 'bg-[#A6E22E] text-gray-800' : 'bg-[#005339] text-white'
      : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
    aria-label={`View ${period} data`}
  >
    {period.charAt(0).toUpperCase() + period.slice(1)}
  </button>
);

export default TransactionHistory;