// Components/QuickActionsPanel.tsx
import { Calendar, Users, Syringe } from "lucide-react";

interface QuickActionsPanelProps {
  onRegisterPet: () => void;
  onScheduleVaccination: () => void;
}

const QuickActionsPanel = ({
  onRegisterPet,
  onScheduleVaccination,
}: QuickActionsPanelProps) => {
  return (
    <div className="w-full flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-[#4A3F35]">
        Quick Actions
      </h2>

      <div className="flex flex-col gap-4">
        <button className="w-full bg-[#B38A72] text-white py-4 px-6 rounded-2xl flex items-center gap-3 shadow-sm hover:bg-[#A27964] transition-all">
          <Calendar size={20} />
          <span>New Appointment</span>
        </button>

        <button
          onClick={onRegisterPet}
          className="w-full bg-[#D7A086] text-white py-4 px-6 rounded-2xl flex items-center gap-3 shadow-sm hover:bg-[#C89279] transition-all"
        >
          <Users size={20} />
          <span>Register Pet</span>
        </button>

        <button
          onClick={onScheduleVaccination}
          className="w-full bg-[#F3EDE6] text-[#4A3F35] py-4 px-6 rounded-2xl flex items-center gap-3 shadow-sm hover:bg-[#E9DFD6] transition-all border border-[#E2D7CE]"
        >
          <Syringe size={20} />
          <span>Schedule Vaccination</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsPanel;
