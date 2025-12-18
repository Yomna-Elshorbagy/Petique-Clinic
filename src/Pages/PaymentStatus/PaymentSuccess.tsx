import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../../Components/SEO/SEO";
import { useAppDispatch } from "../../Store/store";
import { getOrderById } from "../../Store/Slices/OrderSlice";
import { clearCart } from "../../Store/Slices/CartSlice";
import { verifyPayment } from "../../Apis/OrderApi";


const PaymentSuccess: React.FC = () => {

  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');
  const dispatch = useAppDispatch();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId)
        .then((data) => {
          if (data.success) {
            setOrder(data.data);
            dispatch(clearCart());
          } else {
            console.error("Payment verification failed:", data.message);
          }
        })
        .catch((err) => console.error("Error verifying payment:", err));
    } else if (orderId) {
      dispatch(getOrderById(orderId))
        .unwrap()
        .then((data) => setOrder(data))
        .catch((err) => console.error("Failed to fetch order:", err));
    }
  }, [dispatch, orderId, sessionId]);


  return (
    <div className="min-h-screen bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] flex items-center justify-center p-4 transition-colors duration-300">
      <SEO
        title="Payment Successful | Petique Clinic"
        description="Your payment was successful! Thank you for your purchase at Petique Clinic."
      />

      <div className="relative bg-white dark:bg-[var(--color-dark-card)] rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center animate-slideUp overflow-hidden">
        {/* Decorative paw prints background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <svg
              key={i}
              className="absolute text-[#C58D52] w-8 h-8"
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

        {/* Animated confetti */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#C58D52', '#A98770', '#e9a66f', '#f9be91', '#86654F'][i % 5],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Happy Cat Illustration */}
        <div className="relative z-10 mb-6">
          <div className="w-32 h-32 mx-auto relative animate-bounce-slow">
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
              
              {/* Eyes - Happy */}
              <path d="M 45 42 Q 50 38 55 42" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 65 42 Q 70 38 75 42" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
              
              {/* Big Happy Smile */}
              <path d="M 40 52 Q 60 75 80 52" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 45 52 Q 60 70 75 52" fill="white" />
              
              {/* Teeth */}
              <path d="M 48 52 L 48 58 L 52 52 M 56 52 L 56 60 L 60 52 M 64 52 L 64 60 L 68 52 M 72 52 L 72 58 L 75 52" 
                    stroke="white" strokeWidth="1.5" fill="none" />
              
              {/* Blush */}
              <circle cx="38" cy="50" r="5" fill="#f9be91" opacity="0.6" />
              <circle cx="82" cy="50" r="5" fill="#f9be91" opacity="0.6" />
              
              {/* Whiskers */}
              <line x1="20" y1="48" x2="38" y2="50" stroke="#86654F" strokeWidth="1" />
              <line x1="18" y1="54" x2="38" y2="54" stroke="#86654F" strokeWidth="1" />
              <line x1="82" y1="50" x2="100" y2="48" stroke="#86654F" strokeWidth="1" />
              <line x1="82" y1="54" x2="102" y2="54" stroke="#86654F" strokeWidth="1" />
              
              {/* Tail - Wagging */}
              <path d="M 95 80 Q 115 60 105 90" stroke="#4f3f36" strokeWidth="8" fill="none" strokeLinecap="round" className="animate-wag" />
              
              {/* Paws */}
              <ellipse cx="40" cy="100" rx="12" ry="8" fill="#4f3f36" />
              <ellipse cx="80" cy="100" rx="12" ry="8" fill="#4f3f36" />
              
              {/* Paw details */}
              <circle cx="35" cy="98" r="2" fill="#86654F" />
              <circle cx="40" cy="96" r="2" fill="#86654F" />
              <circle cx="45" cy="98" r="2" fill="#86654F" />
              <circle cx="75" cy="98" r="2" fill="#86654F" />
              <circle cx="80" cy="96" r="2" fill="#86654F" />
              <circle cx="85" cy="98" r="2" fill="#86654F" />
              
              {/* Success checkmark badge */}
              <circle cx="90" cy="25" r="12" fill="#4ade80" />
              <path d="M 84 25 L 88 29 L 96 21" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#4f3f36] dark:text-[#e8d8c4] mb-3">
            Order is accepted!
          </h1>
          <p className="text-[#7a7067] dark:text-[#c6bcb3] mb-8 leading-relaxed">
            We sent a payment receipt<br />
            and order confirmation letter to your Email.
          </p>

          {/* Order Number */}
          <div className="bg-[#f9ebe0] dark:bg-[#3a342f] rounded-xl p-4 mb-6 border border-[#e8d8c4] dark:border-[#5a4d44]">
            <p className="text-sm text-[#7a7067] dark:text-[#c6bcb3]">Order Number</p>
            <p className="text-lg font-semibold text-[#C58D52]">#{orderId || order?._id}</p>
          </div>

          {/* Action Button */}
          <Link
            to="/products"
            className="inline-block w-full py-4 px-8 bg-gradient-to-r from-[#e9a66f] to-[#C58D52] hover:from-[#C58D52] hover:to-[#b67e46] text-white font-semibold rounded-2xl shadow-lg shadow-[#C58D52]/20 hover:shadow-xl hover:shadow-[#C58D52]/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue shopping
          </Link>

          {/* Secondary action */}
          <Link
            to="/OrderDetails"
            state={{ order: order }}
            className="inline-block mt-4 text-[#A98770] hover:text-[#86654F] dark:text-[#c9b499] dark:hover:text-[#e8d8c4] transition-colors duration-200 underline-offset-2 hover:underline"
          >
            View Order Details
          </Link>
        </div>

        {/* Sparkle decorations */}
        <svg className="absolute top-4 right-4 w-6 h-6 text-[#e9a66f] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,0 14,10 24,12 14,14 12,24 10,14 0,12 10,10" />
        </svg>
        <svg className="absolute top-12 left-6 w-4 h-4 text-[#C58D52] animate-pulse" style={{ animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,0 14,10 24,12 14,14 12,24 10,14 0,12 10,10" />
        </svg>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        @keyframes wag {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        .animate-wag {
          animation: wag 0.5s ease-in-out infinite;
          transform-origin: 95px 80px;
        }
        
        @keyframes confetti {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
