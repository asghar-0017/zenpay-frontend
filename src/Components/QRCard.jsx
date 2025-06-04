import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Camera, QrCode, X, Share2 } from 'lucide-react';
import axios from 'axios';
import QrReader from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';

const QRCard = () => {
  const { isDarkMode } = useTheme();
  const [showMyQR, setShowMyQR] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const handleShowMyQR = async () => {
    setShowMyQR(true);
    const token = localStorage.getItem('token');
    if (!token) return alert('Missing token');
    try {
      setLoading(true);
      const response = await axios.get('https://zenpay-backend.vercel.app/api/qr/generate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.qr_code_url) {
        setQrUrl(response.data.qr_code_url);
      } else {
        alert('QR code not received');
      }
    } catch (err) {
      console.error('QR fetch error:', err);
      alert('Failed to load QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleScanResult = (data) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.account_number && parsed.name) {
        setShowScanner(false);
        navigate('/add-recipient', {
          state: {
            account_number: parsed.account_number,
            name: parsed.name
          }
        });
      } else {
        alert('Invalid QR code data.');
      }
    } catch (err) {
      
    }
  };

  return (
    <div className={`rounded-2xl p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-[Montserrat] text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          QR Code
        </h3>
      </div>

      {/* Scanner */}
      {showScanner && (
        <div className="mb-4 relative rounded-xl overflow-hidden">
<QrReader
  delay={300}
  onScan={handleScanResult}
  onError={(err) => console.error('QR scan error:', err)}
  style={{ width: '100%' }}
/>

          <button
            onClick={() => setShowScanner(false)}
            className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md"
          >
            <X size={20} />
                    <Camera size={14} /> Scan QR
</button>
        </div>
      )}

      {/* My QR Code View */}
      {showMyQR && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex flex-col items-center relative">
          <div className="absolute top-3 right-4 flex gap-2 z-10">
            <button
              onClick={() => setShowMyQR(false)}
              className={`p-2 rounded-full shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}
            >
              <X size={18} />
            </button>
            {qrUrl && (
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(qrUrl);
                  alert('QR code link copied to clipboard!');
                }}
                className={`p-2 rounded-full shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                <Share2 size={18} />
              </button>
            )}
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            {loading ? (
              <p className="text-sm text-center text-gray-400">Loading QR Code...</p>
            ) : qrUrl ? (
              <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
            ) : (
              <p className="text-sm text-center text-gray-400">No QR code available</p>
            )}
          </div>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Scan to pay me</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowScanner(true)}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl ${
            isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          <Camera size={20} />
          <span>Scan QR</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShowMyQR}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl ${
            isDarkMode ? 'bg-[#A6E22E] text-gray-800 hover:bg-[#B6F23E]' : 'bg-[#005339] text-white hover:bg-[#00684A]'
          }`}
        >
          <QrCode size={20} />
          <span>Show My QR</span>
        </motion.button>
      </div>
    </div>
  );
};

export default QRCard;
