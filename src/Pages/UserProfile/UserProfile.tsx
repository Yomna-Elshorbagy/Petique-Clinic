// import React from 'react'

// export default function UserProfile() {
//   return (
//     <div>UserProfile</div>
//   )
// }
import { useState } from "react";
import { FaPen } from "react-icons/fa";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import profileImage from "../../assets/images/pet1.jpg";
import SEO from "../../Components/SEO/SEO";
import { useUserProfile } from "../../Hooks/UserProfile/useUserProfile";
import AddPetForm from "../../Components/UserProfile/AddPet";
import Orders from "../../Components/UserProfile/Orders";
import UserPets from "../../Components/UserProfile/UserPets";

export default function UserPetClinicProfile() {
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [showPassword, setShowPassword] = useState(false);

  const {
    formData,
    handleChange,
    handleImageChange,
    handleSubmit,
    preview,
    mutation,
    isLoading,
    isError,
  } = useUserProfile();

  const tabs = [
    "Personal Information",
    "My Pets",
    "Appointments",
    "Add New Pet",
  ];

  if (isLoading) return <LoaderPage />;

  if (isError)
    return (
      <p className="text-center py-10 text-[#443935]">
        Error loading User Profile
      </p>
    );

  return (
    <div
      className="relative min-h-screen py-10 px-5 text-[#443935]"
      style={{ backgroundColor: "#FCF9F4" }}
    >
      <SEO
        title="Pet Clinic | Profile"
        description="Manage your personal info, pets, and appointments."
      />

      {/* === PAW PRINT BACKGROUND === */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="absolute top-10 left-12 text-7xl">🐾</div>
        <div className="absolute top-40 right-10 text-6xl">🐾</div>
        <div className="absolute bottom-28 left-1/4 text-8xl">🐾</div>
        <div className="absolute bottom-10 right-1/3 text-7xl">🐾</div>
      </div>

      {/* === HEADER === */}
      <div className="relative text-center mb-10">
        <h2
          className="text-4xl font-bold font-serif"
          style={{ color: "#443935" }}
        >
          Pet Owner Dashboard
        </h2>
        <p className="mt-2 text-[#A98868]">
          Home / <span className="text-[#F2A056]">My Account</span>
        </p>
      </div>

      {/* === MAIN CARD === */}
      <div className="relative max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8">
        {/* === SIDEBAR === */}
        <div className="flex flex-col w-full md:w-1/4 border-r border-[#E8DED7]">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28">
              <img
                src={preview || profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4"
                style={{ borderColor: "#F2A056" }}
              />

              <input
                type="file"
                accept="image/*"
                id="profile-upload"
                onChange={handleImageChange}
                className="hidden"
              />

              <label
                htmlFor="profile-upload"
                className="absolute bottom-1 right-1 bg-[#F19645] text-white p-2 rounded-full shadow cursor-pointer hover:bg-[#F2A056] transition"
              >
                <FaPen size={14} />
              </label>
            </div>
          </div>

          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-5 py-3 font-medium rounded-md mb-2 transition shadow-sm ${
                activeTab === tab
                  ? "text-white"
                  : "text-[#443935] hover:bg-[#F2A056]/20"
              }`}
              style={{
                backgroundColor: activeTab === tab ? "#F2A056" : "#FCF9F4",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* === MAIN CONTENT === */}
        <div className="flex-1">
          {/* PERSONAL INFO TAB */}
          {activeTab === "Personal Information" && (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-[#443935] mb-1 font-medium">
                  Owner Name *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full border border-[#D7C7BD] rounded-md px-3 py-2 bg-white"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-[#443935] mb-1 font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full border border-[#D7C7BD] rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div className="md:col-span-2">
                <label className="block text-[#443935] mb-1 font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full border border-[#D7C7BD] rounded-md px-3 py-2 bg-white"
                />
              </div>

              {/* === COLLAPSIBLE PASSWORD SECTION === */}
              <div className="md:col-span-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm font-semibold px-4 py-2 rounded-md"
                  style={{ backgroundColor: "#F2A056", color: "#FFFFFF" }}
                >
                  {showPassword ? "Hide Password Fields" : "Change Password"}
                </button>

                {showPassword && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                    <div>
                      <label className="block mb-1 text-[#443935]">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        onChange={handleChange}
                        className="w-full border border-[#D7C7BD] rounded-md px-3 py-2 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#443935]">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        onChange={handleChange}
                        className="w-full border border-[#D7C7BD] rounded-md px-3 py-2 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-6 py-2 rounded-md transition text-white"
                  style={{ backgroundColor: "#F19645" }}
                >
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* OTHER TABS */}
          {activeTab === "My Pets" && <div><UserPets/></div>}
          {activeTab === "orders" && (
            <div>
              {" "}
              <Orders />
            </div>
          )}
          {activeTab === "Add New Pet" && (
            <div>
              <AddPetForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
