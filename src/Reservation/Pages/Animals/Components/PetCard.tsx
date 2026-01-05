import {
  FaPaw,
  FaWeight,
  FaBirthdayCake,
  FaUser,
  FaTrash,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";
import type { IPet } from "../../../../Interfaces/Ipet";

type Props = {
  pet: IPet;
  view?: "grid" | "list";
  onSoftDelete?: (id: string) => void;
  onHardDelete?: (id: string) => void;
  onViewDetails?: (pet: IPet) => void;
  onEdit?: (pet: IPet) => void;
};

export default function PetCard({
  pet,
  onSoftDelete,
  onHardDelete,
  onViewDetails,
  onEdit,
}: Props) {
  return (
    <div className="bg-[#FCF9F4] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[#ECE7E2]">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#ECE7E2] flex items-center justify-center text-[#A98770] text-2xl overflow-hidden">
          {pet.image?.secure_url ? (
            <img
              src={pet.image.secure_url}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaPaw />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-[#86654F]">{pet.name}</h3>
          </div>
          <p className="text-[#A98770] text-sm flex items-center gap-1">
            <FaWeight size={12} /> {pet.weight} kg
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
              title="Soft Delete"
              onClick={() => pet._id && onSoftDelete?.(pet._id)}
            >
              <FaTrashAlt size={14} />
            </button>

            <button
              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              title="Hard Delete"
              onClick={() => pet._id && onHardDelete?.(pet._id)}
            >
              <FaTrash size={14} />
            </button>
          </div>

          {/* ID under delete icons */}
          <span className="text-[10px] font-mono text-[#A98770] bg-[#F7F3EF] px-1.5 py-0.5 rounded-md border border-[#E9DFD5]">
            #{pet._id?.slice(-6).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-[#A98770] flex items-center gap-2">
            <FaBirthdayCake size={14} /> Age
          </span>
          <span className="text-[#86654F] font-medium">{pet.age} years</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[#A98770] flex items-center gap-2">
            <FaUser size={14} /> Owner
          </span>
          <span
            className="text-[#86654F] font-medium truncate max-w-[100px]"
            title={pet.petOwner?.userName}
          >
            {pet.petOwner?.userName || "Unknown"}
          </span>
        </div>
      </div>

      {/* View + Edit buttons */}
      <div className="flex gap-2">
        <button
          className="w-full py-3 bg-[#ECE7E2] text-[#86654F] rounded-xl font-medium hover:bg-[#e3dbd3] transition-colors"
          onClick={() => onViewDetails?.(pet)}
        >
          View Details
        </button>

        <button
          className="w-full py-3 bg-[#ECE7E2] text-[#86654F] rounded-xl font-medium hover:bg-[#e3dbd3] transition-colors"
          onClick={() => onEdit?.(pet)}
        >
          <FaEdit className="inline mr-1" />
          Edit
        </button>
      </div>
    </div>
  );
}
