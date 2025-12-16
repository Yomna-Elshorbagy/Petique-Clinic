import { useState } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { addAnimalCategory } from "../../../../Apis/AnimalCategory";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";

interface AddAnimalCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  description: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const schema = z.object({
  name: z
    .string()
    .refine((val) => val.trim() !== "", {
      message: "Category name is required",
    })
    .refine((val) => val.trim().length >= 3, {
      message: "Category name must be at least 3 characters",
    }),
  description: z
    .string()
    .refine((val) => val.trim() !== "", {
      message: "Category description is required",
    })
    .refine((val) => val.trim().length >= 10, {
      message: "Category description must be at least 10 characters",
    }),
});

export default function AddAnimalCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddAnimalCategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError("");

    try {
      await addAnimalCategory(data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Category added successfully!",
      });

      onSuccess();
      onClose();
      reset();
    } catch (err: unknown) {
      const error = err as ApiError;

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to add category",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#FCF9F4] rounded-2xl w-full max-w-md shadow-xl border border-[#ECE7E2]">
        <div className="flex justify-between items-center p-6 border-b border-[#ECE7E2]">
          <h2 className="text-2xl font-bold text-[#86654F]">Add Category</h2>
          <button
            onClick={onClose}
            className="text-[#A98770] hover:text-[#86654F] transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Category Name
            </label>
            <input
              {...register("name")}
              className={`w-full px-4 py-2 rounded-xl bg-white border focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]`}
              placeholder="e.g. Hamsters"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Category Description
            </label>
            <input
              {...register("description")}
              className={`w-full px-4 py-2 rounded-xl bg-white border  focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]`}
              placeholder="e.g. Hamsters category description"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#86654F] text-white rounded-xl font-bold hover:bg-[#6d5240] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
