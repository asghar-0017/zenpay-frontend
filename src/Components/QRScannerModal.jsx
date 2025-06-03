import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Scanner } from '@yudiel/react-qr-scanner';

const sheetVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.3 } },
};

const QRScannerModal = ({ show, onClose }) => {
  const { isDarkMode } = useTheme();
  const [scanning, setScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true); // Assume camera exists initially

  useEffect(() => {
    if (show) {
      setScanning(true);
      // Check for camera devices when modal opens
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          setHasCamera(videoDevices.length > 0);
        })
        .catch(err => {
          console.error("Error enumerating devices:", err);
          setHasCamera(false); // Assume no camera if enumeration fails
        });
    } else {
      setScanning(false);
      setHasCamera(true); // Reset state when modal closes
    }
  }, [show]);

  const handleScan = (result) => {
    if (result) {
      console.log('QR Code Scanned:', result);
      // TODO: Handle the scanned QR code data (e.g., navigate, process payment)
      onClose(); // Close modal after scanning
    }
  };

  const handleError = (err) => {
    console.error(err);
    // Handle specific errors if needed, e.g., NotAllowedError for permission issues
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={sheetVariants}
          onClick={onClose}
        >
          <motion.div
            className={`w-full max-w-md mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl p-6 relative shadow-xl min-h-[70vh] flex flex-col`}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10" onClick={onClose} aria-label="Close"><X size={22} /></button>
            
            <h2 className={`text-xl font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Scan QR Code</h2>

            <div className="flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
              {show && ( // Only attempt to render scanner if modal is open
                hasCamera ? (
                  <Scanner
                    onResult={handleScan}
                    onError={handleError}
                    options={{ constraints: { facingMode: 'environment' } }}
                    // Add a key prop to force re-render if show changes, can help with camera issues
                    key={show.toString()}
                  />
                ) : (
                  <div className={`text-center p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>No camera device found.</p>
                    <p>A camera is required to scan QR codes.</p>
                  </div>
                )
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRScannerModal; 