import { Calendar, Users, Syringe } from "lucide-react";

const QuickActionsPanel = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-[#4A3F35] w-full">
        Quick Actions
      </h2>

      <div className="flex flex-col gap-4">
        <button
          className="
            w-full bg-[#B38A72] text-white py-4 px-6 rounded-2xl
            flex items-center gap-3 shadow-sm hover:bg-[#A27964] transition-all
          "
        >
          <Calendar size={20} />
          <span className="text-[16px] font-medium">New Appointment</span>
        </button>

        <button
          className="
            w-full bg-[#D7A086] text-white py-4 px-6 rounded-2xl
            flex items-center gap-3 shadow-sm hover:bg-[#C89279] transition-all
          "
        >
          <Users size={20} />
          <span className="text-[16px] font-medium">Register Pet</span>
        </button>

        <button
          className="
            w-full bg-[#F3EDE6] text-[#4A3F35] py-4 px-6 rounded-2xl
            flex items-center gap-3 shadow-sm hover:bg-[#E9DFD6] transition-all
            border border-[#E2D7CE]
          "
        >
          <Syringe size={20} />
          <span className="text-[16px] font-medium">Schedule Vaccination</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsPanel;
