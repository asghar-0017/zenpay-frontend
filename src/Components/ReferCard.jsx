import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Gift, Copy, Check, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const ReferCard = () => {
  const { isDarkMode } = useTheme();
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const referralCode = "ZENPAY2024";
  const referralLink = `https://zenpay.app/join?ref=${referralCode}`;

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      showToastMessage('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying:', err);
      showToastMessage('Failed to copy. Please try again.', 'error');
    }
  };

  const shareReferral = async () => {
    const shareData = {
      title: 'Join me on ZenPay!',
      text: `Hey! Use my referral code ${referralCode} to sign up on ZenPay and get exciting rewards! 🎁`,
      url: referralLink
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToastMessage('Shared successfully!');
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(
          `${shareData.text}\n\n${shareData.url}`
        );
        showToastMessage('Referral link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        showToastMessage('Failed to share. Please try again.', 'error');
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}
      >
        {/* Top Pattern */}
        <div className="absolute top-0 right-0 w-full h-24 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#005339] rounded-full transform translate-x-20 -translate-y-20" />
          <div className="absolute top-10 left-0 w-20 h-20 bg-[#00684A] rounded-full transform -translate-x-10" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Refer & Earn Rewards! 🎁
              </h2>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              } mb-4`}>
                Share ZenPay with friends and both get PKR 500 when they join!
              </p>
            </div>
            <Gift className={`w-8 h-8 ${
              isDarkMode ? 'text-[#A6E22E]' : 'text-[#005339]'
            }`} />
          </div>

          {/* Referral Code Section */}
          <div className={`mt-4 p-3 rounded-xl ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          } flex items-center justify-between`}>
            <div>
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Your Referral Code
              </span>
              <p className={`font-mono font-bold text-lg ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {referralCode}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className={`p-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-600 hover:bg-gray-500' 
                  : 'bg-white hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className={`w-5 h-5 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`} />
              )}
            </motion.button>
          </div>

          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={shareReferral}
            className="mt-4 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#005339] to-[#00684A] text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow duration-200"
          >
            <Share2 size={18} />
            Share with Friends
          </motion.button>

          {/* Progress Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Referral Progress
              </span>
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                2/5 Friends
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full w-[40%] bg-gradient-to-r from-[#005339] to-[#00684A]"
                style={{ transition: 'width 0.5s ease-in-out' }}
              />
            </div>
            <p className={`mt-2 text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Invite 3 more friends to unlock PKR 2,500 bonus! 🎯
            </p>
          </div>
        </div>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
              toastType === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {toastType === 'success' ? (
              <Check size={20} />
            ) : (
              <X size={20} />
            )}
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ReferCard
