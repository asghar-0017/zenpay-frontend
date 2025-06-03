export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Good Morning",
      message: "Start your day with Zenpay",
      emoji: "🌅"
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: "Good Afternoon",
      message: "Hope you're having a great day",
      emoji: "☀️"
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: "Good Evening",
      message: "Wind down with Zenpay",
      emoji: "🌆"
    };
  } else {
    return {
      greeting: "Good Night",
      message: "Thanks for using Zenpay today",
      emoji: "🌙"
    };
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getRandomTip = () => {
  const tips = [
    "Set a budget to track your spending 📊",
    "Save money for a rainy day ⛈️",
    "Pay bills on time to avoid late fees 📅",
    "Track your expenses regularly 📱",
    "Plan ahead for big purchases 🎯",
    "Use Zenpay QR for quick payments 📲",
    "Invite friends to earn rewards 🎁",
    "Keep your account secure 🔒"
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}; 