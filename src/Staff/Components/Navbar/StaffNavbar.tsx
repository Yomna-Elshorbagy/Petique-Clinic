import { Bell, User } from "lucide-react";

export default function StaffNavbar() {
  return (
    <div className="w-full bg-white/80 backdrop-blur-xl px-10 py-5 flex items-center justify-between shadow-sm sticky top-0 z-[60] border-b border-[#A98868]/10">
      {/* Left Section: Context */}
      <div>
        <h2 className="text-[#4f3f36] text-2xl font-black tracking-tighter leading-none">
          Staff Hub
        </h2>
        <p className="text-[#A98770] text-[10px] uppercase tracking-[0.3em] font-bold mt-2">
          Workspace <span className="text-[#e9a66f] mx-1">•</span> Operations
        </p>
      </div>

      {/* Right Section: Core Actions */}
      <div className="flex items-center gap-8">
        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-2xl bg-[#faf7f2] border border-[#A98868]/10 text-[#7a7067] hover:text-[#e9a66f] hover:bg-[#A98868]/5 transition-all duration-300 group relative">
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#e9a66f] rounded-full ring-2 ring-white"></span>
          </button>
        </div>

        {/* Professional Profile Section */}
        <div className="flex items-center gap-4 pl-8 border-l border-[#A98868]/10 group cursor-pointer">
          <div className="flex flex-col items-end">
            <span className="text-[#4f3f36] text-sm font-black tracking-tight leading-none group-hover:text-[#e9a66f] transition-colors">
              Staff Member
            </span>
            <span className="text-[#A98770] text-[9px] font-bold uppercase tracking-widest mt-1">
              Clinic Portal
            </span>
          </div>
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#faf7f2] to-[#ece7e2] flex items-center justify-center border border-[#A98868]/10 shadow-sm group-hover:border-[#e9a66f]/30 transition-all duration-500 overflow-hidden">
              <User size={20} className="text-[#A98770]" />
            </div>
            {/* Status Dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-[3px] border-white shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
