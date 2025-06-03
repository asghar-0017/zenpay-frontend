// src/components/Popup.js
import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

const Popup = ({ showPopup, onClose }) => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with:', email, password);
  };

  return (
    <>
      {/* Transparent clickable backdrop */}
      {showPopup && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-20"
        ></div>
      )}

      {/* Popup */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white p-6 z-30 transform transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
          showPopup
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-[100%] scale-95 opacity-0 pointer-events-none'
        } h-[500px] rounded-t-[30px] shadow-lg`}
      >

        {/* Pill Toggle */}
        <div className="relative mx-auto w-[300px] h-12 bg-[#D5D5D5] rounded-full flex items-center justify-between p-1">
          {/* Sliding White Pill */}
          <div
            className={`absolute top-0 left-0 w-1/2 h-full bg-white rounded-full shadow transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
              isLoginActive ? 'translate-x-0' : 'translate-x-full'
            }`}
          />
          {/* Login */}
          <span
            onClick={() => setIsLoginActive(true)}
            className={`w-1/2 text-center z-10 font-[Montserrat] font-medium cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
              isLoginActive ? 'text-black' : 'text-[#616161]'
            }`}
          >
            Login
          </span>
          {/* Register */}
          <span
            onClick={() => setIsLoginActive(false)}
            className={`w-1/2 text-center z-10 font-[Montserrat] font-medium cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
              !isLoginActive ? 'text-black' : 'text-[#616161]'
            }`}
          >
            Register
          </span>
        </div>

        {/* Login Form */}
        {isLoginActive && (
          <form className="mt-10 px-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-4 relative">
              <Mail size={20} color="#000000" className="absolute top-4 left-4" />
              <input
                type="text"
                placeholder="Username"
                className="w-full p-4 pl-12 rounded-lg border border-[#D5D5D5] bg-white focus:outline-none focus:border-[#D9D9D9] text-black font-[Montserrat]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-6 relative">
              <Lock size={20} color="#000000" className="absolute top-4 left-4" />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 pl-12 rounded-lg border border-[#D5D5D5] bg-white focus:outline-none focus:border-[#D9D9D9] text-black font-[Montserrat]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#005339] text-white font-[Montserrat] rounded-full text-[16px]"
            >
              Login
            </button>
          </form>
        )}

        {/* Register Form */}
        {!isLoginActive && (
          <div className="mt-10 px-4">
            {/* Placeholder */}
          </div>
        )}
      </div>
    </>
  );
};

export default Popup;
