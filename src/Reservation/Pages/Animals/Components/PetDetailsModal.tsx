import React, { useState } from "react";
import { FaTimes, FaSyringe } from "react-icons/fa";
import { Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  usePetById,
  useDeletePetVaccination,
} from "../../../../Hooks/Pets/UsePets";
import EditVaccinationModal from "../../Vaccination/Components/EditVaccinationModal";

interface Props {
  petId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PetDetailsModal({ petId, isOpen, onClose }: Props) {
  const { data: petData, refetch } = usePetById(petId || "");
  const deleteMutation = useDeletePetVaccination();
  const [editingVaccination, setEditingVaccination] = useState<any>(null);

  if (!isOpen || !petId) return null;

  const pet = petData;
  const vaccinations = pet?.vaccinationHistory || [];

  const handleDelete = (vaccination: any) => {
    const vaccinationId = vaccination._id || vaccination.vaccinationId;

    if (!vaccinationId) {
      console.error("Vaccination structure:", vaccination);
      Swal.fire(
        "Error",
        "Missing vaccination ID. Please check the console for details.",
        "error"
      );
      return;
    }

    if (!petId) {
      Swal.fire("Error", "Missing pet ID", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#86654F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(
          {
            petId: petId,
            vaccinationId: vaccinationId,
          },
          {
            onSuccess: () => {
              Swal.fire("Deleted!", "Vaccination has been deleted.", "success");
              refetch();
            },
            onError: (err: any) => {
              Swal.fire(
                "Error",
                err?.response?.data?.message || "Failed to delete vaccination",
                "error"
              );
            },
          }
        );
      }
    });
  };

  const handleEdit = (vaccination: any) => {
    const vaccinationId = vaccination._id || vaccination.vaccinationId;

    if (!vaccinationId) {
      console.error("Vaccination structure:", vaccination);
      Swal.fire(
        "Error",
        "Missing vaccination ID. Cannot edit this record.",
        "error"
      );
      return;
    }

    if (!petId) {
      Swal.fire("Error", "Missing pet ID", "error");
      return;
    }

    setEditingVaccination(vaccination);
  };

  return (
    <>
      {/* Edit Modal */}
      {editingVaccination &&
        (() => {
          const vaccinationId =
            editingVaccination._id || editingVaccination.vaccinationId || "";
          const vaccineId =
            typeof editingVaccination.vaccine === "string"
              ? editingVaccination.vaccine
              : editingVaccination.vaccine?._id || "";

          if (!vaccinationId) {
            console.error(
              "Cannot edit - missing vaccination ID:",
              editingVaccination
            );
            return null;
          }

          return (
            <EditVaccinationModal
              isOpen={!!editingVaccination}
              onClose={() => setEditingVaccination(null)}
              petId={petId}
              vaccinationId={vaccinationId}
              currentVaccineId={vaccineId}
              currentDoseNumber={editingVaccination.doseNumber || 1}
              currentDate={editingVaccination.date}
              onSuccess={() => {
                setEditingVaccination(null);
                refetch();
              }}
            />
          );
        })()}

      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-[#FCF9F4] w-full max-w-lg rounded-2xl shadow-xl overflow-auto max-h-[90vh]">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-[#86654F]">Pet Details</h2>
            <button onClick={onClose}>
              <FaTimes size={22} className="text-[#A98770]" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <img
                src={pet?.image?.secure_url}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-[#86654F]">
                  {pet?.name}
                </h3>
                <p className="text-[#A98770]">Age: {pet?.age}</p>
                <p className="text-[#A98770]">Weight: {pet?.weight} kg</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#86654F] mb-2">
                Allergies
              </h4>
              <p className="text-[#A98770]">
                {pet?.allergies?.join(", ") || "None"}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#86654F] mb-3">
                Vaccination History
              </h4>

              {vaccinations.length === 0 ? (
                <p className="text-[#A98770]">No vaccinations found.</p>
              ) : (
                <div className="space-y-3">
                  {vaccinations.map((v: any, index: number) => (
                    <div
                      key={v._id || index}
                      className="p-3 bg-white rounded-xl border"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FaSyringe className="text-[#A98770]" />
                            <span className="font-bold text-[#86654F]">
                              {v.vaccine?.name || "Unknown Vaccine"}
                            </span>
                          </div>
                          <p className="text-sm text-[#A98770]">
                            Dose: {v.doseNumber}
                          </p>
                          <p className="text-sm text-[#A98770]">
                            Given: {new Date(v.date).toLocaleDateString()}
                          </p>
                          {v.nextDose && (
                            <p className="text-sm text-[#A98770]">
                              Next Dose:{" "}
                              {new Date(v.nextDose).toLocaleDateString()}
                            </p>
                          )}
                          {v.status && (
                            <p className="text-xs mt-1">
                              <span
                                className={`px-2 py-1 rounded-full ${
                                  v.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : v.status === "scheduled"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {v.status}
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => handleEdit(v)}
                            className="p-2 text-[#86654F] hover:bg-[#FCF9F4] rounded-lg transition-colors"
                            title="Edit vaccination"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(v)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete vaccination"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
