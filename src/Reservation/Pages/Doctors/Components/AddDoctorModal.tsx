import { useState } from "react";
import { FaTimes, FaCamera, FaSpinner } from "react-icons/fa";
import { addNewDoctor } from "../../../../Apis/DoctoresApis";
import Swal from "sweetalert2";

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddDoctorModal({
  isOpen,
  onClose,
  onSuccess,
}: AddDoctorModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    mobileNumber: "",
    gender: "female",
    doctorSpecialist: "generalVeterinary",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("userName", formData.userName);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("mobileNumber", formData.mobileNumber);
      payload.append("gender", formData.gender);

      if (imageFile) payload.append("image", imageFile);

      const response = await addNewDoctor(payload);

      const secureUrl = response?.data?.image?.secure_url;

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Doctor added successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      // pass secure URL to parent
      //   if (secureUrl) {
      //     console.log("Uploaded Image URL:", secureUrl);
      //   }

      onSuccess();
      onClose();

      // ==> reset form
      setFormData({
        userName: "",
        email: "",
        password: "",
        mobileNumber: "",
        gender: "female",
        doctorSpecialist: "generalVeterinary",
      });
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      console.error("Add doctor error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to add doctor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
        {/* ===> header */}
        <div className="bg-[#86654F] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add New Doctor</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/*===> image upload */}
          <div className="flex justify-center">
            <div className="relative group cursor-pointer">
              <div className="w-28 h-28 rounded-full bg-[#FCF9F4] border-2 border-dashed border-[#A98770] flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
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

          {/* ===> form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
                placeholder="Ex. John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#86654F] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
                  placeholder="doctor@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#86654F] mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNumber: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
                  placeholder="+20 123 456 789"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#86654F] mb-1">
                Doctor Specialist
              </label>

              <select
                value={formData.doctorSpecialist}
                onChange={(e) =>
                  setFormData({ ...formData, doctorSpecialist: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] 
      focus:ring-2 focus:ring-[#A98770] outline-none text-[#6D5240]"
              >
                <option value="generalVeterinary">General Veterinary</option>
                <option value="surgery">Surgery</option>
                <option value="dermatology">Dermatology</option>
                <option value="dentistry">Dentistry</option>
              </select>
            </div>

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
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#86654F] text-white py-3 rounded-xl font-bold hover:bg-[#6d5240] transition-colors shadow-lg shadow-[#86654F]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Adding Doctor...</span>
                </>
              ) : (
                "Add Doctor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
