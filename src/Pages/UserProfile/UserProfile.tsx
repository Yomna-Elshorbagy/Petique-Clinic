import { useState } from "react";
import { FaPen } from "react-icons/fa";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import profileImage from "../../assets/images/pet1.jpg";
import SEO from "../../Components/SEO/SEO";
import { useUserProfile } from "../../Hooks/UserProfile/useUserProfile";
import AddPetForm from "../../Components/UserProfile/AddPet";
import UserPets from "../../Components/UserProfile/UserPets";
import UserOrders from "../../Components/UserProfile/Orders";
import PetOrderTracking from "../../Components/UserProfile/OrderTracking";
import UserUpdateData from "../../Components/UserProfile/UserUpdateData";
import Appointments from "../../Components/UserProfile/Appointments";

export default function UserPetClinicProfile() {
  const [activeTab, setActiveTab] = useState("Appointments");
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
    "Appointments",
    "Personal Information",
    "My Pets",
    "Add New Pet",
    "Orders",
    "Order Tracking",
  ];

  if (isLoading) return <LoaderPage />;

  if (isError)
    return (
      <p className="text-center py-10 text-[#443935]">
        Error loading User Profile
      </p>
    );

  return (
    <div className="relative min-h-screen py-10 px-5 text-[#443935] dark:text-[var(--color-dark-text)] bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] transition-colors duration-300">
      <SEO
        title="Profile | Pet Clinic"
        description="Manage your personal info, pets, and appointments."
      />

      {/* ===> paw print background <=== */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="absolute top-10 left-12 text-7xl">🐾</div>
        <div className="absolute top-40 right-10 text-6xl">🐾</div>
        <div className="absolute bottom-28 left-1/4 text-8xl">🐾</div>
        <div className="absolute bottom-10 right-1/3 text-7xl">🐾</div>
      </div>

      {/* ===> header <=== */}
      <div className="relative text-center mb-10">
        <h2 className="text-4xl font-bold font-serif text-[#443935] dark:text-[var(--color-dark-text)]">
          Pet Owner Dashboard
        </h2>
        <p className="mt-2 text-[#A98868] dark:text-gray-400">
          Home /{" "}
          <span className="text-[#F2A056] dark:text-[var(--color-dark-accent)]">
            My Account
          </span>
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto bg-white dark:bg-[var(--color-dark-card)] rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8 transition-colors duration-300">
        {/* ===> sidebar <=== */}
        <div className="flex flex-col w-full md:w-1/4 border-r border-[#E8DED7] dark:border-[var(--color-dark-accent)]/30">
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
                  ? "text-white bg-[#F2A056]"
                  : "text-[#443935] dark:text-[var(--color-dark-text)] hover:bg-[#F2A056]/20 dark:hover:bg-[var(--color-dark-accent)]/20 bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ===> main content <=== */}
        <div className="flex-1">
          {activeTab === "Personal Information" && (
            <UserUpdateData
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              preview={preview}
              handleImageChange={handleImageChange}
              mutation={mutation}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          )}
          {activeTab === "Appointments" && (
            <div>
              <Appointments />
            </div>
          )}
          {activeTab === "My Pets" && (
            <div>
              <UserPets />
            </div>
          )}
          {activeTab === "Add New Pet" && (
            <div>
              <AddPetForm />
            </div>
          )}
          {activeTab === "Orders" && (
            <div>
              {" "}
              <UserOrders />
            </div>
          )}

          {activeTab === "Order Tracking" && (
            <div>
              <PetOrderTracking />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
