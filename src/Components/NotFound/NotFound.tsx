import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--color-bg-light), var(--color-bg-warm))",
      }}
    >
      {/* Soft background bubbles */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl animate-pulse -top-24 -left-24"
        style={{ backgroundColor: "var(--color-extra-1)" }}
      />
      <div
        className="absolute w-72 h-72 rounded-full opacity-30 blur-3xl animate-bounce -bottom-32 -right-20"
        style={{ backgroundColor: "var(--color-extra-5)" }}
      />

      {/* Main content */}
      <div className="z-10 text-center px-6 animate-soft">
        {/* Dog */}
        <div className="relative inline-block mb-10">
          <div
            className="relative w-44 h-44 rounded-full shadow-xl animate-bounceSlow"
            style={{ backgroundColor: "var(--color-bg-lighter)" }}
          >
            {/* ===>ears */}
            <div
              className="absolute w-16 h-20 rounded-full -top-4 -left-6 rotate-12"
              style={{ backgroundColor: "var(--color-bg-lighter)" }}
            />
            <div
              className="absolute w-16 h-20 rounded-full -top-4 -right-6 -rotate-12"
              style={{ backgroundColor: "var(--color-bg-lighter)" }}
            />

            {/* ===> eyes */}
            <div className="absolute w-6 h-6 bg-black rounded-full top-16 left-14">
              <span className="absolute w-2 h-2 bg-white rounded-full top-1 left-1" />
            </div>
            <div className="absolute w-6 h-6 bg-black rounded-full top-16 right-14">
              <span className="absolute w-2 h-2 bg-white rounded-full top-1 left-1" />
            </div>

            {/* ===> blush */}
            <div
              className="absolute w-6 h-4 rounded-full top-22 left-8 opacity-60"
              style={{ backgroundColor: "var(--color-accent-light)" }}
            />
            <div
              className="absolute w-6 h-4 rounded-full top-22 right-8 opacity-60"
              style={{ backgroundColor: "var(--color-accent-light)" }}
            />

            {/* ===> nose */}
            <div className="absolute w-6 h-4 bg-black rounded-full top-24 left-1/2 -translate-x-1/2" />

            {/* ===> smile */}
            <div className="absolute w-16 h-8 border-b-4 border-black rounded-b-full top-26 left-1/2 -translate-x-1/2" />

            {/* ===> tongue */}
            <div
              className="absolute w-6 h-4 rounded-b-full top-30 left-1/2 -translate-x-1/2"
              style={{ backgroundColor: "var(--color-extra-1)" }}
            />
          </div>

          {/* ===> tail */}
          <div
            className="absolute right-[-18px] top-24 w-10 h-6 rounded-full origin-left animate-wag"
            style={{ backgroundColor: "var(--color-bg-lighter)" }}
          />

          {/* ===> Paw prints */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3 animate-float opacity-60">
            <span className="text-3xl">🐾</span>
            <span className="text-3xl">🐾</span>
            <span className="text-3xl">🐾</span>
          </div>
        </div>

        {/* ===> text */}
        <h1
          className="text-7xl font-extrabold mb-4 tracking-tight"
          style={{ color: "var(--color-light-accent)" }}
        >
          404
        </h1>

        <p
          className="text-lg mb-3"
          style={{ color: "var(--color-text-primary)" }}
        >
          This page isn’t available right now.
        </p>

        <p
          className="text-sm mb-8 max-w-md mx-auto"
          style={{ color: "var(--color-text-muted)" }}
        >
          Our pets are safe and cared for 🐕🐈  
          — the page you’re looking for may have moved or no longer exists.
        </p>

        {/* ===> actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 rounded-full font-semibold shadow-md transition hover:scale-105"
            style={{
              backgroundColor: "var(--color-light-accent)",
              color: "white",
            }}
          >
            🐾 Back to Home
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="px-6 py-3 rounded-full font-semibold transition border"
            style={{
              borderColor: "var(--color-border-dark)",
              color: "var(--color-text-primary)",
            }}
          >
            📩 Support & Care
          </button>
        </div>

        {/* ===> footer */}
        <div
          className="mt-10 text-xs tracking-wide"
          style={{ color: "var(--color-text-light)" }}
        >
          Trusted care • Warm service • Happy pets 🐾
        </div>
      </div>

      {/* ===> animations */}
      <style>
        {`
          @keyframes wag {
            0%, 100% { transform: rotate(20deg); }
            50% { transform: rotate(-20deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes bounceSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-wag { animation: wag 0.6s ease-in-out infinite; }
          .animate-float { animation: float 2s ease-in-out infinite; }
          .animate-bounceSlow { animation: bounceSlow 2.5s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
};

export default NotFoundPage;
