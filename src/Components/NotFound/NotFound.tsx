import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home");
  };

  const contactSupport = () => {
    navigate("/contact"); 
  };
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background floating circles */}
      <div className="absolute w-96 h-96 bg-orange-300 rounded-full opacity-30 animate-pulse -top-20 -left-20"></div>
      <div className="absolute w-72 h-72 bg-yellow-400 rounded-full opacity-30 animate-bounce -bottom-32 -right-16"></div>
      <div className="absolute w-80 h-80 bg-pink-300 rounded-full opacity-20 animate-ping top-1/3 left-1/4"></div>

      {/* Main 404 container */}
      <div className="z-10 text-center px-6 md:px-0">
        {/* Cute Pet Illustration */}
        <div className="relative inline-block mb-8">
          {/* Dog face */}
          <div className="w-40 h-40 bg-white dark:bg-gray-700 rounded-full relative drop-shadow-lg">
            {/* Ears */}
            <div className="absolute w-16 h-16 bg-white dark:bg-gray-700 rounded-full -top-4 -left-4 rotate-12"></div>
            <div className="absolute w-16 h-16 bg-white dark:bg-gray-700 rounded-full -top-4 -right-4 -rotate-12"></div>
            {/* Eyes */}
            <div className="absolute w-6 h-6 bg-black rounded-full top-16 left-12"></div>
            <div className="absolute w-6 h-6 bg-black rounded-full top-16 right-12"></div>
            {/* Nose */}
            <div className="absolute w-6 h-4 bg-black rounded-full top-24 left-1/2 -translate-x-1/2"></div>
            {/* Mouth */}
            <div className="absolute w-12 h-2 bg-black rounded-full top-28 left-1/2 -translate-x-1/2"></div>
          </div>
          {/* Paw prints animation */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3 animate-bounce">
            <span className="text-3xl">🐾</span>
            <span className="text-3xl">🐾</span>
            <span className="text-3xl">🐾</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-extrabold text-orange-500 dark:text-yellow-400 mb-4 animate-pulse">
          404
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6">
          Oops! It seems this page ran away like a playful puppy. 🐶
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={goHome}
            className="px-6 py-3 bg-orange-500 dark:bg-yellow-400 text-white dark:text-gray-900 font-semibold rounded-full shadow-lg hover:scale-105 hover:bg-orange-600 dark:hover:bg-yellow-300 transition-all duration-300"
          >
            🏠 Go Home
          </button>

          <button
            onClick={contactSupport}
            className="px-6 py-3 bg-transparent border-2 border-orange-500 dark:border-yellow-400 text-orange-500 dark:text-yellow-400 font-semibold rounded-full shadow-md hover:bg-orange-500 dark:hover:bg-yellow-400 hover:text-white dark:hover:text-gray-900 transition-all duration-300"
          >
            📞 Contact Us
          </button>
        </div>
      </div>

      {/* Bottom paw prints floating */}
      <div className="absolute bottom-8 left-1/4 flex gap-4 animate-[wiggle_2s_ease-in-out_infinite]">
        <span className="text-2xl">🐾</span>
        <span className="text-2xl">🐾</span>
      </div>
      <div className="absolute bottom-12 right-1/3 flex gap-4 animate-[wiggle_2.5s_ease-in-out_infinite]">
        <span className="text-2xl">🐾</span>
        <span className="text-2xl">🐾</span>
      </div>

      {/* Extra CSS animation */}
      <style>
        {`
          @keyframes wiggle {
            0%, 100% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
          }
        `}
      </style>
    </div>
  );
};

export default NotFoundPage;
