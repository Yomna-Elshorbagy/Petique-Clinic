import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../Components/SEO/SEO";

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  const handleReturnToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] flex items-center justify-center p-4 transition-colors duration-300">
      <SEO
        title="Payment Cancelled | Petique Clinic"
        description="You have cancelled the payment process. No charges were made."
      />

      <div className="relative bg-white dark:bg-[var(--color-dark-card)] rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center animate-slideUp overflow-hidden">
        {/* Decorative paw prints background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <svg
              key={i}
              className="absolute text-[#F59E0B] w-8 h-8"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="7" cy="8" r="2.5" />
              <circle cx="17" cy="8" r="2.5" />
              <circle cx="4" cy="14" r="2" />
              <circle cx="20" cy="14" r="2" />
              <ellipse cx="12" cy="17" rx="5" ry="4" />
            </svg>
          ))}
        </div>

        {/* Confused/Neutral Cat Illustration */}
        <div className="relative z-10 mb-6">
          <div className="w-32 h-32 mx-auto relative animate-pulse-slow">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              {/* Cat Body */}
              <ellipse cx="60" cy="75" rx="35" ry="30" fill="#4f3f36" />
              
              {/* Cat Head */}
              <circle cx="60" cy="45" r="28" fill="#4f3f36" />
              
              {/* Left Ear */}
              <polygon points="35,25 42,45 28,40" fill="#4f3f36" />
              <polygon points="37,28 40,40 32,37" fill="#f9be91" />
              
              {/* Right Ear */}
              <polygon points="85,25 78,45 92,40" fill="#4f3f36" />
              <polygon points="83,28 80,40 88,37" fill="#f9be91" />
              
              {/* Eyes - Wide/Confused */}
              <circle cx="48" cy="42" r="5" fill="white" />
              <circle cx="72" cy="42" r="5" fill="white" />
              <circle cx="48" cy="42" r="2" fill="#4f3f36" />
              <circle cx="72" cy="42" r="2" fill="#4f3f36" />
              
              {/* Eyebrows - Raised/Questioning */}
              <path d="M 42 35 Q 48 30 54 35" stroke="#86654F" strokeWidth="1.5" fill="none" />
              <path d="M 66 35 Q 72 30 78 35" stroke="#86654F" strokeWidth="1.5" fill="none" />
              
              {/* Nose */}
              <ellipse cx="60" cy="50" rx="3" ry="2" fill="#f9be91" />
              
              {/* Straight Mouth */}
              <path d="M 55 58 L 65 58" stroke="#86654F" strokeWidth="2" strokeLinecap="round" />
              
              {/* Whiskers */}
              <line x1="20" y1="48" x2="38" y2="50" stroke="#86654F" strokeWidth="1" />
              <line x1="18" y1="54" x2="38" y2="54" stroke="#86654F" strokeWidth="1" />
              <line x1="82" y1="50" x2="100" y2="48" stroke="#86654F" strokeWidth="1" />
              <line x1="82" y1="54" x2="102" y2="54" stroke="#86654F" strokeWidth="1" />
              
              {/* Tail - Question Mark shape? */}
              <path d="M 95 80 Q 110 60 100 50 Q 90 45 95 40" stroke="#4f3f36" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
              
              {/* Paws */}
              <ellipse cx="40" cy="100" rx="12" ry="8" fill="#4f3f36" />
              <ellipse cx="80" cy="100" rx="12" ry="8" fill="#4f3f36" />
              
              {/* Question Mark Badge */}
              <circle cx="90" cy="25" r="12" fill="#F59E0B" />
              <text x="90" y="30" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">?</text>
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#4f3f36] dark:text-[#e8d8c4] mb-3">
            Payment Cancelled
          </h1>
          <p className="text-[#7a7067] dark:text-[#c6bcb3] mb-8 leading-relaxed">
            You have cancelled the payment process.<br />
            No charges were made to your account.
          </p>

          {/* Info Box */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-6 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Order was not placed</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleReturnToCart}
            className="inline-block w-full py-4 px-8 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white font-semibold rounded-2xl shadow-lg shadow-[#F59E0B]/20 hover:shadow-xl hover:shadow-[#F59E0B]/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Return to Cart
          </button>

          {/* Secondary actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
            <Link
              to="/products"
              className="text-[#A98770] hover:text-[#86654F] dark:text-[#c9b499] dark:hover:text-[#e8d8c4] transition-colors duration-200 underline-offset-2 hover:underline text-sm"
            >
              Continue Shopping
            </Link>
            <span className="hidden sm:block text-[#d1c4b5] dark:text-[#5a4d44]">|</span>
            <Link
              to="/contact"
              className="text-[#A98770] hover:text-[#86654F] dark:text-[#c9b499] dark:hover:text-[#e8d8c4] transition-colors duration-200 underline-offset-2 hover:underline text-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentCancel;
