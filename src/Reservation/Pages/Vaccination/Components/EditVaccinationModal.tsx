import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { useVaccinations } from "../../../../Hooks/Vaccinations/useVaccinations";
import { useUpdatePetVaccination } from "../../../../Hooks/Pets/UsePets";
import type { IDose } from "../../../../Interfaces/IVacination";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const editVaccinationSchema = z.object({
  vaccineId: z.string().min(1, "Vaccine is required"),
  doseNumber: z.coerce.number().min(1, "Dose is required"),
  date: z
    .string()
    .min(1, "Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

type EditVaccinationForm = z.infer<typeof editVaccinationSchema>;

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

  const [availableDoses, setAvailableDoses] = useState<IDose[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editVaccinationSchema),
    defaultValues: {
      vaccineId: currentVaccineId,
      doseNumber: currentDoseNumber,
      date: currentDate
        ? new Date(currentDate).toISOString().split("T")[0]
        : "",
    },
  });

  const selectedVaccineId = watch("vaccineId");
  const selectedDoseNumber = watch("doseNumber");

  useEffect(() => {
    if (selectedVaccineId && vaccines) {
      const v = vaccines.find((x) => x._id === selectedVaccineId);
      if (v?.doses?.length) {
        setAvailableDoses(v.doses);

        const doseExists = v.doses.some(
          (d) => d.doseNumber === selectedDoseNumber
        );

        if (!doseExists) {
          reset((prev) => ({
            ...prev,
            doseNumber: v.doses[0].doseNumber,
          }));
        }
      } else {
        setAvailableDoses([]);
      }
    } else {
      setAvailableDoses([]);
    }
  }, [selectedVaccineId, vaccines, reset, selectedDoseNumber]);

  // ===> reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      reset({
        vaccineId: currentVaccineId,
        doseNumber: currentDoseNumber,
        date: currentDate
          ? new Date(currentDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [isOpen, currentVaccineId, currentDoseNumber, currentDate, reset]);

  const onSubmit = (data: EditVaccinationForm) => {
    if (!petId || !vaccinationId) {
      Swal.fire("Error", "Missing required IDs", "error");
      return;
    }
    console.log("SUBMIT DATA", {
      petId,
      vaccinationId,
      data,
    });

    updateMutation.mutate(
      {
        petId,
        vaccinationId,
        data: {
          vaccine: data.vaccineId,
          doseNumber: data.doseNumber,
          date: data.date,
        },
      },

      {
        onSuccess: () => {
          Swal.fire("Done", "Vaccination updated successfully", "success");
          onClose();
          if (onSuccess) onSuccess();
        },
        onError: (error: unknown) => {
          const e = error as { response?: { data?: { message?: string } } };
          Swal.fire(
            "Error",
            e.response?.data?.message || "Failed to update vaccine",
            "error"
          );
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Vaccine */}
          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Select Vaccine
            </label>
            <select
              {...register("vaccineId")}
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
            >
              <option value="">-- Choose Vaccine --</option>
              {vaccines?.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
            {errors.vaccineId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.vaccineId.message}
              </p>
            )}
          </div>

          {/* Dose */}
          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Select Dose
            </label>
            <select
              {...register("doseNumber")}
              disabled={availableDoses.length === 0}
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
            >
              <option value={0}>-- Choose Dose --</option>
              {availableDoses.map((dose) => (
                <option key={dose.doseNumber} value={dose.doseNumber}>
                  Dose {dose.doseNumber} (Age: {dose.ageInWeeks} weeks)
                </option>
              ))}
            </select>
            {errors.doseNumber && (
              <p className="text-xs text-red-500 mt-1">
                {errors.doseNumber.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Vaccination Date
            </label>
            <input
              type="date"
              {...register("date")}
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
            />
            {errors.date && (
              <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
            )}
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
