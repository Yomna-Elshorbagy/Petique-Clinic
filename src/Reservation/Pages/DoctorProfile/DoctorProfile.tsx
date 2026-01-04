import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  doctorUpdateSchema,
  type DoctorUpdateFormInputs,
} from "../../../Utils/Schema/doctorUpdateSchema";
import {
  useGetDoctorProfile,
  useUpdateDoctor,
} from "../../../Hooks/Doctor/useDoctor";
import { FaCamera, FaSpinner, FaUserMd } from "react-icons/fa";
import Swal from "sweetalert2";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import SEO from "../../../Components/SEO/SEO";

export default function DoctorProfile() {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ===> Hooks
  const { data: doctorData, isLoading: isFetching } = useGetDoctorProfile();
  const { mutate: updateDoctor, isPending: isUpdating } = useUpdateDoctor();

  // ===> Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DoctorUpdateFormInputs>({
    resolver: zodResolver(doctorUpdateSchema),
  });

  // ===> Prefill Data
  useEffect(() => {
    if (doctorData) {
      let normalizedGender = doctorData.gender;
      if (normalizedGender) {
        normalizedGender =
          normalizedGender.charAt(0).toUpperCase() +
          normalizedGender.slice(1).toLowerCase();

        // if (!["male", "female"].includes(normalizedGender)) {
        //   normalizedGender = undefined;
        // }
      }

      reset({
        userName: doctorData.userName,
        mobileNumber: doctorData.mobileNumber,
        gender: normalizedGender,
        newPassword: "",
        confirmPassword: "",
      });
      if (doctorData.image?.secure_url) {
        setPreview(doctorData.image.secure_url);
      }
    }
  }, [doctorData, reset]);

  // ===> Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  // ===> Submit Handler
  const onSubmit = (data: DoctorUpdateFormInputs) => {
    const formData = new FormData();
    if (data.userName) formData.append("userName", data.userName);
    if (data.mobileNumber) formData.append("mobileNumber", data.mobileNumber);
    if (data.gender) formData.append("gender", data.gender);
    if (data.newPassword) {
      formData.append("newPassword", data.newPassword);
      formData.append("confirmPassword", data.confirmPassword || "");
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (doctorData?._id) {
      updateDoctor(
        { id: doctorData._id, formData },
        {
          onSuccess: (res: any) => {
            console.log("Update Success:", res);
            Swal.fire({
              icon: "success",
              title: "Profile Updated",
              text: "Your changes have been saved successfully.",
              timer: 2000,
              showConfirmButton: false,
              confirmButtonColor: "#86654F",
            });
            setValue("newPassword", "");
            setValue("confirmPassword", "");
          },
          onError: (error: any) => {
            console.error("Update Error Details:", error);
            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              "Failed to update profile. Please check your connection and try again.";

            Swal.fire({
              icon: "error",
              title: "Update Failed",
              text: errorMessage,
              confirmButtonColor: "#86654F",
              footer:
                '<p class="text-sm text-gray-500">Check console for more details</p>',
            });
          },
        }
      );
    }
  };

  if (isFetching) return <LoaderPage />;

  return (
    <div className="min-h-screen bg-[#ECE7E2] py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <SEO
        title="Doctor Profile - Petique Clinic"
        description="Update your doctor profile settings"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#86654F] mb-3">
            Doctor Profile
          </h1>
          <p className="text-[#A98770] text-lg">
            Manage your personal information
          </p>
        </div>

        <div className="bg-[#FCF9F4] rounded-[2rem] shadow-xl shadow-[#A98770]/10 overflow-hidden border border-white/50">
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              console.error("Validation Errors:", errors);
              Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "Please check the form for errors.",
                confirmButtonColor: "#86654F",
              });
            })}
            className="p-8 md:p-14"
          >
            <div className="flex flex-col md:flex-row gap-16 items-start">
              {/* ===> Left Column: Image Upload <=== */}
              <div className="w-full md:w-auto flex flex-col items-center flex-shrink-0 mx-auto md:mx-0">
                <div className="relative group">
                  <div className="w-48 h-48 rounded-[2rem] p-2 bg-gradient-to-br from-[#ECE7E2] to-[#fff] shadow-inner">
                    <div className="w-full h-full rounded-[1.6rem] overflow-hidden bg-[#ECE7E2] shadow-sm">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Profile"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#A98770]/40">
                          <FaUserMd className="text-6xl" />
                        </div>
                      )}
                    </div>
                  </div>

                  <label
                    htmlFor="profile-image-input"
                    className="absolute -bottom-2 -right-2 bg-[#86654F] hover:bg-[#6d5240] text-white p-4 rounded-2xl cursor-pointer shadow-lg shadow-[#86654F]/20 transition-all duration-300 hover:scale-110 active:scale-95 group-hover:-translate-y-1"
                    title="Change Photo"
                  >
                    <FaCamera size={18} />
                  </label>
                  <input
                    type="file"
                    id="profile-image-input"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <p className="mt-6 text-sm font-medium text-[#A98770]/70 text-center">
                  Allowed *.jpeg, *.jpg, *.png
                </p>
              </div>

              {/* ===> Right Column: Form Inputs <=== */}
              <div className="w-full flex-1 space-y-10">
                {/* Personal Info */}
                <div className="space-y-6">
                  <div className="space-y-6">
                    <div className="relative group">
                      <label className="block text-sm font-semibold text-[#86654F] mb-2 ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 py-4 rounded-2xl bg-[#ECE7E2]/50 border-2 border-transparent focus:border-[#A98770]/30 focus:bg-white text-[#86654F] placeholder-[#A98770]/50 outline-none transition-all duration-300 font-medium"
                        placeholder="Dr. John Doe"
                        {...register("userName")}
                      />
                      {errors.userName && (
                        <span className="absolute -bottom-5 left-1 text-xs text-red-400 font-medium">
                          {errors.userName.message}
                        </span>
                      )}
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-semibold text-[#86654F] mb-2 ml-1">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 py-4 rounded-2xl bg-[#ECE7E2]/50 border-2 border-transparent focus:border-[#A98770]/30 focus:bg-white text-[#86654F] placeholder-[#A98770]/50 outline-none transition-all duration-300 font-medium"
                        placeholder="01xxxxxxxxx"
                        {...register("mobileNumber")}
                      />
                      {errors.mobileNumber && (
                        <span className="absolute -bottom-5 left-1 text-xs text-red-400 font-medium">
                          {errors.mobileNumber.message}
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-[#86654F] mb-3 ml-1">
                        Gender
                      </label>
                      <div className="flex gap-4">
                        {["male", "female"].map((g) => (
                          <label
                            key={g}
                            className="relative flex-1 cursor-pointer"
                          >
                            <input
                              type="radio"
                              value={g}
                              className="peer sr-only"
                              {...register("gender")}
                            />
                            <div className="w-full py-3.5 rounded-xl border-2 border-[#ECE7E2] text-center text-[#A98770] font-medium transition-all duration-200 peer-checked:bg-[#86654F] peer-checked:text-white peer-checked:border-[#86654F] peer-checked:shadow-lg peer-checked:shadow-[#86654F]/20 hover:bg-[#ECE7E2]/50">
                              {g}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[#E8DED7] to-transparent" />

                {/* Password Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-[#86654F] flex items-center gap-3">
                    Security
                    <span className="h-0.5 flex-1 bg-[#ECE7E2] rounded-full"></span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <label className="block text-sm font-semibold text-[#86654F] mb-2 ml-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-5 py-4 rounded-2xl bg-[#ECE7E2]/50 border-2 border-transparent focus:border-[#A98770]/30 focus:bg-white text-[#86654F] placeholder-[#A98770]/50 outline-none transition-all duration-300 font-medium tracking-wide"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...register("newPassword")}
                      />
                      {errors.newPassword && (
                        <span className="absolute -bottom-5 left-1 text-xs text-red-400 font-medium">
                          {errors.newPassword.message}
                        </span>
                      )}
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-semibold text-[#86654F] mb-2 ml-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-5 py-4 rounded-2xl bg-[#ECE7E2]/50 border-2 border-transparent focus:border-[#A98770]/30 focus:bg-white text-[#86654F] placeholder-[#A98770]/50 outline-none transition-all duration-300 font-medium tracking-wide"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                      />
                      {errors.confirmPassword && (
                        <span className="absolute -bottom-5 left-1 text-xs text-red-400 font-medium">
                          {errors.confirmPassword.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Action */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-[#86654F] text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#86654F]/20 hover:bg-[#6d5240] hover:shadow-[#86654F]/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[200px] justify-center"
                  >
                    {isUpdating ? (
                      <>
                        <FaSpinner className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>Save Changes</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
