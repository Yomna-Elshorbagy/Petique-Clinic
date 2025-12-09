import React, { useState } from "react";
import type { EditModalProps } from "../../../../Interfaces/components/IStatusmodel";

const categories = [
  "appointment",
  "emergency",
  "health",
  "vaccination",
  "general",
];
const statusOptions = ["replied", "inProgress", "pending"];
const urgencyLevel = ["low", "medium", "high", "emergency"];

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  contact,
  onClose,
  onUpdateContact,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    category: categories[0],
    petAge: "",
    replyStatus: statusOptions[0],
    urgency: urgencyLevel[0],
  });

  if (!isOpen || !contact) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value: string | number = e.target.value;

    if (e.target.name === "petAge") {
      if (Number(value) < 0) value = "0";
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.petAge.trim() !== "" &&
      Number(formData.petAge) > 0
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-amber-50 p-6 rounded-xl w-96 shadow-lg border border-amber-200">
        <h2 className="text-2xl font-bold mb-4 text-[#86654f] text-center">
          Edit Contact
        </h2>

        {/* Full Name */}
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full text-[#86654f] border border-[#e9a66f]  rounded-lg p-2 mb-3 placeholder-[#86654f] focus:outline-none focus:ring-2 focus:ring-orange-300"
          placeholder="Full Name"
        />

        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full text-[#86654f]  border border-[#e9a66f]  rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {/* Pet Age */}
        <input
          type="number"
          min={0}
          name="petAge"
          value={formData.petAge}
          onChange={handleChange}
          className="w-full text-[#86654f] border border-[#e9a66f]  rounded-lg p-2 mb-3 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
          placeholder="Pet Age"
        />

        {/* Status */}
        <select
          name="replyStatus"
          value={formData.replyStatus}
          onChange={handleChange}
          className="w-full text-[#86654f] border border-[#e9a66f]  rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>

        {/* Urgency */}
        <select
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          className="w-full text-[#86654f] border border-[#e9a66f] rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          {urgencyLevel.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-[#e8d8c4] hover:bg-[#a98770] rounded-lg font-semibold transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isFormValid()
                ? "bg-[#c6bcb3] hover:bg-[#e9a66f] text-white"
                : "bg-orange-200 text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => {
              if (!isFormValid()) return;
              onUpdateContact(contact._id, formData);
              onClose();
            }}
            disabled={!isFormValid()}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
