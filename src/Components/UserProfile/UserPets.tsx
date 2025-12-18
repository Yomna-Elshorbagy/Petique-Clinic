import { FaPaw, FaWeight, FaCalendar, FaSyringe } from "react-icons/fa";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { useUserPets } from "../../Hooks/UserProfile/useUserPets";
import SEO from "../SEO/SEO";
import SharedPagination from "./components/SharedPagination";
import React, { useState } from "react";

export default function UserPets() {
  const { data: pets = [], isLoading, isError } = useUserPets();
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(pets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPets = pets.slice(startIndex, endIndex);
  if (isLoading) return <LoaderPage />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        Failed to load your pets.
      </div>
    );

  if (!pets.length)
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        <FaPaw size={40} className="mx-auto mb-3 opacity-60" />
        <p>No pets found. Add your first pet!</p>
      </div>
    );

  return (
    <>
      <SEO
        title="PetOwner Pets| Pet Clinic"
        description="Manage your personal info, pets, and appointments."
      />
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          My Pets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPets.map((pet: any) => (
            <div
              key={pet._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <img
                src={pet.image?.secure_url}
                alt={pet.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />

              <h4
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--color-primary)" }}
              >
                {pet.name}
              </h4>
              <span className="text-sm px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full">
                {pet.category?.name}
              </span>

              <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <FaCalendar style={{ color: "var(--color-primary)" }} />
                  Age: <span className="font-medium">{pet.age} years</span>
                </p>

                <p className="flex items-center gap-2">
                  <FaWeight style={{ color: "var(--color-primary)" }} />
                  Weight: <span className="font-medium">{pet.weight} kg</span>
                </p>

                {pet.allergies?.length > 0 && (
                  <p>
                    Allergies:{" "}
                    <span className="font-medium">
                      {pet.allergies.join(", ")}
                    </span>
                  </p>
                )}
              </div>

              {/* vaccinations */}
              {pet.vaccinationHistory?.length > 0 && (
                <div className="mt-4 border-t border-gray-300 dark:border-gray-600 pt-3">
                  <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FaSyringe style={{ color: "var(--color-primary)" }} />
                    Vaccinations
                  </h5>

                  <div className="space-y-1">
                    {pet.vaccinationHistory.map((v: any) => (
                      <div
                        key={v._id}
                        className="text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded-md"
                      >
                        <p className="font-semibold">{v.vaccine?.name}</p>
                        <p>Date: {new Date(v.date).toLocaleDateString()}</p>
                        <p>
                          Next Dose: {new Date(v.nextDose).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <SharedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        maxVisiblePages={5}
      />
    </>
  );
}
