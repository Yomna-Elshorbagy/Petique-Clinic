import React, { useState, useEffect } from "react";
import { FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import { addPet } from "../../../../Apis/PetApis";
import { getAllAnimalCategories } from "../../../../Apis/AnimalCategory";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Category {
  _id: string;
  name: string;
}

const petSchema = z.object({
  name: z
    .string()
    .min(1, "Pet name is required")
    .min(3, "Pet name must be at least 3 characters"),

  age: z.coerce.number().min(0.1, "Age is required"),
  weight: z.coerce.number().min(0.1, "Weight is required"),
  category: z.string().min(1, "Category is required"),
  allergies: z.string().optional(),
});

type FormValues = z.infer<typeof petSchema>;

export default function AddPetModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPetModalProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(petSchema),
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const data = await getAllAnimalCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("age", data.age.toString());
      formData.append("weight", data.weight.toString());
      formData.append("category", data.category);

      if (data.allergies) {
        data.allergies
          .split(",")
          .map((a: string) => a.trim())
          .filter(Boolean)
          .forEach((a: string) => formData.append("allergies[]", a));
      }

      if (image) formData.append("image", image);

      await addPet(formData);

      onSuccess();
      onClose();
      reset();
      setImage(null);
      setPreview(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to add pet");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#FCF9F4] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl border border-[#ECE7E2]">
        <div className="flex justify-between items-center p-6 border-b border-[#ECE7E2]">
          <h2 className="text-2xl font-bold text-[#86654F]">Add New Pet</h2>
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

          {/* Image Upload */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-[#A98770] flex items-center justify-center overflow-hidden bg-[#ECE7E2] group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-[#A98770]">
                  <FaUpload className="mx-auto mb-1" />
                  <span className="text-xs">Upload Photo</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Pet Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]"
              placeholder="e.g. Max"
            />

            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                Age (years)
              </label>

              <input
                type="number"
                step="0.1"
                min={0}
                {...register("age")}
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
              />

              {errors.age && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                Weight (kg)
              </label>

              <input
                type="number"
                step="0.1"
                min={0}
                {...register("weight")}
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
              />

              {errors.weight && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.weight.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Category
            </label>
            <select
              {...register("category")}
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {errors.category && (
              <p className="text-red-600 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Allergies (comma separated)
            </label>
            <textarea
              {...register("allergies")}
              rows={2}
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#86654F]"
              placeholder="e.g. Peanuts, Dairy"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#86654F] text-white rounded-xl font-bold hover:bg-[#6d5240] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Add Pet"}
          </button>
        </form>
      </div>
    </div>
  );
}
