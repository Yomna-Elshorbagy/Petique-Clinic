import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { useVaccinations } from "../../../../Hooks/Vaccinations/useVaccinations";
import { useUpdatePetVaccination } from "../../../../Hooks/Pets/UsePets";
import type { IDose } from "../../../../Interfaces/IVacination";

interface IEditVaccinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
  vaccinationId: string;
  currentVaccineId: string;
  currentDoseNumber: number;
  currentDate: string;
  onSuccess?: () => void;
}

export default function EditVaccinationModal({
  isOpen,
  onClose,
  petId,
  vaccinationId,
  currentVaccineId,
  currentDoseNumber,
  currentDate,
  onSuccess,
}: IEditVaccinationModalProps) {
  const { data: vaccines } = useVaccinations();
  const updateMutation = useUpdatePetVaccination();

  const [selectedVaccineId, setSelectedVaccineId] = useState(currentVaccineId);
  const [selectedDoseNumber, setSelectedDoseNumber] =
    useState<number>(currentDoseNumber);
  const [availableDoses, setAvailableDoses] = useState<IDose[]>([]);
  const [date, setDate] = useState(
    currentDate ? new Date(currentDate).toISOString().split("T")[0] : ""
  );

  // ===> update available doses when vaccine is selected
  useEffect(() => {
    if (selectedVaccineId && vaccines) {
      const v = vaccines.find((x) => x._id === selectedVaccineId);
      if (v?.doses?.length) {
        setAvailableDoses(v.doses);
        // ===> If current dose is not in available doses, set to first dose
        const doseExists = v.doses.some(
          (d) => d.doseNumber === selectedDoseNumber
        );
        if (!doseExists && v.doses.length > 0) {
          setSelectedDoseNumber(v.doses[0].doseNumber);
        }
      } else {
        setAvailableDoses([]);
        setSelectedDoseNumber(0);
      }
    } else {
      setAvailableDoses([]);
      setSelectedDoseNumber(0);
    }
  }, [selectedVaccineId, vaccines]);

  // ===> reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      setSelectedVaccineId(currentVaccineId);
      setSelectedDoseNumber(currentDoseNumber);
      setDate(
        currentDate ? new Date(currentDate).toISOString().split("T")[0] : ""
      );
    }
  }, [isOpen, currentVaccineId, currentDoseNumber, currentDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVaccineId || !date || !selectedDoseNumber) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    // ===> 1- ensure date is in YYYY-MM-DD format (backend expects this format)
    const dateValue = date.trim();

    // ===> 2- Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      Swal.fire("Error", "Invalid date format", "error");
      return;
    }

    // ===> 3- Validate IDs before making the request
    if (!petId || !vaccinationId) {
      console.error(
        "Missing IDs - petId:",
        petId,
        "vaccinationId:",
        vaccinationId
      );
      Swal.fire("Error", "Missing required IDs. Please try again.", "error");
      return;
    }

    // Backend will handle status computation:
    // - Future date → "scheduled"
    // - Today or past → "completed"
    // - If nextDose is missed → "overdue"
    updateMutation.mutate(
      {
        petId,
        vaccinationId,
        data: {
          doseNumber: selectedDoseNumber,
          date: dateValue,
        },
      },
      {
        onSuccess: () => {
          Swal.fire("Done", "Vaccination updated successfully", "success");
          onClose();
          if (onSuccess) onSuccess();
        },
        onError: (err: any) => {
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to update vaccination";
          console.error("Update vaccination error:", err);
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
          <h2 className="text-2xl font-bold text-[#86654F]">
            Edit Vaccination
          </h2>
          <button
            onClick={onClose}
            className="text-[#A98770] hover:text-[#86654F] transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              // ===> No min/max restrictions - allow both past and future dates
              // ===> Backend will compute status: past dates = "completed", future = "scheduled"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You can select past dates to record historical vaccinations
            </p>
          </div>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full py-3 bg-[#86654F] text-white rounded-xl font-bold hover:bg-[#6d5240] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {updateMutation.isPending ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Update Vaccination"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
