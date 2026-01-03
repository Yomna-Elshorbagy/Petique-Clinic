import {
  FaPaw,
  FaWeight,
  FaCalendar,
  FaSyringe,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { useState } from "react";
import { useUserPets } from "../../Hooks/UserProfile/useUserPets";
import SEO from "../SEO/SEO";
import SharedPagination from "./components/SharedPagination";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useSoftDeletePet, useUpdatePet } from "../../Hooks/Pets/UsePets";
import EditPetModal from "./components/EditPetModal";

export default function UserPets() {
  const { t } = useTranslation();
  const { data: pets = [], isLoading, isError } = useUserPets();
  const { mutate: updatePet, isPending: updating } = useUpdatePet();
  const { mutate: deletePet } = useSoftDeletePet();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPet, setSelectedPet] = useState<any | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(pets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPets = pets.slice(startIndex, endIndex);

  if (isLoading) return <LoaderPage />;

  if (isError)
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        {t("userProfile.pets.error")}
      </div>
    );

  if (!pets.length)
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        <FaPaw size={40} className="mx-auto mb-3 opacity-60" />
        <p>{t("userProfile.pets.empty")}</p>
      </div>
    );

  const handleDelete = (id: string) => {
    Swal.fire({
      title: t("userProfile.common.deleteConfirmTitle"),
      text: t("userProfile.common.deleteConfirmText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("userProfile.common.yesDelete"),
      cancelButtonText: t("userProfile.common.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        deletePet(id);
      }
    });
  };

  const handleEditSubmit = (id: string, formData: FormData) => {
    updatePet(
      { id, formData },
      {
        onSuccess: () => {
          setOpenEdit(false);
          setSelectedPet(null);
        },
      }
    );
  };

  return (
    <>
      <SEO
        title="PetOwner Pets | Pet Clinic"
        description="Manage your personal info, pets, and appointments."
      />

      <div>
        <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] mb-4">
          {t("userProfile.pets.title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPets.map((pet: any) => (
            <div
              key={pet._id}
              className="relative bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] shadow-md rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              {/* ACTION ICONS */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedPet(pet);
                    setOpenEdit(true);
                  }}
                  className="p-2 rounded-full bg-[#F2A056]/20 hover:bg-[#F2A056]/40 text-[#e9a66f]"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDelete(pet._id)}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                >
                  <FaTrash />
                </button>
              </div>

              <img
                src={pet.image?.secure_url}
                alt={pet.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />

              <h4 className="text-xl font-semibold mb-2 text-[#e9a66f]">
                {pet.name}
              </h4>

              <span className="text-sm px-3 py-1 bg-[#F2A056]/20 text-[#e9a66f] rounded-full">
                {pet.category?.name}
              </span>

              <div className="mt-4 space-y-2">
                <p className="flex items-center gap-2">
                  <FaCalendar /> {t("userProfile.personalInfo.age") || "Age"}:{" "}
                  <span className="font-medium">
                    {t("userProfile.pets.age", { age: pet.age })}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <FaWeight /> {t("userProfile.addPet.placeholders.weight")}:{" "}
                  <span className="font-medium">
                    {t("userProfile.pets.weight", { weight: pet.weight })}
                  </span>
                </p>
                {pet.allergies?.length > 0 && (
                  <div className="mt-2">
                    <h5 className="font-medium mb-1">
                      {t("userProfile.pets.allergies")}
                    </h5>
                    <ul className="list-disc list-inside space-y-1">
                      {pet.allergies.map((allergy: string, index: number) => (
                        <li key={index}>{allergy}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {pet.vaccinationHistory?.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <FaSyringe /> {t("userProfile.pets.vaccinations")}
                  </h5>

                  {pet.vaccinationHistory.map((v: any) => (
                    <div
                      key={v._id}
                      className="text-sm bg-[var(--color-bg-cream)] p-2 rounded-md mb-1"
                    >
                      <p className="font-semibold">{v.vaccine?.name}</p>
                      <p>
                        {t("userProfile.common.date")}:{" "}
                        {new Date(v.date).toLocaleDateString()}
                      </p>
                      <p>
                        {t("userProfile.pets.nextDose")}:{" "}
                        {new Date(v.nextDose).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
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

      {/* EDIT MODAL */}
      <EditPetModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedPet(null);
        }}
        pet={selectedPet}
        onSubmit={handleEditSubmit}
        loading={updating}
      />
    </>
  );
}
