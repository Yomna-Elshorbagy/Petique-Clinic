import React, { useState } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { addAnimalCategory } from "../../../../Apis/AnimalCategory";

interface AddAnimalCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAnimalCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddAnimalCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addAnimalCategory({ name, description });
      onSuccess();
      onClose();
      setName("");
      setDescription("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to add category"
      );
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]"
              placeholder="e.g. Hamsters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#86654F] mb-1">
              Category Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]"
              placeholder="e.g. Hamsters category description"
            />
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
