import { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  type SubmitHandler,
  type SubmitErrorHandler,
} from "react-hook-form";
import Swal from "sweetalert2";
import { FaTimes, FaSpinner, FaPlus, FaTrash } from "react-icons/fa";
import { useAddVaccination } from "../../../../Hooks/Vaccinations/useVaccinations";
import { useAnimalCategories } from "../../../../Hooks/AnimalCategoey/UseAnimalCategory";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface IDoseForm {
  doseNumber: number;
  ageInWeeks?: number;
  repeatAfterDays?: number;
  recurring: boolean;
}

interface IFormInput {
  name: string;
  description: string;
  categories: string[];
  doses: IDoseForm[];
}

interface IAddVaccinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ICategory {
  _id: string;
  name: string;
}

// Schema
const doseSchema = z.object({
  doseNumber: z.number(),
  ageInWeeks: z
    .union([z.number().min(1, "Age must be at least 1 week"), z.undefined()])
    .optional(),
  repeatAfterDays: z
    .union([
      z.number().min(0, "Repeat after days must be >= 0"),
      z.undefined().or(z.literal(NaN)),
    ])
    .optional(),
  recurring: z.boolean(),
});

const addVaccineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  doses: z.array(doseSchema).min(1, "At least one dose is required"),
});

export default function AddVaccinationModal({
  isOpen,
  onClose,
  onSuccess,
}: IAddVaccinationModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      name: "",
      description: "",
      categories: [],
      doses: [
        {
          doseNumber: 1,
          ageInWeeks: undefined,
          repeatAfterDays: undefined,
          recurring: false,
        },
      ],
    },
    resolver: zodResolver(addVaccineSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "doses",
  });

  const { mutate, isPending } = useAddVaccination();
  const { data: categoriesData } = useAnimalCategories();
  const categories: ICategory[] = categoriesData?.data || categoriesData || [];

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        description: "",
        categories: [],
        doses: [
          {
            doseNumber: 1,
            ageInWeeks: undefined,
            repeatAfterDays: undefined,
            recurring: false,
          },
        ],
      });
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<IFormInput> = (formData) => {
    const doses = formData.doses.map((d, index) => ({
      doseNumber: index + 1,
      ageInWeeks: d.ageInWeeks ?? 0,
      repeatAfterDays: d.repeatAfterDays ?? 0,
      recurring: d.recurring ?? false,
    }));

    mutate(
      {
        name: formData.name,
        description: formData.description,
        categories: formData.categories,
        doses,
      },
      {
        onSuccess: () => {
          Swal.fire("Done", "Vaccination Added", "success");
          reset();
          onSuccess?.();
          onClose();
        },
        onError: (error: unknown) => {
          const e = error as { response?: { data?: { message?: string } } };
          Swal.fire(
            "Error",
            e.response?.data?.message || "Something went wrong",
            "error"
          );
        },
      }
    );
  };

  const onError: SubmitErrorHandler<IFormInput> = (errors) => {
    let firstErrorMessage = "Fields are required";
    const dosesError = errors.doses?.[0];
    if (errors.name?.message) firstErrorMessage = errors.name.message;
    else if (errors.description?.message)
      firstErrorMessage = errors.description.message;
    else if (errors.categories?.message)
      firstErrorMessage = errors.categories.message;
    else if (dosesError?.ageInWeeks?.message)
      firstErrorMessage = dosesError.ageInWeeks.message;
    else if (dosesError?.repeatAfterDays?.message)
      firstErrorMessage = dosesError.repeatAfterDays.message;

    Swal.fire("Error", firstErrorMessage, "error");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FCF9F4] rounded-2xl w-full max-w-2xl shadow-xl border border-[#ECE7E2] my-8">
        <div className="flex justify-between items-center p-6 border-b border-[#ECE7E2]">
          <h2 className="text-2xl font-bold text-[#86654F]">Add New Vaccine</h2>
          <button
            onClick={onClose}
            className="text-[#A98770] hover:text-[#86654F] transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="p-6 space-y-6"
        >
          {/* Name & Description */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
                placeholder="Vaccine Name"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-xs">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F] min-h-[80px]"
                placeholder="Description"
                {...register("description")}
              />
              {errors.description && (
                <span className="text-red-500 text-xs">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-2">
              Select Categories <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-40 overflow-y-auto p-2 border border-[#ECE7E2] rounded-xl bg-white">
              {categories.map((cat: ICategory) => (
                <label
                  key={cat._id}
                  className="flex items-center gap-2 cursor-pointer p-1 hover:bg-[#FAF6F1] rounded"
                >
                  <input
                    type="checkbox"
                    value={cat._id}
                    {...register("categories")}
                    className="checkbox checkbox-sm checkbox-primary"
                  />
                  <span className="text-sm text-[#86654F]">{cat.name}</span>
                </label>
              ))}
            </div>
            {errors.categories && (
              <span className="text-red-500 text-xs">
                {errors.categories.message}
              </span>
            )}
          </div>

          {/* Doses Section */}
          <div className="border-t border-[#ECE7E2] pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#86654F]">
                Doses Schedule
              </h3>
              <button
                type="button"
                onClick={() =>
                  append({
                    doseNumber: fields.length + 1,
                    ageInWeeks: 0,
                    repeatAfterDays: 0,
                    recurring: false,
                  })
                }
                className="mb-4 flex items-center gap-2 bg-[#86654F] text-white px-3 py-1 rounded"
              >
                <FaPlus size={12} /> Add Dose
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border border-[#ECE7E2] relative"
                >
                  <div className="absolute top-2 right-2">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#86654F] block mb-1">
                        Dose #{index + 1}
                      </label>
                      <input
                        type="number"
                        disabled
                        value={index + 1}
                        className="w-full px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 border border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#86654F] block mb-1">
                        Age (Weeks)
                      </label>
                      <input
                        type="number"
                        min={1}
                        {...register(`doses.${index}.ageInWeeks` as const, {
                          valueAsNumber: true,
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#ECE7E2] text-[#86654F] text-sm focus:ring-1 focus:ring-[#A98770]"
                        placeholder="e.g. 8"
                      />
                      {errors.doses?.[index]?.ageInWeeks && (
                        <span className="text-red-500 text-xs">
                          {errors.doses[index]?.ageInWeeks?.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#86654F] block mb-1">
                        Repeat After (Days)
                      </label>
                      <input
                        type="number"
                        min={0}
                        {...register(
                          `doses.${index}.repeatAfterDays` as const,
                          {
                            valueAsNumber: true,
                          }
                        )}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#ECE7E2] text-[#86654F] text-sm focus:ring-1 focus:ring-[#A98770]"
                        placeholder="Optional"
                      />
                      {errors.doses?.[index]?.repeatAfterDays && (
                        <span className="text-red-500 text-xs">
                          {errors.doses[index]?.repeatAfterDays?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-[#86654F] text-white rounded-xl font-bold hover:bg-[#6d5240] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {isPending ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Save Vaccine"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
