import React from 'react';
import { useNavigate } from 'react-router-dom';
import zenpaylogo from '../assets/zenpaylogo.svg';
import bgimg from '../assets/bgimg.jpg';
import bgobject from '../assets/bgobject.png';
import coin from '../assets/coin.png';
import { ArrowRight } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      {/* Background image */}
      <img 
        src={bgimg} 
        alt="ZenPay Background" 
        className="h-[100vh] w-full object-cover filter brightness-30 z-0 absolute top-0 left-0"
      />
      
      {/* Object image at top-right */}
      <img 
        src={bgobject} 
        alt="Object" 
        className="absolute top-[-5px] right-[-5px] brightness-100 z-10"
      />

      {/* ZenPay logo at top-left */}
      <img 
        src={zenpaylogo} 
        alt="ZenPay Logo" 
        className="absolute top-4 left-4 p-2 z-20"
      />
      
      {/* Coins with float animation */}
      <img 
        src={coin} 
        alt="Coin 1" 
        className="absolute top-16 right-[-50px] w-[100px] z-20 animate-float"
      />
      <img 
        src={coin} 
        alt="Coin 2" 
        className="absolute top-[140px] left-[-50px] w-[100px] z-20 opacity-80 animate-float delay-200"
      />
      <img 
        src={coin} 
        alt="Coin 3" 
        className="absolute top-[500px] right-[-50px] w-[100px] z-20 opacity-60 animate-float delay-500"
      />

      {/* Main content container */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-8 z-30">
        {/* Heading with pulse */}
        <h1
          className="text-white text-left font-[Montserrat] mb-6"
          style={{ fontSize: '50px', lineHeight: '58px', fontWeight: 600 }}
        >
          Empowering<br />
          Your <span style={{ color: '#A6E22E', fontStyle: 'italic', fontWeight: 800 }}>Finances</span><br />
          Simplifying<br />
          Your Life.
        </h1>

        {/* Paragraph below heading */}
        <p className="text-white text-left font-light opacity-80 mb-12 max-w-md"
          style={{ fontSize: '20px', lineHeight: '28px', fontWeight: 300, fontFamily: 'Montserrat' }}>
          Secure your financial future with our banking services.
        </p>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-[#005339] to-[#A6E22E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:from-[#00684A] hover:to-[#B6F23E] transition-colors duration-300 flex items-center gap-2"
          >
            Get Started
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Bottom decorative element */}
      <img 
        src={bgobject} 
        alt="Object" 
        className="absolute bottom-[-5px] left-[-5px] brightness-70 z-10 transform scale-x-[-1] transform scale-y-[-1]"
      />
    </div>
  );
}

export default Welcome;
