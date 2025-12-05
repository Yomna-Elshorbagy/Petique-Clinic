import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPaw,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaMoon,
  FaSun,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import logo from "../../assets/images/logo.jpg";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Products", href: "/products" },
    { label: "Services", href: "#services" },
    { label: "Reservation", href: "/resDashboard/reservations" },
    { label: "Contact Us", href: "/contact" },
  ];

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full z-50 bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] shadow-md"
    >
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 py-4">
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
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="relative text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] font-semibold text-base hover:text-[var(--color-light-accent)] dark:hover:text-[var(--color-dark-accent)] transition-colors duration-300 group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * index + 0.2, duration: 0.45 }}
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[var(--color-light-accent)] group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              aria-label="Toggle theme"
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-full bg-white/80 dark:bg-black/30 border border-[var(--color-light-secondary)]/30 shadow-sm hover:-translate-y-0.5 transition-all"
            >
              {isDark ? (
                <FaSun className="text-[var(--color-dark-accent)]" />
              ) : (
                <FaMoon className="text-[var(--color-light-dark)]" />
              )}
            </button>

            <a
              href="/cart"
              className="p-3 rounded-full bg-white/80 dark:bg-black/30 border border-[var(--color-light-secondary)]/30 shadow-sm hover:-translate-y-0.5 transition-all text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]"
              aria-label="Cart"
            >
              <FaShoppingCart />
            </a>

            <div className="relative">
              <button
                onClick={() => setShowProfile((p) => !p)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-light-accent)] text-white font-semibold shadow-lg shadow-orange-500/30 hover:bg-[#d69560] transition-all"
              >
                <FaUserCircle />
                <FaChevronDown
                  className={`transition-transform ${
                    showProfile ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white dark:bg-[var(--color-dark-card)] border border-[var(--color-light-secondary)]/20 shadow-2xl p-3 space-y-2 z-20">
                  {[
                    { label: "Profile", href: "/profile" },
                    { label: "Login", href: "/login" },
                    { label: "Register", href: "/register" },
                    { label: "Logout", href: "/logout" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] hover:bg-[var(--color-light-background)] dark:hover:bg-black/30 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

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
                  className="text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] font-semibold text-lg hover:text-[var(--color-light-accent)] dark:hover:text-[var(--color-dark-accent)] transition-colors duration-300 py-2"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}

              <div className="flex items-center gap-3">
                <button
                  aria-label="Toggle theme"
                  onClick={() => setIsDark(!isDark)}
                  className="p-3 rounded-full bg-white/80 dark:bg-black/40 border border-[var(--color-light-secondary)]/30 shadow-sm"
                >
                  {isDark ? <FaSun /> : <FaMoon />}
                </button>
                <a
                  href="/cart"
                  className="p-3 rounded-full bg-white/80 dark:bg-black/40 border border-[var(--color-light-secondary)]/30 shadow-sm"
                  onClick={() => setOpen(false)}
                >
                  <FaShoppingCart />
                </a>
              </div>

              <div className="bg-white dark:bg-[var(--color-dark-card)] border border-[var(--color-light-secondary)]/20 rounded-2xl p-3 space-y-2">
                {[
                  { label: "Profile", href: "/profile" },
                  { label: "Login", href: "/login" },
                  { label: "Register", href: "/register" },
                  { label: "Logout", href: "/logout" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] hover:bg-[var(--color-light-background)] dark:hover:bg-black/30 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
