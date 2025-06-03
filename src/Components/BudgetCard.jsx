import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const BudgetCard = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState({ spent: 0, budget: 0 });

const spentPercent = budgetData.budget > 0 
  ? Math.min(Math.round((budgetData.spent / budgetData.budget) * 100), 100)
  : 0;


  const data = [
    { name: 'Spent', value: budgetData.spent },
    { name: 'Remaining', value: Math.max(budgetData.budget - budgetData.spent, 0) },
  ];

  const COLORS = isDarkMode 
    ? ['#A6E22E', '#374151'] 
    : ['#005339', '#E8F5E9'];

  useEffect(() => {
    const fetchBudget = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:9000/api/budget/status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res)
        setBudgetData({
          budget: res.data.budget,
          spent: res.data.spent
        });
      } catch (error) {
        console.error("Failed to load budget status:", error);
      }
    };

    fetchBudget();
  }, []);

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/transactions')}
      className={`rounded-2xl flex flex-col items-center justify-center p-4 h-[170px] transition-all duration-300 cursor-pointer ${
        isDarkMode 
          ? 'bg-gray-800 shadow-none hover:bg-gray-700' 
          : 'bg-white shadow-sm border border-gray-100 hover:bg-gray-50'
      }`}
    >
      <h2 className={`font-[Montserrat] text-[15px] font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Latest Budget
      </h2>

      <div className="relative">
        <PieChart width={80} height={80}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={38}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {spentPercent}%
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            PKR {budgetData.spent.toLocaleString()}
          </span>
          {' '}of {budgetData.budget.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};

export default BudgetCard;
