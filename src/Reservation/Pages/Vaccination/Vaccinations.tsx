import React, { useState } from "react";
import { FaPlus, FaSyringe } from "react-icons/fa";
import VaccinationStats from "./Components/VaccinationsState";
import VaccinationTable from "./Components/VaccinationTable";
import AddVaccinationModal from "./Components/AddVaccinationModal";
import VaccinatePetModal from "./Components/VaccinatePetModal";
import { useAllPets } from "../../../Hooks/Pets/UsePets";

export default function Vaccinations() {
  const [addOpen, setAddOpen] = useState(false);
  const [vaccinateOpen, setVaccinateOpen] = useState(false);

  const { data: petsData } = useAllPets();
  const pets = petsData || [];

  return (
    <>
      {/* ===== Modals ===== */}
      <AddVaccinationModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
      />

      <VaccinatePetModal
        pets={pets}
        isOpen={vaccinateOpen}
        onClose={() => setVaccinateOpen(false)}
      />

      {/* ===== Content ===== */}
      <div className="flex flex-col gap-8">

        {/* ===== Header ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-[#86654F] mb-1">
              Pet Vaccinations
            </h1>
            <p className="text-[#A98770]">
              Manage vaccines & pet vaccination history
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-[#86654F] text-white px-6 py-2.5 rounded-xl hover:bg-[#6d5240] transition-colors shadow-sm"
            >
              <FaPlus size={14} />
              <span>Add Vaccine</span>
            </button>

            <button
              onClick={() => setVaccinateOpen(true)}
              className="flex items-center gap-2 bg-[#86654F] text-white px-6 py-2.5 rounded-xl hover:bg-[#6d5240] transition-colors shadow-sm"
            >
              <FaSyringe size={14} />
              <span>Vaccinate Pet</span>
            </button>
          </div>
        </div>

        <VaccinationStats />
        <VaccinationTable />
      </div>
    </>
  );
}
