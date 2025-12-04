import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPaw, FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/images/logo.jpg";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50"
    >
      {/* Glassmorphism Container */}
      <div className="relative bg-[var(--color-light-background)]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-[var(--color-light-secondary)]/20 px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer select-none"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src={logo}
              alt="Petique Clinic Logo"
              className="h-12 w-12 object-contain drop-shadow-lg rounded-full border-2 border-[var(--color-light-accent)]/30"
            />
            <span className="text-2xl font-extrabold text-[var(--color-light-dark)] tracking-wide">
              Petique
            </span>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="relative text-[var(--color-light-dark)] font-semibold text-lg hover:text-[var(--color-light-accent)] transition-colors duration-300 group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
              >
                {link.label}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[var(--color-light-accent)] group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <motion.a
            href="#book"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="hidden md:flex items-center gap-2 bg-[var(--color-light-accent)] hover:bg-[#d69560] text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-orange-500/30 transition-all"
          >
            Book Now <FaPaw />
          </motion.a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[var(--color-light-dark)] text-2xl focus:outline-none hover:text-[var(--color-light-accent)] transition-colors"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden mt-4 pt-4 border-t border-[var(--color-light-secondary)]/20 overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[var(--color-light-dark)] font-semibold text-lg hover:text-[var(--color-light-accent)] transition-colors duration-300 py-2"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#book"
                className="bg-[var(--color-light-accent)] hover:bg-[#d69560] text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 mt-2"
                onClick={() => setOpen(false)}
              >
                Book Now <FaPaw />
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
