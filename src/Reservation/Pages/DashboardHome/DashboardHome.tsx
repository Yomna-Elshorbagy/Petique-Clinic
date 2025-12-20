import { useState } from "react";
import OverviewStats from "./Components/OverviewStats";
import AllReservationsPage from "./Components/AllReservationsPage";
import QuickActionsPanel from "./Components/QuickActionsPanel";
import { useAllPets } from "../../../Hooks/Pets/UsePets";
import AddPetModal from "../Animals/Components/AddPetModal";
import VaccinatePetModal from "../Vaccination/Components/VaccinatePetModal";
import SEO from "../../../Components/SEO/SEO";
import AddReservationModal2 from "../ResevationPet/Components/AddReservationModel2";

export default function DashboardHome() {
  const [openAddPet, setOpenAddPet] = useState(false);
  const [openVaccinate, setOpenVaccinate] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: petsData, refetch } = useAllPets();
  const pets = petsData || [];

  return (
    <div className="p-6">
      <SEO
        title="Reservation Overview | Dashboard Petique Clinic"
        description="Overview of all reservations, schedules, and booking activity at Petique Clinic."
      />

      <OverviewStats />

      <AddPetModal
        isOpen={openAddPet}
        onClose={() => setOpenAddPet(false)}
        onSuccess={() => {
          setOpenAddPet(false);
          refetch();
        }}
      />

      <VaccinatePetModal
        pets={pets}
        isOpen={openVaccinate}
        onClose={() => setOpenVaccinate(false)}
      />

      <AddReservationModal2
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        <div className="lg:col-span-4">
          <AllReservationsPage />
        </div>

        <div className="lg:col-span-1">
          <QuickActionsPanel
            onNewAppointment={() => setIsAddModalOpen(true)}
            onRegisterPet={() => setOpenAddPet(true)}
            onScheduleVaccination={() => setOpenVaccinate(true)}
          />
        </div>
      </div>
    </div>
  );
}
