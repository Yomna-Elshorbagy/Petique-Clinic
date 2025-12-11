import React from "react";
import VaccinationStats from "./Components/VaccinationsState";
import VaccinationTable from "./Components/VaccinationTable";

export default function Vaccinations() {
  return (
    <>
      <div className="flex flex-col gap-8">
        <VaccinationStats />
        <VaccinationTable />
      </div>
    </>
  );
}
