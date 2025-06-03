// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import zenpaylogo from '../assets/zenpaylogo.svg';
import bgimg from '../assets/bgimg.jpg';
import coin from '../assets/coin.png'; // Coin image path
import { ArrowLeft, User, Lock, Eye, EyeOff } from 'lucide-react'; // Importing the left arrow and other icons from lucide-react
import RegisterForm from '../Components/RegisterForm';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUser } from '../api/auth.jsx';
const Login = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const { isDarkMode } = useTheme();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const { username, password } = loginForm;
    const response = await loginUser(username, password);

    console.log("✅ Backend Login Response:", response);

    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    navigate('/dashboard');
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data?.message || error.message);
    alert(error.response?.data?.message || "Login failed");
  }
};


  // Use effect to show the popup after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1500); // Popup appears 1.5 seconds after page load

    return () => clearTimeout(timer); // Clear the timeout if the component is unmounted
  }, []);

  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgimg} 
          alt="ZenPay Background" 
          className="h-full w-full object-cover filter brightness-50"
        />
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-gray-900/50 to-gray-900/90' 
            : 'bg-gradient-to-b from-black/30 to-black/80'
        }`} />
      </div>
      
      {/* Logo and Back Button */}
      <div className="absolute top-0 left-0 z-20 p-4 space-y-6">
        <motion.img 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          src={zenpaylogo} 
          alt="ZenPay Logo" 
          className="p-2"
        />
        
        <motion.button
          onClick={() => navigate('/')}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`w-14 h-14 border-2 rounded-full flex justify-center items-center cursor-pointer ${
            isDarkMode 
              ? 'border-[#A6E22E] text-[#A6E22E] hover:bg-[#A6E22E]/10' 
              : 'border-white text-white hover:bg-white/10'
          } transition-colors duration-300`}
        >
          <ArrowLeft size={30} />
        </motion.button>
      </div>

      {/* Floating Coins */}
      <motion.img 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.8 }}
        transition={{ duration: 1, delay: 0.3 }}
        src={coin} 
        alt="Coin 1" 
        className="absolute top-16 right-[-50px] w-[100px] z-20 animate-float"
      />
      <motion.img 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.5 }}
        src={coin} 
        alt="Coin 2" 
        className="absolute top-[140px] left-[-50px] w-[100px] z-20 animate-float delay-200"
      />
      <motion.img 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.4 }}
        transition={{ duration: 1, delay: 0.7 }}
        src={coin} 
        alt="Coin 3" 
        className="absolute top-[500px] right-[-50px] w-[100px] z-20 animate-float delay-500"
      />

      {/* Welcome Text */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-1/4 left-0 right-0 z-20 text-center px-6"
      >
        <div className="max-w-sm mx-auto">
          <h1 className="text-white font-semibold text-[2.5rem] font-[Montserrat] leading-tight">
            Your Financial Journey Starts Here
          </h1>
          <p className="mt-4 text-white/80 text-lg font-light font-[Montserrat]">
            Experience secure and seamless digital banking
          </p>
        </div>
      </motion.div>

      {/* Login/Register Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className={`w-full min-h-[65vh] rounded-t-[32px] shadow-2xl ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}>
              {/* Tabs */}
              <div className="flex justify-center gap-8 pt-8 pb-6">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`relative px-4 py-2 text-lg font-medium transition-colors ${
                    activeTab === 'login'
                      ? isDarkMode ? 'text-[#A6E22E]' : 'text-[#005339]'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`}
                >
                  Login
                  {activeTab === 'login' && (
                    <motion.div
                      layoutId="tab-indicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        isDarkMode ? 'bg-[#A6E22E]' : 'bg-[#005339]'
                      }`}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`relative px-4 py-2 text-lg font-medium transition-colors ${
                    activeTab === 'register'
                      ? isDarkMode ? 'text-[#A6E22E]' : 'text-[#005339]'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`}
                >
                  Register
                  {activeTab === 'register' && (
                    <motion.div
                      layoutId="tab-indicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        isDarkMode ? 'bg-[#A6E22E]' : 'bg-[#005339]'
                      }`}
                    />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {activeTab === 'register' ? (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RegisterForm onClose={() => setActiveTab('login')} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-md mx-auto"
                    >
                      <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Field */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Username
                          </label>
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            <User size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                            <input
                              type="text"
                              name="username"
                              value={loginForm.username}
                              onChange={handleLoginChange}
                              placeholder="Enter your username"
                              className={`flex-1 bg-transparent border-none outline-none ${
                                isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Password Field */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Password
                          </label>
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            <Lock size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={loginForm.password}
                              onChange={handleLoginChange}
                              placeholder="Enter your password"
                              className={`flex-1 bg-transparent border-none outline-none ${
                                isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className={`p-1 rounded-full hover:bg-opacity-10 ${
                                isDarkMode ? 'hover:bg-white' : 'hover:bg-gray-800'
                              }`}
                            >
                              {showPassword ? (
                                <EyeOff size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                              ) : (
                                <Eye size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Login Button */}
                        <button
                          type="submit"
                          className={`w-full py-4 rounded-xl font-medium transition-colors ${
                            isDarkMode 
                              ? 'bg-[#A6E22E] text-white hover:bg-[#8BC34A]' 
                              : 'bg-[#005339] text-white hover:bg-[#003D2A]'
                          }`}
                        >
                          Login
                        </button>

                        {/* Forgot Password Link */}
                        <div className="text-center">
                          <button
                            type="button"
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-400 hover:text-[#A6E22E]' : 'text-gray-600 hover:text-[#005339]'
                            } transition-colors`}
                          >
                            Forgot Password?
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;
