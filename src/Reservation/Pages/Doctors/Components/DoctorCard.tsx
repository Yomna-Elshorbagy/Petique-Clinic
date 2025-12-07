import { FaEnvelope, FaPhone, FaTrash, FaArchive } from "react-icons/fa";
import type { IUser } from "../../../../Interfaces/IUser";

interface DoctorCardProps {
  doctor: IUser;
  view: "grid" | "list";
  onSoftDelete: (id: string) => void;
  onHardDelete: (id: string) => void;
  onViewDetails?: (doctor: IUser) => void;
}

export default function DoctorCard({
  doctor,
  view,
  onSoftDelete,
  onHardDelete,
  onViewDetails,
}: DoctorCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  // ===> list view
  if (view === "list") {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-all border border-[#ECE7E2]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#86654F] flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0">
            {doctor.image?.secure_url ? (
              <img
                src={doctor.image.secure_url}
                alt={doctor.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(doctor.userName)
            )}
          </div>
          <div>
            <h3 className="font-bold text-[#86654F] text-lg">
              Dr. {doctor.userName}
            </h3>
            <div className="flex gap-4 text-sm text-[#A98770] mt-1">
              <span className="flex items-center gap-1">
                <FaEnvelope size={12} /> {doctor.email}
              </span>
              <span className="flex items-center gap-1">
                <FaPhone size={12} /> {doctor.mobileNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-2 mr-4">
            <button
              onClick={() => onSoftDelete(doctor._id)}
              className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
              title="Archive Doctor"
            >
              <FaArchive size={16} />
            </button>
            <button
              onClick={() => onHardDelete(doctor._id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Permanently"
            >
              <FaTrash size={16} />
            </button>
          </div>

          <button
            onClick={() => onViewDetails && onViewDetails(doctor)}
            className="px-4 py-2 bg-[#FCF9F4] text-[#86654F] font-medium rounded-lg hover:bg-[#ECE7E2] transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    );
  }

  //===> grid view
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-[#ECE7E2] relative group">
      {/* ===> actions top right */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onSoftDelete(doctor._id)}
          className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors bg-white shadow-sm"
          title="Archive Doctor"
        >
          <FaArchive size={14} />
        </button>
        <button
          onClick={() => onHardDelete(doctor._id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors bg-white shadow-sm"
          title="Delete Permanently"
        >
          <FaTrash size={14} />
        </button>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-[#A98770] flex items-center justify-center text-white font-bold text-2xl mb-4 overflow-hidden border-4 border-[#FCF9F4] shadow-sm">
          {doctor.image?.secure_url ? (
            <img
              src={doctor.image.secure_url}
              alt={doctor.userName}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(doctor.userName)
          )}
        </div>

        <h3 className="font-bold text-[#86654F] text-xl mb-1">
          Dr. {doctor.userName}
        </h3>
        <span className="text-sm text-[#E5A46C] font-medium mb-3">
          {doctor.doctorSpecialist}
        </span>

        {/* placeholder for rating */}
        <div className="flex items-center gap-1 text-sm text-[#86654F] mb-6">
          <span>⭐ 4.9</span>
          <span className="text-[#A98770]">• 100+ patients</span>
        </div>

        <div className="w-full space-y-2 text-sm text-[#A98770] mb-6 text-left px-2">
          <div className="flex items-center gap-3">
            <FaEnvelope className="shrink-0" />
            <span className="truncate">{doctor.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="shrink-0" />
            <span>{doctor.mobileNumber}</span>
          </div>
        </div>

        <button
          onClick={() => onViewDetails && onViewDetails(doctor)}
          className="w-full py-2.5 bg-[#FCF9F4] text-[#86654F] font-bold rounded-xl hover:bg-[#ECE7E2] transition-colors border border-[#ECE7E2]"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
