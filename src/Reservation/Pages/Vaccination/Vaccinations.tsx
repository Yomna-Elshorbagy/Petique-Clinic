import React, { useState } from "react";
import { FaPlus, FaSyringe } from "react-icons/fa";
import { motion } from "framer-motion";
import VaccinationStats from "./Components/VaccinationsState";
import VaccinationTable from "./Components/VaccinationTable"; // pet records
import AddVaccinationModal from "./Components/AddVaccinationModal";
import VaccinatePetModal from "./Components/VaccinatePetModal";
import { useAllPets } from "../../../Hooks/Pets/UsePets";
import AllVaccinationsTable from "./Components/AllVaccinationsTable";
import SEO from "../../../Components/SEO/SEO";

type VaccinationTab = "pet" | "all";

export default function Vaccinations() {
  const [activeTab, setActiveTab] = useState<VaccinationTab>("pet");
  const [addOpen, setAddOpen] = useState(false);
  const [vaccinateOpen, setVaccinateOpen] = useState(false);

  const { data: petsData } = useAllPets();
  const pets = petsData || [];

  return (
    <>
      <SEO
        title="Vaccinations | Dashboard Petique Clinic"
        description="Manage vaccination services, schedules, and pet immunization records."
      />

      {/* ===== Modals ===== */}
      <AddVaccinationModal isOpen={addOpen} onClose={() => setAddOpen(false)} />

      <VaccinatePetModal
        pets={pets}
        isOpen={vaccinateOpen}
        onClose={() => setVaccinateOpen(false)}
      />

      <div className="flex flex-col gap-8">
        {/* ===== Header ===== */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#86654F]">Vaccinations</h1>
            <p className="text-[#A98770]">
              Manage pet vaccinations & vaccine catalog
            </p>
          </div>

          {/* ===== Actions ===== */}
          <div className="flex gap-3">
            {activeTab === "all" && (
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 bg-[#86654F] text-white px-6 py-2.5 rounded-xl"
              >
                <FaPlus size={14} />
                Add Vaccine
              </button>
            )}

            {activeTab === "pet" && (
              <button
                onClick={() => setVaccinateOpen(true)}
                className="flex items-center gap-2 bg-[#86654F] text-white px-6 py-2.5 rounded-xl"
              >
                <FaSyringe size={14} />
                Vaccinate Pet
              </button>
            )}
          </div>
        </div>

        <VaccinationStats />

        {/* ===== Tabs ===== */}
        <div className="flex gap-2 bg-[#EFE9E4] p-1 rounded-xl w-fit">
          {["pet", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as VaccinationTab)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all
                ${
                  activeTab === tab
                    ? "bg-white text-[#86654F] shadow"
                    : "text-[#A98770]"
                }`}
            >
              {tab === "pet" ? "Pet Vaccinations" : "All Vaccinations"}
            </button>
          ))}
        </div>

        {/* ===== Content ===== */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === "pet" ? (
            <VaccinationTable />
          ) : (
            <AllVaccinationsTable />
          )}
        </motion.div>
      </div>
    </>
  );
}
