import { useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { useUpdateAnimalCategory } from "../../../../Hooks/AnimalCategoey/UseAnimalCategory";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryItem | null;
  onSuccess: () => void;
}

interface CategoryItem {
  _id: string;
  name: string;
  description?: string;
  petCount?: number;
}

interface FormValues {
  name: string;
  description: string;
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

export default function EditAnimalCategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: Props) {
  const { mutate, isPending, error } = useUpdateAnimalCategory(
    category?._id || ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("description", category.description || "");
    }
  }, [category, setValue]);

  if (!isOpen || !category) return null;

  const onSubmit = (data: FormValues) => {
    mutate(data, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Category updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        onSuccess();
        onClose();
        reset();
      },
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { message?: string } } };

        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response?.data?.message || "Failed to update category",
        });
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#FCF9F4] rounded-2xl w-full max-w-md shadow-xl border border-[#ECE7E2]">
        <div className="flex justify-between items-center p-6 border-b border-[#ECE7E2]">
          <h2 className="text-2xl font-bold text-[#86654F]">Edit Category</h2>
          <button
            onClick={onClose}
            className="text-[#A98770] hover:text-[#86654F]"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 p-3 text-red-600 rounded-lg">
              {(error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message || "Update failed"}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Category Name
            </label>
            <input
              {...register("name")}
              className={`w-full px-4 py-2 rounded-xl bg-white border  focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]`}
              placeholder="Category name"
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
              className={`w-full px-4 py-2 rounded-xl bg-white border focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]`}
              placeholder="Category description"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-[#86654F] text-white rounded-xl flex justify-center items-center gap-2"
          >
            {isPending ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
