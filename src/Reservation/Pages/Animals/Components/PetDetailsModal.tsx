import React from "react";
import { FaTimes, FaSyringe } from "react-icons/fa";
import { usePetById } from "../../../../Hooks/Pets/UsePets";

interface Props {
  petId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PetDetailsModal({ petId, isOpen, onClose }: Props) {
  const { data: petData } = usePetById(petId || "");

  if (!isOpen || !petId) return null;

  const pet = petData;
  const vaccinations = pet?.vaccinationHistory || [];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FCF9F4] w-full max-w-lg rounded-2xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-[#86654F]">Pet Details</h2>
          <button onClick={onClose}>
            <FaTimes size={22} className="text-[#A98770]" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <img
              src={pet?.image?.secure_url}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-[#86654F]">{pet?.name}</h3>
              <p className="text-[#A98770]">Age: {pet?.age}</p>
              <p className="text-[#A98770]">Weight: {pet?.weight} kg</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-[#86654F] mb-2">Allergies</h4>
            <p className="text-[#A98770]">
              {pet?.allergies?.join(", ") || "None"}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-[#86654F] mb-3">
              Vaccination History
            </h4>

            {vaccinations.length === 0 ? (
              <p className="text-[#A98770]">No vaccinations found.</p>
            ) : (
              <div className="space-y-3">
                {vaccinations.map((v: any, index: number) => (
                  <div key={index} className="p-3 bg-white rounded-xl border">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#86654F]">
                        {v.vaccine?.name || "Unknown Vaccine"}
                      </span>
                      <FaSyringe className="text-[#A98770]" />
                    </div>
                    <p className="text-sm text-[#A98770]">
                      Dose: {v.doseNumber}
                    </p>
                    <p className="text-sm text-[#A98770]">
                      Given: {new Date(v.date).toLocaleDateString()}
                    </p>
                    {v.nextDose && (
                      <p className="text-sm text-[#A98770]">
                        Next Dose: {new Date(v.nextDose).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
