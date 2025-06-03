import React, { useState, useEffect } from 'react';
import bgimg from '../assets/bgimg.jpg';
import profileimg from '../assets/profileimg.png';
import BalanceCard from '../Components/BalanceCard';
import BudgetCard from '../Components/BudgetCard';
import SendRecieveCard from '../Components/SendRecieveCard';
import QRCard from '../Components/QRCard';
import MoreWithZenpayCard from '../Components/MoreWithZenpay';
import Navbar from '../Components/Navbar';
import ReferCard from '../Components/ReferCard';
import AIChatButton from '../Components/AIChatButton';
import TransactionHistory from '../Components/TransactionHistory';
import { getGreeting, getRandomTip } from '../utils/timeUtils';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import QRScannerModal from '../Components/QRScannerModal';

const Dashboard = () => {
  const [greeting, setGreeting] = useState(getGreeting());
  const [tip, setTip] = useState(getRandomTip());
  const [budgetTotal, setBudgetTotal] = useState(100); // Initial budget
  const [budgetSpent, setBudgetSpent] = useState(90); // Initial spent
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [userName, setUserName] = useState("User");
  const [showQRScanner, setShowQRScanner] = useState(false);

  const location = useLocation(); // Get location object

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    }
  }, []);

  // Effect to open QR scanner if navigated with state
  useEffect(() => {
    if (location.state?.openQRScanner) {
      setShowQRScanner(true);
      // Clear the state to prevent modal from reopening on subsequent visits
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state, location.pathname]); // Depend on location.state and pathname

  // Update greeting every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Update tip every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTip(getRandomTip());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative min-h-screen w-full ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    } transition-colors duration-300`}>
      {/* Main Content Container */}
      <div className="relative z-20 min-h-screen pb-24">
        {/* Top Header Section */}
        <div className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm transition-colors duration-300`}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className={`text-sm font-[Montserrat] flex items-center gap-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {greeting.greeting} {greeting.emoji}
                  </span>
                  <h1 className={`font-[Montserrat] font-semibold text-xl ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {userName}
                  </h1>
                  <p className={`text-sm mt-1 font-[Montserrat] ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {greeting.message}
                  </p>
                </motion.div>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full ${
                    isDarkMode 
                      ? 'bg-gray-700 text-yellow-400' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/profile">
  <img 
    src={profileimg} 
    alt="Profile" 
    className={`w-12 h-12 rounded-full object-cover shadow-md ring-2 ${
      isDarkMode ? 'ring-gray-700' : 'ring-white'
    } cursor-pointer`}
  />
</Link>

                </motion.div>
              </div>
            </div>

            {/* Financial Tip */}
            <motion.div
              className={`mt-4 rounded-xl p-3 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white' 
                  : 'bg-gradient-to-r from-[#005339] to-[#00684A] text-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-sm font-[Montserrat] leading-relaxed">
                💡 Tip: {tip}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="container mx-auto px-4">
          {/* Balance Card */}
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <BalanceCard  />
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div
            className="mt-6 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <BudgetCard budgetTotal={budgetTotal} budgetSpent={budgetSpent} />
            <SendRecieveCard  />
          </motion.div>

          {/* QR Section */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <QRCard onScanQR={() => setShowQRScanner(true)} />
          </motion.div>

          {/* Transaction History */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <TransactionHistory />
          </motion.div>

          {/* More With Zenpay */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className={`font-[Montserrat] font-semibold text-lg mb-4 px-2 flex items-center ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              More with ZenPay
              <span className={`ml-2 text-sm px-2 py-0.5 rounded-full ${
                isDarkMode 
                  ? 'bg-gray-700 text-[#A6E22E]' 
                  : 'bg-[#E8F5E9] text-[#005339]'
              }`}>
                New
              </span>
            </h2>
            <MoreWithZenpayCard />
          </motion.div>

          {/* Refer Section */}
          <motion.div
            className="mt-8 mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <ReferCard />
          </motion.div>
        </div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* AI Chat Button */}
      <AIChatButton />

      {/* QR Scanner Modal */}
      <QRScannerModal show={showQRScanner} onClose={() => setShowQRScanner(false)} />
    </div>
  );
}

export default Dashboard;
