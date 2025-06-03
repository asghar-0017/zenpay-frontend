import React from 'react'
import Welcome from './Pages/Welcome'
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import TransactionHistory from './Pages/TransactionHistory';
import TransactionDetail from './Pages/TransactionDetail';
import ProfilePage from './Pages/ProfilePage';
import AddRecipient from './Pages/AddRecipient';
import ComingSoon from './Pages/ComingSoon';
import { ThemeProvider } from './context/ThemeContext';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/transactions/:id" element={<TransactionHistory />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-recipient" element={<AddRecipient />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App;