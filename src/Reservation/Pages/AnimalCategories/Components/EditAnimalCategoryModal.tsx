import React, { useEffect, useState } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { useUpdateAnimalCategory } from "../../../../Hooks/AnimalCategoey/UseAnimalCategory";
import Swal from "sweetalert2";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: any | null;
  onSuccess: () => void;
}

export default function EditAnimalCategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending, error } = useUpdateAnimalCategory(
    category?._id || ""
  );

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     mutate(
      { name, description },
      {
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
        },
        onError: (error: any) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error?.response?.data?.message ||
              "Failed to update category",
          });
        },
      }
    );
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 p-3 text-red-600 rounded-lg">
              {(error as any).response?.data?.message || "Update failed"}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Category Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Category Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2]"
            />
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
