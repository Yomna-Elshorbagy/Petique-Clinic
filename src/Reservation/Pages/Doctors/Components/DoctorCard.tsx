import { FaEnvelope, FaPhone, FaTrash, FaArchive } from "react-icons/fa";
import type { IUser } from "../../../../Interfaces/IUser";
import { useState } from "react";
import EditDoctorModal from "./EditDoctorModel";

interface DoctorCardProps {
  doctor: IUser;
  view: "grid" | "list";
  onSoftDelete: (id: string) => void;
  onHardDelete: (id: string) => void;
  onViewDetails?: (doctor: IUser) => void;
  onUpdate: () => void;
}

export default function DoctorCard({
  doctor,
  view,
  onSoftDelete,
  onHardDelete,
  // onViewDetails,
  onUpdate,
}: DoctorCardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<IUser | null>(null);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // ===> open modal
  const handleEdit = (doctor: IUser) => {
    setSelectedDoctor(doctor);
    setEditModalOpen(true);
  };
  // ===> list view

  return (
    <>
      {view === "list" ? (
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
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#86654F] text-lg">
                  Dr. {doctor.userName}
                </h3>
                <span className="text-[10px] font-mono text-[#A98770] bg-[#F7F3EF] px-1.5 py-0.5 rounded-md border border-[#E9DFD5]">
                  #{doctor._id?.slice(-6).toUpperCase()}
                </span>
              </div>

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
              onClick={() => handleEdit(doctor)}
              className="px-4 py-2 bg-[#FCF9F4] text-[#86654F] font-medium rounded-lg hover:bg-[#ECE7E2] transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        //===> grid view
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

            <div className="flex items-center gap-2 mb-1 justify-center">
              <h3 className="font-bold text-[#86654F] text-xl">
                Dr. {doctor.userName}
              </h3>
              <span className="text-[10px] font-mono text-[#A98770] bg-[#F7F3EF] px-1.5 py-0.5 rounded-md border border-[#E9DFD5]">
                #{doctor._id?.slice(-6).toUpperCase()}
              </span>
            </div>

            <span className="text-sm text-[#E5A46C] font-medium mb-3">
              {doctor.doctorSpecialist || "Specialist"}
            </span>

            {/* Contact */}
            <div className="w-full space-y-2 text-sm text-[#A98770] mb-6 text-left px-2">
              <div className="flex items-center gap-3">
                <FaEnvelope /> <span className="truncate">{doctor.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaPhone /> <span>{doctor.mobileNumber}</span>
              </div>
            </div>

            <button
              onClick={() => handleEdit(doctor)}
              className="w-full py-2.5 bg-[#FCF9F4] text-[#86654F] font-bold rounded-xl hover:bg-[#ECE7E2] transition-colors border border-[#ECE7E2]"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )
      }

      {/* EDIT MODAL */}
      {
        editModalOpen && selectedDoctor && (
          <EditDoctorModal
            isOpen={editModalOpen}
            doctor={selectedDoctor}
            onClose={() => setEditModalOpen(false)}
            onSuccess={() => {
              setEditModalOpen(false);
              onUpdate();
            }}
          />
        )
      }
    </>
  );
}
