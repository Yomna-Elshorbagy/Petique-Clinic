import { useState, useEffect } from "react";
import { FaTimes, FaCamera, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import { useUpdateDoctor } from "../../../../Hooks/Doctor/useDoctor";
import type { IUser } from "../../../../Interfaces/IUser";

interface EditDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: IUser;
  onSuccess: () => void;
}

export default function EditDoctorModal({
  isOpen,
  onClose,
  doctor,
  onSuccess,
}: EditDoctorModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    userName: "",
    mobileNumber: "",
    gender: "female",
    newPassword: "",
    confirmPassword: "",
  });

  const { mutate, isPending } = useUpdateDoctor();

  useEffect(() => {
    if (doctor) {
      setFormData({
        userName: doctor.userName || "",
        mobileNumber: doctor.mobileNumber || "",
        gender: doctor.gender?.toLowerCase() || "female",
        newPassword: "",
        confirmPassword: "",
      });
      setPreviewUrl(doctor.image?.secure_url || null);
    }
  }, [doctor]);

  if (!isOpen) return null;

  const handleImageChange = (e: any) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("userName", formData.userName);
    fd.append("mobileNumber", formData.mobileNumber);
    fd.append("gender", formData.gender);
    fd.append("newPassword", formData.newPassword);
    fd.append("confirmPassword", formData.confirmPassword);

    if (imageFile) fd.append("image", imageFile);

    mutate(
      { id: doctor._id, formData: fd },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Doctor profile updated successfully",
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
            text: error?.response?.data?.message || "Update failed",
          });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
        
        {/* ===> Header */}
        <div className="bg-[#86654F] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Edit Doctor Profile</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* ===> Image Upload */}
          <div className="flex justify-center">
            <div className="relative group cursor-pointer">
              <div className="w-28 h-28 rounded-full bg-[#FCF9F4] border-2 border-dashed border-[#A98770] flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-[#A98770]">
                    <FaCamera size={24} className="mx-auto mb-1" />
                    <span className="text-xs">Upload Photo</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* ===> Fields */}
          <div className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#6D5240]"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#6D5240]"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                Gender
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="accent-[#86654F]"
                  />
                  <span className="text-[#6D5240]">Male</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="accent-[#86654F]"
                  />
                  <span className="text-[#6D5240]">Female</span>
                </label>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#6D5240]"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none text-[#6D5240]"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#86654F] text-white py-3 rounded-xl font-bold hover:bg-[#6D5240] transition-colors shadow-lg shadow-[#86654F]/20 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update Doctor"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
