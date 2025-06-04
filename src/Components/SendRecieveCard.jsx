import React, { useState,useEffect } from 'react'
import { ArrowUpRight, ArrowDownLeft, X, ChevronDown, User, Clock, Banknote, Link2, Plus, LogOut,Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import profileimg from '../assets/profileimg.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import QrReader from 'react-qr-reader';


// const recipientsList = [
//   { name: 'Owen F.', img: profileimg },
//   { name: 'Faiz Ali', img: profileimg },
//   { name: 'Ayesha K.', img: profileimg },
// ];
const recentsList = [
  { name: 'Ayesha K.', img: profileimg },
  { name: 'Owen F.', img: profileimg },
];

const token = localStorage.getItem("token");


const ActionButton = ({ icon: Icon, label, onClick, variant }) => {
  const { isDarkMode } = useTheme();
  
  const variants = {
    primary: {
      button: isDarkMode
        ? 'bg-[#A6E22E] text-gray-800 hover:bg-[#B6F23E]'
        : 'bg-gradient-to-r from-[#005339] to-[#00684A] text-white hover:shadow-lg',
      icon: isDarkMode
        ? 'bg-black/10'
        : 'bg-white/20'
    },
    secondary: {
      button: isDarkMode
        ? 'bg-gray-700 hover:bg-gray-600'
        : 'bg-gray-50 hover:bg-gray-100',
      icon: isDarkMode
        ? 'bg-[#A6E22E]/10'
        : 'bg-[#005339]/10'
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex-1 relative group overflow-hidden rounded-2xl transition-all duration-200 ${variants[variant].button}`}
    >
      <div className="p-2.5 flex flex-col items-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-transform duration-200 group-hover:scale-110 ${variants[variant].icon}`}>
          <Icon size={20} className={variant === 'secondary' && !isDarkMode ? 'text-[#005339]' : undefined} />
        </div>
        <span className={`text-xs font-medium tracking-tight ${
          variant === 'secondary' 
            ? (isDarkMode ? 'text-gray-200' : 'text-gray-800')
            : undefined
        }`}>
          {label}
        </span>
      </div>
      {/* Hover effect overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
        isDarkMode 
          ? 'bg-white/5'
          : 'bg-black/5'
      }`} />
    </motion.button>
  );
};

const sheetVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.3 } },
};

function playSound(url) {
  const audio = new window.Audio(url);
  audio.play();
}

const Keypad = ({ value, setValue, max = 6, onSendKeyPress }) => (
  <div className="grid grid-cols-3 gap-3 mt-6 w-full max-w-xs mx-auto">
    {[1,2,3,4,5,6,7,8,9,'send',0,'del'].map((key, i) => (
      <button
        key={i}
        className="rounded-xl h-14 text-2xl font-semibold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 active:bg-[#A6E22E]/30 transition flex items-center justify-center"
        onClick={() => {
          if (key === 'del') setValue(v => v.slice(0, -1));
          else if (key === 'send') onSendKeyPress?.();
          else if (value.length < max) setValue(v => v + key);
        }}
      >
        {key === 'del' ? <X size={22} /> : key === 'send' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        ) : key}
      </button>
    ))}
  </div>
);


const SendModal = ({ show, onClose, setBalance }) => {
  const [recipientsList, setRecipientsList] = useState([]);
  const { isDarkMode } = useTheme();
  const [tab, setTab] = useState('send');
  const [recipient, setRecipient] = useState(null); // updated to null
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showQRScanner, setShowQRScanner] = useState(false);
  
  const navigate = useNavigate();

useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("https://zenpay-backend.vercel.app/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res.data.user.balance)
      if (res.data?.user?.balance !== undefined) {
        setWalletBalance(res.data.user.balance);
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error.message);
    }
  };

  if (show) {
    fetchUserProfile();
  }
}, [show]);


  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.recipient-dropdown')) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleScanResult = (data) => {
  try {
    const parsed = JSON.parse(data);
    if (parsed.account_number && parsed.name) {
      setShowQRScanner(false);
      setTimeout(() => {
        navigate('/add-recipient', {
          state: {
            account_number: parsed.account_number,
            name: parsed.name,
            amount: Number(amount)
          }
        });
      }, 300);
    } else {
      alert('Invalid QR code data.');
    }
  } catch (err) {
    alert('Invalid QR format.');
  }
};


  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://zenpay-backend.vercel.app/api/recipient/list', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRecipientsList(res.data.recipients || []);
      } catch (err) {
        console.error("Error fetching recipients:", err.message);
      }
    };

    fetchRecipients();
  }, []);

  const handleRecipientSelect = (r) => {
    setRecipient({
      name: r.name,
      account_number: r.account_number
    });
    setTab('send');
    setDropdownOpen(false);
  };

  const handleSend = () => {
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0 || numericAmount > walletBalance) return;
    setSending(true);

    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      const newBalance = walletBalance - numericAmount;
      setWalletBalance(newBalance);
      if (setBalance) setBalance(newBalance);
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), balance: newBalance }));
      new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3').play();
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={sheetVariants}
        >
          <motion.div
            className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl p-6 pb-32 relative shadow-xl min-h-[70vh] flex flex-col"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700" onClick={onClose} aria-label="Close"><X size={22} /></button>
            <div className="flex justify-center mb-4 mt-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#A6E22E] flex items-center justify-center">
                {recipient?.name ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-white font-bold text-lg">
                    {recipient.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-white font-bold text-lg">
                    ?
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mb-2">
              <div className="relative recipient-dropdown">
                <button onClick={() => setDropdownOpen((v) => !v)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium">
                   <ChevronDown size={18} />
                </button>
                {dropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-10">
                    <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">All Contacts</div>
                    {recipientsList.map((r, i) => (
                      <button
                        key={i}
                        className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleRecipientSelect(r)}
                      >
                        <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold uppercase">
                          {r.name?.charAt(0)}
                        </div>
                        <span className="text-gray-800 dark:text-white">{r.name}</span>
                      </button>
                    ))}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                    <button
                      className="flex items-center gap-2 px-4 py-2 w-full text-[#A6E22E] hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/add-recipient', { state: { amount: Number(amount) } });
                      }}
                    >
                      <Plus size={18} /> Add New Recipient
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="text-center text-3xl font-bold text-[#005339] dark:text-[#A6E22E] my-2">PKR {amount || '0'}</div>

           <div className="flex justify-center mb-2">
  <div className="rounded-xl px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 flex items-center gap-3">
    <Banknote size={18} /> Balance: PKR {walletBalance.toLocaleString()}
    <button
      onClick={() => setShowQRScanner(true)}
      className="flex items-center gap-1 text-sm text-[#005339] dark:text-[#A6E22E] border px-2 py-1 rounded-md border-[#A6E22E] hover:bg-[#A6E22E]/10 transition"
    >
      <Camera size={14} /> Scan QR
    </button>
  </div>
</div>
   {showQRScanner && (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl w-full max-w-xs relative">
        <button
          onClick={() => setShowQRScanner(false)}
          className="absolute top-2 right-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-full"
        >
          <X size={18} />
        </button>
        <p className="text-center mb-3 text-sm text-gray-600 dark:text-gray-300">Scan QR Code</p>
        <QrReader
          delay={300}
          onScan={(data) => data && handleScanResult(data)}
          onError={(err) => console.error('QR scan error:', err)}
          style={{ width: '100%' }}
        />
      </div>
    </motion.div>
  )}

      
      


            <Keypad value={amount} setValue={setAmount} max={6} onSendKeyPress={handleSend} />

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleSend}
              disabled={!amount || Number(amount) <= 0 || Number(amount) > walletBalance || sending}
              className={`mt-6 w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                !amount || Number(amount) <= 0 || Number(amount) > walletBalance || sending
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#A6E22E] text-gray-900'
              }`}
            >
              {sending ? 'Sending...' : 'Send'}
            </motion.button>

            {success && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-3xl z-20"
              >
                <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1.2 }} className="bg-[#A6E22E] rounded-full p-4 mb-2">
                  <ArrowUpRight size={32} className="text-white" />
                </motion.div>
                <div className="text-lg font-bold text-[#005339] dark:text-[#A6E22E]">Sent!</div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DepositModal = ({ show, onClose, balance, setBalance }) => {
  const { isDarkMode } = useTheme();
  const [amount, setAmount] = useState('');
  const [depositing, setDepositing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bankBalance, setBankBalance] = useState(0);

useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("https://zenpay-backend.vercel.app/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = res.data.user;
      setBankBalance(user.bank_account?.balance || 0); // ✅ fix here
    } catch (err) {
      console.error("Failed to load bank balance:", err.message);
    }
  };

  fetchProfile();
}, []);



 const handleDeposit = async () => {
  if (!amount || isNaN(amount) || Number(amount) <= 0) return;

  const token = localStorage.getItem("token");

  try {
    setDepositing(true);

    // Get bank_account_id from profile
    const profileRes = await axios.get("https://zenpay-backend.vercel.app/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const bank_account_id = profileRes.data.user.bank_account?.bank_account_id;

    const response = await axios.post(
      "https://zenpay-backend.vercel.app/api/transaction/withdraw",
      { amount: Number(amount), bank_account_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Play success sound
    try {
      const audio = new Audio("https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3");
      audio.play().catch((err) => console.warn("Audio error:", err));
    } catch (err) {
      console.warn("Fallback audio play failed:", err);
    }

    setSuccess(true);

    // ✅ Only update balance if setBalance is passed
    if (typeof setBalance === 'function') {
      setBalance(prev => prev + Number(amount));
    }

    setTimeout(() => {
      setSuccess(false);
      setAmount('');
      onClose();
    }, 1200);

  } catch (error) {
    console.error("Deposit failed:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Deposit failed.");
  } finally {
    setDepositing(false);
  }
};


  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" initial="hidden" animate="visible" exit="exit" variants={sheetVariants}>
          <motion.div className={`w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl p-6 relative shadow-xl min-h-[70vh] flex flex-col`} initial={{ scale: 0.98 }} animate={{ scale: 1 }} exit={{ scale: 0.98 }}>
            <button className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700" onClick={onClose}><X size={22} /></button>
            <div className="flex items-center gap-3 mb-4">
              <Banknote size={28} className="text-[#A6E22E]" />
              <div>
                <div className="font-semibold text-lg text-gray-800 dark:text-white">Zenbank</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Connected</div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="rounded-xl px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Banknote size={18} /> Bank Balance: PKR {bankBalance.toLocaleString()}
              </div>
              <button className="px-3 py-1 rounded-lg bg-[#A6E22E]/80 text-xs font-medium text-gray-900 flex items-center gap-1">
                <Plus size={14} /> Add Bank
              </button>
            </div>

            <div className="text-center text-3xl font-bold text-[#005339] dark:text-[#A6E22E] my-2">PKR {amount || '0'}</div>
            <Keypad value={amount} setValue={setAmount} max={6} onSendKeyPress={handleDeposit} />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleDeposit}
              disabled={!amount || isNaN(amount) || Number(amount) <= 0 || depositing}
              className={`mt-6 w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                !amount || isNaN(amount) || Number(amount) <= 0 || depositing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#A6E22E] text-gray-900'
              }`}
            >
              {depositing ? 'Depositing...' : 'Deposit'}
            </motion.button>

            {success && (
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-3xl z-20">
                <motion.div className="bg-[#A6E22E] rounded-full p-4 mb-2"><ArrowDownLeft size={32} className="text-white" /></motion.div>
                <div className="text-lg font-bold text-[#005339] dark:text-[#A6E22E]">Deposited!</div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SendRecieveCard = ({ balance, setBalance }) => {
  const { isDarkMode } = useTheme();
  const [showSend, setShowSend] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);

  return (
    <>
      <div className={`rounded-2xl p-4 h-[180px] transition-all duration-300 ${isDarkMode ? 'bg-gray-800 shadow-none' : 'bg-white shadow-sm border border-gray-100'}`}>
        <div className="h-full flex flex-col">
          <h2 className={`font-[Montserrat] text-[15px] font-medium mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Money Transfer</h2>
          <div className="flex-1 flex items-center gap-3">
            <ActionButton icon={ArrowUpRight} label="Send" variant="primary" onClick={() => setShowSend(true)} />
            <ActionButton icon={ArrowDownLeft} label="Deposit" variant="secondary" onClick={() => setShowDeposit(true)} />
          </div>
        </div>
      </div>

      <SendModal show={showSend} onClose={() => setShowSend(false)} balance={balance} setBalance={setBalance} />
      <DepositModal show={showDeposit} onClose={() => setShowDeposit(false)} balance={balance} setBalance={setBalance} />
    </>
  );
};

export default SendRecieveCard;
