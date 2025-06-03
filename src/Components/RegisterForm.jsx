import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  User,
  Users,
  Phone,
  Mail,
  CreditCard,
  Building2,
  Upload,
  ChevronRight,
  ChevronLeft,
  Check,
  Lock   
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Basic details as per CNIC'
  },
  {
    id: 2,
    title: 'Contact Details',
    description: 'How we can reach you'
  },
  {
    id: 3,
    title: 'Identity Verification',
    description: 'CNIC and photo verification'
  },
  {
    id: 4,
    title: 'Bank Details',
    description: 'Your bank account information'
  }
];

const RegisterForm = ({ onClose }) => {
  const { isDarkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate(); // ✅ move here

const [formData, setFormData] = useState({
  fullName: '',
  guardianName: '',
  password:'',
  phone: '',
  email: '',
  cnic: '',
  bankTitle: '',
  bankName: '',
  transaction_pin: '',
  accountNumber: ''
 });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
const handleSubmit = async () => {
  try {
    const payload = {
      name: formData.fullName,
      email: formData.email,
      phone_number: formData.phone,
      password: formData.password,
      transaction_pin: formData.transaction_pin,
      cnic: formData.cnic,
      account_number: formData.accountNumber,
      wallet_topup: 1500, // required by backend
    };

    console.log("🚀 Payload to backend:", payload);

    const response = await axios.post('http://localhost:9000/api/auth/register', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Registration Success:', response.data);
    onClose();
    navigate("/login");
  } catch (error) {
    console.error('❌ Registration Error:', error.response?.data || error.message);
    alert(error.response?.data?.message || 'Registration failed');
  }
};



  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Full Name (As per CNIC)
        </label>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <User size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`flex-1 bg-transparent border-none outline-none ${
              isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
            }`}
            placeholder="Enter your full name"
          />
        </div>
      </div>

      {/* Guardian Name */}
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Father / Husband's Name
        </label>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <Users size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <input
            type="text"
            name="guardianName"
            value={formData.guardianName}
            onChange={handleInputChange}
            className={`flex-1 bg-transparent border-none outline-none ${
              isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
            }`}
            placeholder="Enter guardian's name"
          />
        </div>
      </div>

      {/* Transaction PIN */}
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          4-Digit Transaction PIN
        </label>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <Lock size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <input
            type="password"
            name="transaction_pin"
            value={formData.transaction_pin}
            onChange={handleInputChange}
            placeholder="Enter 4-digit PIN"
            maxLength={4}
            className={`flex-1 bg-transparent border-none outline-none ${
              isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Password
        </label>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <Lock size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            className={`flex-1 bg-transparent border-none outline-none ${
              isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
            }`}
          />
        </div>
      </div>
    </div>
  );
 
      
        case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Phone Number
              </label>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Phone size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`flex-1 bg-transparent border-none outline-none ${
                    isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                  }`}
                  placeholder="03XX-XXXXXXX"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Mail size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`flex-1 bg-transparent border-none outline-none ${
                    isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                CNIC Number
              </label>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <CreditCard size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                <input
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  className={`flex-1 bg-transparent border-none outline-none ${
                    isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                  }`}
                  placeholder="XXXXX-XXXXXXX-X"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Upload Photo
              </label>
              <div className={`relative flex items-center justify-center p-4 rounded-xl border-2 border-dashed ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700/50' 
                  : 'border-gray-300 bg-gray-50'
              }`}>
                <input
                  type="file"
                  name="photo"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <div className="flex flex-col items-center">
                  <Upload size={24} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <p className={`mt-2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {formData.photo ? formData.photo.name : 'Click to upload your photo'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Bank Title
              </label>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Building2 size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                <input
                  type="text"
                  name="bankTitle"
                  value={formData.bankTitle}
                  onChange={handleInputChange}
                  className={`flex-1 bg-transparent border-none outline-none ${
                    isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                  }`}
                  placeholder="Enter bank title"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Bank Name
              </label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-xl appearance-none ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <option value="">Select your bank</option>
                <option value="HBL">HBL</option>
                <option value="UBL">UBL</option>
                <option value="MCB">MCB</option>
                <option value="ABL">ABL</option>
                <option value="ZenBank">ZenBank</option>
                <option value="Bank Alfalah">Bank Alfalah</option>
                <option value="Meezan Bank">Meezan Bank</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Bank Account Number
              </label>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <CreditCard size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className={`flex-1 bg-transparent border-none outline-none ${
                    isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                  }`}
                  placeholder="Enter account number"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto p-6 rounded-3xl ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.id === currentStep
                ? isDarkMode
                  ? 'bg-[#A6E22E] text-gray-800'
                  : 'bg-[#005339] text-white'
                : step.id < currentStep
                ? 'bg-green-500 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-400'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step.id < currentStep ? (
                <Check size={16} />
              ) : (
                step.id
              )}
            </div>
            <div className={`h-1 w-16 ${
              step.id < currentStep
                ? 'bg-green-500'
                : isDarkMode
                ? 'bg-gray-700'
                : 'bg-gray-200'
            }`} />
          </div>
        ))}
      </div>

      {/* Step Title */}
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {steps[currentStep - 1].title}
        </h2>
        <p className={`text-sm mt-1 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {steps[currentStep - 1].description}
        </p>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {currentStep > 1 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft size={18} />
            Back
          </motion.button>
        ) : (
          <div />
        )}
        <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={currentStep === 4 ? handleSubmit : handleNext}
  className={`flex items-center gap-2 px-6 py-2 rounded-xl ${
    isDarkMode
      ? 'bg-[#A6E22E] text-gray-800 hover:bg-[#B6F23E]'
      : 'bg-[#005339] text-white hover:bg-[#006349]'
  }`}
>
  {currentStep === 4 ? 'Submit' : 'Next'}
  <ChevronRight size={18} />
</motion.button>

      </div>
    </div>
  );
};

export default RegisterForm; 