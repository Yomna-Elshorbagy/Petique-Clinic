import React, { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  type SubmitHandler,
  type SubmitErrorHandler,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { FaTimes, FaSpinner, FaPlus, FaTrash } from "react-icons/fa";

import { useUpdateVaccination } from "../../../../Hooks/Vaccinations/useVaccinations";
import { useAnimalCategories } from "../../../../Hooks/AnimalCategoey/UseAnimalCategory";
import type { IVaccination, IDose } from "../../../../Interfaces/IVacination";

//===> all types
interface IDoseForm {
  doseNumber: number;
  ageInWeeks: number;
  repeatAfterDays?: number;
  recurring?: boolean;
}

interface IFormInput {
  name: string;
  description: string;
  categories: string[];
  doses: IDoseForm[];
}

interface IEditVaccinationModalProps {
  isOpen: boolean;
  vaccination: IVaccination;
  onClose: () => void;
}

interface ICategory {
  _id: string;
  name: string;
}

// ===> vaccination Schema
const doseSchema = z.object({
  doseNumber: z.number(),
  ageInWeeks: z.number().min(1, "Age must be at least 1 week"),
  repeatAfterDays: z
    .number()
    .min(0, "Repeat after days must be >= 0")
    .optional(),
  recurring: z.boolean().optional(),
});

const editVaccineSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  doses: z.array(doseSchema).min(1, "At least one dose is required"),
});

// ===> component schema

export default function EditAllVaccinationModal({
  isOpen,
  vaccination,
  onClose,
}: IEditVaccinationModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(editVaccineSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "doses",
  });

  const { data: categoriesData } = useAnimalCategories();
  const categories: ICategory[] = categoriesData?.data || categoriesData || [];

  const updateMutation = useUpdateVaccination(vaccination._id);

  //==> prefill form

  useEffect(() => {
    if (!isOpen) return;

    reset({
      name: vaccination.name,
      description: vaccination.description,
      categories: vaccination.categories.map((c: any) =>
        typeof c === "string" ? c : c._id
      ),
      doses: vaccination.doses.map((d: IDose) => ({
        doseNumber: d.doseNumber,
        ageInWeeks: d.ageInWeeks,
        repeatAfterDays: d.repeatAfterDays,
        recurring: d.recurring,
      })),
    });
  }, [isOpen, vaccination, reset]);

  // ===> submit
  const onSubmit: SubmitHandler<IFormInput> = (formData) => {
    const payload = {
      name: formData.name,
      description: formData.description,
      categories: formData.categories,
      doses: formData.doses.map((d, index) => ({
        doseNumber: index + 1,
        ageInWeeks: d.ageInWeeks,
        repeatAfterDays: d.repeatAfterDays,
        recurring: d.recurring,
      })),
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        Swal.fire("Updated", "Vaccination updated successfully", "success");
        onClose();
      },
      onError: (error: any) => {
        Swal.fire(
          "Error",
          error?.response?.data?.message || "Update failed",
          "error"
        );
      },
    });
  };

  const onError: SubmitErrorHandler<IFormInput> = (errors) => {
    const firstError =
      errors.name?.message ||
      errors.description?.message ||
      errors.categories?.message ||
      errors.doses?.[0]?.ageInWeeks?.message ||
      errors.doses?.[0]?.repeatAfterDays?.message ||
      "Validation error";

    Swal.fire("Error", firstError, "error");
  };

  if (!isOpen) return null;

  // ===> ui
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FCF9F4] rounded-2xl w-full max-w-2xl shadow-xl border border-[#ECE7E2] my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#ECE7E2]">
          <h2 className="text-2xl font-bold text-[#86654F]">
            Edit Vaccination
          </h2>
          <button
            onClick={onClose}
            className="text-[#A98770] hover:text-[#86654F]"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="p-6 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Name *
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2]
                         focus:ring-2 focus:ring-[#A98770] outline-none"
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Description *
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2]
                         focus:ring-2 focus:ring-[#A98770] outline-none min-h-[80px]"
            />
            {errors.description && (
              <span className="text-red-500 text-xs">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-2">
              Categories *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-40 overflow-y-auto p-2 border rounded-xl bg-white">
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={cat._id}
                    {...register("categories")}
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Doses */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#86654F]">Dose Schedule</h3>
              <button
                type="button"
                onClick={() =>
                  append({
                    doseNumber: fields.length + 1,
                    ageInWeeks: 1,
                    recurring: false,
                  })
                }
                className="mb-4 flex items-center gap-2 bg-[#86654F] text-white px-3 py-1 rounded"
              >
                <FaPlus /> Add Dose
              </button>
            </div>

            {fields.map((_, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl border mb-4 relative"
              >
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-red-500"
                  >
                    <FaTrash size={14} />
                  </button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="number"
                    disabled
                    value={index + 1}
                    className="bg-gray-100 px-3 py-2 rounded-lg"
                  />

                  <input
                    type="number"
                    min={1}
                    {...register(`doses.${index}.ageInWeeks` as const, {
                      valueAsNumber: true,
                    })}
                    placeholder="Age (weeks)"
                    className="px-3 py-2 rounded-lg border"
                  />

                  <input
                    type="number"
                    min={1}
                    {...register(`doses.${index}.repeatAfterDays` as const, {
                      valueAsNumber: true,
                    })}
                    placeholder="Repeat after days"
                    className="px-3 py-2 rounded-lg border"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full py-3 bg-[#86654F] text-white rounded-xl font-bold"
          >
            {updateMutation.isPending ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              "Update Vaccination"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
