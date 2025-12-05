import { Facebook, Twitter, Instagram, Send } from "lucide-react";
import DogImg from "../../assets/images/dogimg.png";
import CatImg from "../../assets/images/catimg.png";

export default function Footer() {
  return (
    <footer className="bg-[#3c2f2f] text-white pt-20 pb-6 relative overflow-hidden">
      {/* === CAT LEFT - positioned on the divider line === */}
      <img
        src={CatImg}
        alt="cat"
        className="hidden lg:block w-20 xl:w-24 select-none absolute left-0 z-20"
        style={{ bottom: '80px' }}
      />

      {/* === DOG RIGHT - positioned on the divider line === */}
      <img
        src={DogImg}
        alt="dog"
        className="hidden lg:block w-24 xl:w-32 select-none absolute right-0 z-20"
        style={{ bottom: '95px' }}
      />

      {/* === MAIN GRID === */}
      <div className="container mx-auto px-4 relative z-10 lg:px-16 xl:px-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {/* COLUMN 1 — LOGO */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐾</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-wide text-orange-400">Petique</h2>
                <p className="text-xs opacity-75">Trusted Pet Care</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed opacity-90 mb-6 max-w-[260px]">
              We're here to care for your pets and answer all your questions!
              Whether you're a new pet parent or want to schedule an appointment.
            </p>

            <div className="flex items-center bg-white/5 rounded-full overflow-hidden border border-white/10 hover:border-orange-400/50 transition-all duration-300 w-full max-w-[260px]">
              <input
                type="email"
                placeholder="Email Address"
                className="px-5 py-3 bg-transparent text-sm flex-1 focus:outline-none focus:ring-0 text-white/60 border-0"
              />
              <button className="w-12 h-12 rounded-full bg-orange-400 hover:bg-orange-500 transition-all duration-300 hover:scale-110 group flex items-center justify-center">
                <Send className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* COLUMN 2 — SERVICES */}
          <div>
            <h3 className="text-lg font-bold mb-5 border-b-2 border-orange-400 pb-2 inline-block">Our Service</h3>
            <ul className="space-y-3 text-sm">
              {[
                "Skin and Ear Cytology",
                "Ultrasound Scan Services",
                "Dental Care and Cleanings",
                "Nutritional Counseling",
                "Puppy Wellness Program",
                "Pets Surgical Services",
              ].map((service, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 opacity-90 hover:opacity-100 hover:translate-x-1 transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-orange-400 mt-0.5 group-hover:scale-125 transition-transform">•</span>
                  <span className="group-hover:text-orange-400 transition-colors">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3 — QUICK LINKS */}
          <div>
            <h3 className="text-lg font-bold mb-5 border-b-2 border-orange-400 pb-2 inline-block">Quicklinks</h3>
            <ul className="space-y-3 text-sm">
              {["About Us", "FAQ", "Our Services", "Team", "Portfolio", "Blog"].map((link, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 opacity-90 hover:opacity-100 hover:translate-x-1 transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-orange-400 mt-0.5 group-hover:scale-125 transition-transform">•</span>
                  <span className="group-hover:text-orange-400 transition-colors">{link}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4 — OPENING HOURS */}
          <div>
            <h3 className="text-lg font-bold mb-5 border-b-2 border-orange-400 pb-2 inline-block">Opening Hour</h3>
            <div className="space-y-3 text-sm">
              {[
                { day: "Mon - Tues", time: "09:00AM - 06:00PM" },
                { day: "Wed - Thu", time: "09:00AM - 06:00PM" },
                { day: "Fri - Sat", time: "09:00AM - 06:00PM" },
                { day: "Sunday", time: "Emergency Only" },
              ].map((sch, i) => (
                <div
                  key={i}
                  className="flex justify-between pb-3 border-b border-white/10 opacity-90 hover:opacity-100 hover:border-orange-400/30 transition-all duration-300"
                >
                  <span className="font-medium">{sch.day}</span>
                  <span className="text-orange-300">{sch.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === FOOTER BOTTOM === */}
      <div className="border-t border-white/10 mt-12 pt-6 relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm opacity-75 text-center md:text-left">
              © Copyright 2024. All rights reserved. <span className="text-orange-400 font-semibold">Petique</span>.
              Designed by Zozothemes
            </p>

            <div className="flex gap-3">
              {[{ icon: Facebook }, { icon: Twitter }, { icon: Instagram }, { icon: Send }].map((item, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-full bg-orange-400 hover:bg-orange-500 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-400/50"
                >
                  <item.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
