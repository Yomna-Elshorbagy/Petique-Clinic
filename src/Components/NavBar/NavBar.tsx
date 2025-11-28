import { useState } from "react";
import logo from "../../assets/images/logo.jpg";
export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 select-none cursor-pointer">
          <img
            src={logo}
            alt="Pet Clinic Logo"
            className="h-10 w-10 object-contain drop-shadow-md rounded-full"
          />
          <span className="text-2xl font-bold text-gray-800 tracking-wide">
            Pet Clinic
          </span>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-3 rounded-lg hover:bg-gray-100 transition shadow-sm"
        >
          <svg
            className="w-7 h-7 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            {!open ? (
              <path d="M4 6h16M4 12h16M4 18h16" />
            ) : (
              <path d="M6 6l12 12M6 18L18 6" />
            )}
          </svg>
        </button>

        <div className="hidden md:block">
          <ul className="flex space-x-10 text-lg font-medium text-gray-700">
            {[
              { label: "Home", href: "#" },
              { label: "Services", href: "#services" },
              { label: "Appointments", href: "#appointments" },
              { label: "Our Vets", href: "#vets" },
              { label: "Contact", href: "#contact" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="relative inline-block py-2 group transition"
                >
                  <span className="text-gray-700 group-hover:text-[#588157] transition-colors">
                    {item.label}
                  </span>
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#588157] rounded-full transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:block">
          <a
            href="#book"
            className="px-6 py-2 rounded-xl text-white font-semibold shadow-lg transition bg-[#588157] hover:bg-[#476b48] active:scale-95"
          >
            Book Now
          </a>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col space-y-4 px-6 pb-6 text-lg font-medium text-gray-700">
          {[
            { label: "Home", href: "#" },
            { label: "Services", href: "#services" },
            { label: "Appointments", href: "#appointments" },
            { label: "Our Vets", href: "#vets" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="block py-2 text-gray-700 hover:text-[#588157] transition"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}

          <a
            href="#book"
            className="block w-full text-center px-6 py-3 rounded-xl text-white font-semibold shadow-md bg-[#588157] hover:bg-[#476b48] transition active:scale-95"
            onClick={() => setOpen(false)}
          >
            Book Now
          </a>
        </ul>
      </div>
    </nav>
  );
}
