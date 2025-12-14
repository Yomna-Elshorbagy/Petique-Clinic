import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaTimes, FaSpinner } from "react-icons/fa";
import {
  useVaccinatePet,
  useVaccinations,
} from "../../../../Hooks/Vaccinations/useVaccinations";
import type { IDose } from "../../../../Interfaces/IVacination";
import type { IPet } from "../../../../Interfaces/Ipet";

interface IVaccinatePetModalProps {
  pets: IPet[];
  isOpen: boolean;
  onClose: () => void;
}

export default function VaccinatePetModal({
  pets,
  isOpen,
  onClose,
}: IVaccinatePetModalProps) {
  const { data: vaccines } = useVaccinations();
  const vaccinateMutation = useVaccinatePet();

  const [selectedPet, setSelectedPet] = useState("");
  const [selectedVaccineId, setSelectedVaccineId] = useState("");
  const [selectedDoseNumber, setSelectedDoseNumber] = useState<number>(0);
  const [availableDoses, setAvailableDoses] = useState<IDose[]>([]);
  const [date, setDate] = useState("");

  // Update available doses when vaccine is selected
  useEffect(() => {
    if (selectedVaccineId && vaccines) {
      const v = vaccines.find((x) => x._id === selectedVaccineId);
      if (v?.doses?.length) {
        setAvailableDoses(v.doses);
        setSelectedDoseNumber(v.doses[0].doseNumber);
      } else {
        setAvailableDoses([]);
        setSelectedDoseNumber(0);
      }
    } else {
      setAvailableDoses([]);
      setSelectedDoseNumber(0);
    }
  }, [selectedVaccineId, vaccines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPet || !selectedVaccineId || !date || !selectedDoseNumber) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    // Ensure date is in YYYY-MM-DD format (backend expects this format)
    // HTML date input provides this format, but we validate it
    const dateValue = date.trim();

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      Swal.fire("Error", "Invalid date format", "error");
      return;
    }

    // Backend will handle status computation:
    // - Future date → "scheduled"
    // - Today or past → "completed"
    // - If nextDose is missed → "overdue"
    vaccinateMutation.mutate(
      {
        petId: selectedPet,
        vaccineId: selectedVaccineId,
        doseNumber: selectedDoseNumber,
        date: dateValue, // Send date in YYYY-MM-DD format
      },
      {
        onSuccess: () => {
          Swal.fire("Done", "Pet vaccinated successfully", "success");
          onClose();
          setSelectedPet("");
          setSelectedVaccineId("");
          setDate("");
          setSelectedDoseNumber(0);
        },
        onError: (err: any) => {
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to vaccinate";
          console.error("Vaccination error:", err);
          Swal.fire("Error", errorMessage, "error");
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#FCF9F4] rounded-2xl w-full max-w-md shadow-xl border border-[#ECE7E2]">
        <div className="flex justify-between items-center p-6 border-b border-[#ECE7E2]">
          <h2 className="text-2xl font-bold text-[#86654F]">Vaccinate Pet</h2>
          <button
            onClick={onClose}
            className="text-[#A98770] hover:text-[#86654F] transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Pet Selection */}
          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Select Pet
            </label>
            <select
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              required
            >
              <option value="">-- Choose Pet --</option>
              {pets.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            {selectedPet && (
              <div className="mt-1">
                <span className="text-[10px] font-mono text-[#A98770] bg-[#F7F3EF] px-1.5 py-0.5 rounded-md border border-[#E9DFD5]">
                  ID: #{selectedPet.slice(-6).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Vaccine Selection */}
          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Select Vaccine
            </label>
            <select
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
              value={selectedVaccineId}
              onChange={(e) => setSelectedVaccineId(e.target.value)}
              required
            >
              <option value="">-- Choose Vaccine --</option>
              {vaccines?.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
            {selectedVaccineId && (
              <div className="mt-1">
                <span className="text-[10px] font-mono text-[#A98770] bg-[#F7F3EF] px-1.5 py-0.5 rounded-md border border-[#E9DFD5]">
                  ID: #{selectedVaccineId.slice(-6).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Dose Selection */}
          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Select Dose
            </label>
            <select
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
              value={selectedDoseNumber}
              onChange={(e) => setSelectedDoseNumber(Number(e.target.value))}
              disabled={availableDoses.length === 0}
              required
            >
              <option value="0">-- Choose Dose --</option>
              {availableDoses.map((dose) => (
                <option key={dose.doseNumber} value={dose.doseNumber}>
                  Dose {dose.doseNumber} (Age: {dose.ageInWeeks} weeks)
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Vaccination Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              // No min/max restrictions - allow both past and future dates
              // Backend will compute status: past dates = "completed", future = "scheduled"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You can select past dates to record historical vaccinations
            </p>
          </div>

          <button
            type="submit"
            disabled={vaccinateMutation.isPending}
            className="w-full py-3 bg-[#86654F] text-white rounded-xl font-bold hover:bg-[#6d5240] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {vaccinateMutation.isPending ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Record Vaccination"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
