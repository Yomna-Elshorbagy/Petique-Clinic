import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../Components/SEO/SEO";

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] flex items-center justify-center p-4 transition-colors duration-300">
      <SEO
        title="Payment Failed | Petique Clinic"
        description="Unfortunately your payment could not be processed. Please try again."
      />

      <div className="relative bg-white dark:bg-[var(--color-dark-card)] rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center animate-slideUp overflow-hidden">
        {/* Decorative paw prints background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <svg
              key={i}
              className="absolute text-[#86654F] w-8 h-8"
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

        {/* Sad Cat Illustration */}
        <div className="relative z-10 mb-6">
          <div className="w-32 h-32 mx-auto relative animate-sway">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              {/* Cat Body - slightly hunched */}
              <ellipse cx="60" cy="78" rx="32" ry="28" fill="#4f3f36" />
              
              {/* Cat Head - tilted slightly */}
              <circle cx="60" cy="45" r="28" fill="#4f3f36" />
              
              {/* Left Ear - droopy */}
              <polygon points="32,28 42,48 25,43" fill="#4f3f36" />
              <polygon points="34,32 40,44 29,40" fill="#f9be91" />
              
              {/* Right Ear - droopy */}
              <polygon points="88,28 78,48 95,43" fill="#4f3f36" />
              <polygon points="86,32 80,44 91,40" fill="#f9be91" />
              
              {/* Big Sad Eyes */}
              <ellipse cx="48" cy="40" rx="8" ry="10" fill="white" />
              <ellipse cx="72" cy="40" rx="8" ry="10" fill="white" />
              
              {/* Pupils - looking down */}
              <circle cx="48" cy="44" r="4" fill="#4f3f36" />
              <circle cx="72" cy="44" r="4" fill="#4f3f36" />
              
              {/* Eye highlights */}
              <circle cx="50" cy="42" r="1.5" fill="white" />
              <circle cx="74" cy="42" r="1.5" fill="white" />
              
              {/* Eyebrows - sad */}
              <line x1="40" y1="28" x2="55" y2="32" stroke="#86654F" strokeWidth="2" strokeLinecap="round" />
              <line x1="80" y1="28" x2="65" y2="32" stroke="#86654F" strokeWidth="2" strokeLinecap="round" />
              
              {/* Tear drops */}
              <ellipse cx="38" cy="52" rx="3" ry="5" fill="#87CEEB" className="animate-tear" />
              <ellipse cx="82" cy="54" rx="3" ry="5" fill="#87CEEB" className="animate-tear" style={{ animationDelay: '0.5s' }} />
              
              {/* Nose */}
              <ellipse cx="60" cy="52" rx="3" ry="2" fill="#f9be91" />
              
              {/* Sad mouth */}
              <path d="M 50 60 Q 60 55 70 60" stroke="#86654F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              
              {/* Whiskers - droopy */}
              <line x1="22" y1="50" x2="40" y2="54" stroke="#86654F" strokeWidth="1" />
              <line x1="20" y1="58" x2="40" y2="58" stroke="#86654F" strokeWidth="1" />
              <line x1="80" y1="54" x2="98" y2="50" stroke="#86654F" strokeWidth="1" />
              <line x1="80" y1="58" x2="100" y2="58" stroke="#86654F" strokeWidth="1" />
              
              {/* Tail - droopy */}
              <path d="M 92 85 Q 110 95 100 105" stroke="#4f3f36" strokeWidth="8" fill="none" strokeLinecap="round" />
              
              {/* Paws */}
              <ellipse cx="42" cy="102" rx="12" ry="8" fill="#4f3f36" />
              <ellipse cx="78" cy="102" rx="12" ry="8" fill="#4f3f36" />
              
              {/* Paw details */}
              <circle cx="37" cy="100" r="2" fill="#86654F" />
              <circle cx="42" cy="98" r="2" fill="#86654F" />
              <circle cx="47" cy="100" r="2" fill="#86654F" />
              <circle cx="73" cy="100" r="2" fill="#86654F" />
              <circle cx="78" cy="98" r="2" fill="#86654F" />
              <circle cx="83" cy="100" r="2" fill="#86654F" />
              
              {/* Error X badge */}
              <circle cx="90" cy="25" r="12" fill="#ef4444" />
              <path d="M 85 20 L 95 30 M 95 20 L 85 30" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#4f3f36] dark:text-[#e8d8c4] mb-3">
            Payment failed!
          </h1>
          <p className="text-[#7a7067] dark:text-[#c6bcb3] mb-8 leading-relaxed">
            Unfortunately something went wrong.<br />
            Please try again.
          </p>

          {/* Error Details Box */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6 border border-red-200 dark:border-red-800/50">
            <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium">Transaction could not be completed</span>
            </div>
          </div>

          {/* Troubleshooting Tips */}
          <div className="text-left bg-[#f9ebe0] dark:bg-[#3a342f] rounded-xl p-4 mb-6 border border-[#e8d8c4] dark:border-[#5a4d44]">
            <p className="text-sm font-semibold text-[#4f3f36] dark:text-[#e8d8c4] mb-2">Common issues:</p>
            <ul className="text-sm text-[#7a7067] dark:text-[#c6bcb3] space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C58D52] rounded-full"></span>
                Insufficient funds
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C58D52] rounded-full"></span>
                Card details entered incorrectly
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C58D52] rounded-full"></span>
                Connection timeout
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={handleTryAgain}
            className="inline-block w-full py-4 px-8 bg-gradient-to-r from-[#e9a66f] to-[#C58D52] hover:from-[#C58D52] hover:to-[#b67e46] text-white font-semibold rounded-2xl shadow-lg shadow-[#C58D52]/20 hover:shadow-xl hover:shadow-[#C58D52]/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Try again
          </button>

          {/* Secondary actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
            <Link
              to="/cart"
              className="text-[#A98770] hover:text-[#86654F] dark:text-[#c9b499] dark:hover:text-[#e8d8c4] transition-colors duration-200 underline-offset-2 hover:underline text-sm"
            >
              Back to Cart
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

        {/* Subtle cloud decorations */}
        <svg className="absolute top-6 left-6 w-16 h-8 text-[#e8d8c4] dark:text-[#5a4d44] opacity-30" viewBox="0 0 64 32" fill="currentColor">
          <ellipse cx="20" cy="20" rx="12" ry="10" />
          <ellipse cx="35" cy="18" rx="15" ry="12" />
          <ellipse cx="50" cy="20" rx="10" ry="8" />
        </svg>
        <svg className="absolute bottom-8 right-8 w-12 h-6 text-[#e8d8c4] dark:text-[#5a4d44] opacity-20" viewBox="0 0 64 32" fill="currentColor">
          <ellipse cx="20" cy="20" rx="12" ry="10" />
          <ellipse cx="35" cy="18" rx="15" ry="12" />
          <ellipse cx="50" cy="20" rx="10" ry="8" />
        </svg>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
        
        @keyframes tear {
          0%, 10% { opacity: 0; transform: translateY(-5px); }
          20% { opacity: 1; }
          80% { opacity: 1; transform: translateY(15px); }
          100% { opacity: 0; transform: translateY(20px); }
        }
        .animate-tear {
          animation: tear 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentFailed;
