import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

const BudgetModule = ({ onBudgetUpdate }) => {
  const { isDarkMode } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetCategory, setBudgetCategory] = useState('');
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgets, setBudgets] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchBudgets = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get('http://localhost:9000/api/budget/allstatus', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBudgets(res.data); // Contains spent & percent fields
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
    }
  };

  fetchBudgets();
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      category: budgetCategory,
      amount: parseFloat(budgetAmount),
      start_date: startDate,
      end_date: endDate,
    };

    try {
      if (editingBudget) {
        const res = await axios.put(
          `http://localhost:9000/api/budget/update/${editingBudget._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = budgets.map(b => b._id === editingBudget._id ? res.data.budget : b);
        setBudgets(updated);
      } else {
        const res = await axios.post(
          'http://localhost:9000/api/budget/set',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBudgets([...budgets, res.data.budget]);
      }
      setBudgetAmount('');
      setBudgetCategory('');
      setStartDate('');
      setEndDate('');
      setShowForm(false);
      setEditingBudget(null);
    } catch (err) {
      console.error('Failed to submit budget', err);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setBudgetCategory(budget.category);
    setBudgetAmount(budget.amount.toString());
    setStartDate(budget.start_date.split('T')[0]);
    setEndDate(budget.end_date.split('T')[0]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/budget/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(budgets.filter(b => b._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };
  return (
    <div className={`rounded-2xl p-4 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } shadow-sm`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-[Montserrat] text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Budget Management
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingBudget(null);
              setBudgetAmount('');
              setBudgetCategory('');
            }
          }}
          className={`p-2 rounded-full ${
            isDarkMode 
              ? 'bg-gray-700 text-[#A6E22E]' 
              : 'bg-[#E8F5E9] text-[#005339]'
          }`}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </motion.button>
      </div>

      {/* Add/Edit Budget Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className={`mb-4 p-4 rounded-xl ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}
        >
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Category
              </label>
              <input
                type="text"
                value={budgetCategory}
                onChange={(e) => setBudgetCategory(e.target.value)}
                placeholder="e.g., Monthly Expenses"
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'bg-white border-gray-200 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-[#A6E22E]`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Budget Amount (PKR)
              </label>
              <input
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="Enter amount"
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'bg-white border-gray-200 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-[#A6E22E]`}
              />
            </div>
            <div>
  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
    Start Date
  </label>
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className={`w-full px-3 py-2 rounded-lg border ${
      isDarkMode 
        ? 'bg-gray-600 border-gray-500 text-white' 
        : 'bg-white border-gray-200 text-gray-800'
    } focus:outline-none focus:ring-2 focus:ring-[#A6E22E]`}
    required
  />
</div>

<div>
  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
    End Date
  </label>
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className={`w-full px-3 py-2 rounded-lg border ${
      isDarkMode 
        ? 'bg-gray-600 border-gray-500 text-white' 
        : 'bg-white border-gray-200 text-gray-800'
    } focus:outline-none focus:ring-2 focus:ring-[#A6E22E]`}
    required
  />
</div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#005339] to-[#A6E22E] text-white py-2 rounded-lg font-medium hover:from-[#00684A] hover:to-[#B6F23E] transition-colors duration-300"
            >
              {editingBudget ? 'Update Budget' : 'Add Budget'}
            </button>
          </div>
        </motion.form>
      )}

      {/* Budget List */}
      {/* Budget List */}
<div className="space-y-3">
  {budgets.map((budget) => (
    <motion.div
      key={budget._id || budget.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-xl ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className={`font-medium ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {budget.category}
          </h4>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            PKR {budget.amount.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEdit(budget)}
            className={`p-1 rounded-full ${
              isDarkMode 
                ? 'text-gray-400 hover:text-[#A6E22E]' 
                : 'text-gray-500 hover:text-[#005339]'
            }`}
          >
            <Edit2 size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(budget._id || budget.id)}
            className={`p-1 rounded-full ${
              isDarkMode 
                ? 'text-gray-400 hover:text-red-400' 
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
      <div className="mt-2">
       <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-600">
  <div
    className={`h-2 rounded-full ${
      budget.percent >= 90
        ? 'bg-red-500'
        : budget.percent >= 70
        ? 'bg-yellow-500'
        : isDarkMode
        ? 'bg-[#A6E22E]'
        : 'bg-[#005339]'
    }`}
    style={{ width: `${Math.min(budget.percent, 100)}%` }}
  />
</div>

        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">
  Spent: PKR {budget.spent?.toLocaleString() || 0}
</span>
<span className="text-xs text-gray-400">
  {Math.min(Math.round(budget.percent || 0), 100)}%
</span>

        </div>
      </div>
    </motion.div>
  ))}
</div>

    </div>
  );
};

export default BudgetModule; 