import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import profileimg from '../assets/profileimg.png';

const AIIcon = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
    <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="currentColor" />
    <path d="M2 23L16 30L30 23L16 16L2 23Z" fill="currentColor" />
    <path d="M2 16L16 23L30 16L16 9L2 16Z" fill="currentColor" fillOpacity="0.6" />
  </svg>
);
const parseTransferInstruction = (text) => {
  const match = text.match(/send\s+PKR\s*(\d+)\s+to\s+([a-zA-Z ]+)/i);
  if (match) {
    return {
      amount: parseInt(match[1]),
      recipientName: match[2].trim()
    };
  }

  return null;
};


const AIChatButton = () => {
  const [pendingTransfer, setPendingTransfer] = useState(null); // { amount, recipientName }
const [confirming, setConfirming] = useState(false);
const [pin, setPin] = useState('');

  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
const [showPinModal, setShowPinModal] = useState(false);
const [transferExecuted, setTransferExecuted] = useState(false);
const [displayCount, setDisplayCount] = useState(5); // State to track how many messages to display

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

const confirmTransfer = async () => {
  if (!pendingTransfer || !pin.trim() || transferExecuted) return;

  setTransferExecuted(true); // 🔒 lock to prevent double calls

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const user_id = storedUser?.id;
  const token = localStorage.getItem('token');

  try {
    const res = await axios.get('https://zenpay-backend.vercel.app/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const users = res.data;
    const recipient = users.find(
      u => u.name.toLowerCase() === pendingTransfer.recipientName.toLowerCase()
    );

    if (!recipient || !recipient.linked_bank_accounts?.[0]) {
      throw new Error('Recipient or their bank account not found.');
    }

    const recipient_account_number = recipient.linked_bank_accounts[0].account_number;

    await axios.post(
      'https://zenpay-backend.vercel.app/api/transaction/transfer',
      {
        sender_id: user_id,
        recipient_account_number,
        amount: pendingTransfer.amount,
        transaction_pin: pin
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setMessages(prev => [
      ...prev,
      {
        from: 'ai',
        text: `✅ Transfer of PKR ${pendingTransfer.amount} to ${pendingTransfer.recipientName} completed.`
      }
    ]);
  } catch (err) {
    console.error(err);
    setMessages(prev => [
      ...prev,
      {
        from: 'ai',
        text: `❌ Transfer failed: ${err.response?.data?.message || err.message}`
      }
    ]);
  } finally {
    setPendingTransfer(null);
    setConfirming(false);
    setShowPinModal(false);
    setPin('');
    setTransferExecuted(false); // reset lock for next use
  }
};




  // 🔁 Load chat history on open
useEffect(() => {
  const fetchHistory = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const user_id = storedUser?.id;
    if (!user_id) return;

    try {
      const res = await axios.get(`https://zenpay-backend.vercel.app/api/ai/history/${user_id}`);
      const rawHistory = res.data.history || [];

      // 🔁 Normalize into user/ai messages
      const formatted = rawHistory.flatMap(entry => [
        { from: 'user', text: entry.query },
        { from: 'ai', text: entry.ai_response }
      ]);

      setMessages(formatted);
      // Initialize display count to show last 5 messages, or all if less than 5
      setDisplayCount(Math.min(5, formatted.length));

    } catch (err) {
      console.error("Failed to load history:", err.message);
    }
  };

  if (isOpen) fetchHistory();
}, [isOpen]);

// Effect to scroll to bottom when messages or displayCount changes and modal is open
useEffect(() => {
  if (isOpen) {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [messages, displayCount, isOpen]);



const sendMessage = async () => {
  if (!question.trim()) return;

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const user_id = storedUser?.id;
  if (!user_id) return alert("User not found");

  const lowerCaseQuestion = question.trim().toLowerCase();

  // ✅ If waiting for confirmation and user says "yes"
  if (confirming && pendingTransfer && (lowerCaseQuestion === 'yes' || lowerCaseQuestion === 'y')) {
    setMessages(prev => [...prev, { from: 'user', text: question }]); // log "yes"
    // setConfirming(false);
    setShowPinModal(true);  // ✅ this opens PIN modal
    setQuestion('');
    return;
  }

  // ❌ User cancels transfer
  if (confirming && (lowerCaseQuestion === 'no' || lowerCaseQuestion === 'n')) {
    setMessages(prev => [...prev, { from: 'user', text: question }, { from: 'ai', text: '❌ Transfer cancelled.' }]);
    setConfirming(false);
    setPendingTransfer(null);
    setPin('');
    setQuestion('');
    return;
  }

  // 🧠 Normal AI flow
  setMessages(prev => [...prev, { from: 'user', text: question }]);
  setQuestion('');
  setSending(true);

  try {
    const res = await axios.post('https://zenpay-backend.vercel.app/api/ai/query', {
      user_id,
      question
    });

    const reply = res.data?.answer || "Sorry, I couldn't understand that.";
    setMessages(prev => [...prev, { from: 'ai', text: reply }]);

    const transferDetails = parseTransferInstruction(reply);
    if (transferDetails) {
      setPendingTransfer(transferDetails);
      setConfirming(true); // waits for yes/no
    }
  } catch (error) {
    console.error(error);
    alert("Failed to get response.");
  } finally {
    setSending(false);
  }
};

const loadMoreMessages = () => {
  setDisplayCount(prevCount => Math.min(messages.length, prevCount + 5)); // Load 5 more messages
};




  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 right-4 z-50">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`absolute right-16 top-2 rounded-2xl py-2 px-4 text-sm font-medium shadow-lg ${
                isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
              }`}
            >
              Ask ZenAI for help! ✨
              <div className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 rotate-45 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
            isDarkMode 
              ? 'bg-[#005339] text-white' 
              : 'bg-gradient-to-r from-[#005339] to-[#00684A] text-white'
          }`}
          animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 0.8 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X size={24} /> : <AIIcon />}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`fixed left-4 right-4 bottom-24 rounded-3xl shadow-2xl overflow-hidden ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              style={{ maxHeight: 'calc(100vh - 180px)' }}
            >
              <div className={`p-4 flex items-center justify-between ${
                isDarkMode 
                  ? 'bg-gray-700' 
                  : 'bg-gradient-to-r from-[#005339] to-[#00684A]'
              }`}>
                <h3 className="text-white font-medium flex items-center gap-2">
                  <AIIcon />
                  Chat with ZenAI
                </h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="flex flex-col h-[calc(100vh-280px)]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
                  {/* Load More button */}
                  {messages.length > displayCount && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={loadMoreMessages}
                      className={`w-full py-2 text-sm rounded-xl ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Load older messages
                    </motion.button>
                  )}

                  {/* Display subset of messages */}
                  {messages.slice(messages.length - displayCount).map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.from === 'ai' && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#005339] text-white flex-shrink-0">
                          <AIIcon />
                        </div>
                      )}
                      <div className={`p-3 rounded-xl max-w-[80%] ${
                        msg.from === 'user' 
                          ? (isDarkMode ? 'bg-[#A6E22E] text-gray-800' : 'bg-[#005339] text-white') 
                          : (isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800')
                      }`}>
                       {msg.text.includes('\n') ? (
  <div className="space-y-1 text-sm leading-relaxed">
    {msg.text.split('\n').map((line, idx) => (
      <div key={idx}>
        {line.startsWith('*') ? (
          <li className="list-disc ml-5">{line.replace(/^\*+\s*/, '')}</li>
        ) : (
          <p>{line}</p>
        )}
      </div>
    ))}
  </div>
) : (
  <span>{msg.text}</span>
)}

                      </div>
                      {msg.from === 'user' && (
                         <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                           <img src={profileimg} alt="You" className="w-full h-full object-cover" />
                         </div>
                       )}
                    </motion.div>
                  ))}
                  {/* Ref for scrolling */}
                  <div ref={messagesEndRef} />

                  {sending && (
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm flex items-center gap-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} ${isDarkMode ? 'ml-auto' : 'mr-auto'}`}>
                      <Loader2 className="animate-spin" size={18} />
                      Typing...
                    </div>
                  )}
                </div>

                <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3 max-w-3xl mx-auto">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask anything about your finances..."
                      className={`flex-1 p-3 rounded-2xl text-sm border outline-none ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                          : 'bg-gray-100 text-gray-800 placeholder-gray-500'
                      }`}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={sending || !question.trim()}
                      className={`px-5 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                        sending || !question.trim()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isDarkMode
                            ? 'bg-[#A6E22E] text-gray-900'
                            : 'bg-[#005339] text-white'
                      }`}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

     {showPinModal && pendingTransfer && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
        Enter PIN to confirm sending PKR {pendingTransfer.amount} to {pendingTransfer.recipientName}
      </h2>
      <input
        type="password"
        placeholder="Enter Transaction PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="w-full mb-4 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
      />
      <div className="flex justify-between">
        <button onClick={() => { setShowPinModal(false); setPin(''); }} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-black dark:text-white">Cancel</button>
        <button onClick={confirmTransfer} className="px-4 py-2 rounded bg-green-600 text-white">Confirm</button>
      </div>
    </div>
  </div>
)}


    </>
  );
};

export default AIChatButton;
