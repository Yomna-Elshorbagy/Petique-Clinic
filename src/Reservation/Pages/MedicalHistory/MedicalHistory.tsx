import React from "react";
import ReactECharts from "echarts-for-react";
import { FaSyringe, FaDog } from "react-icons/fa";

import { COLORS } from "./Shared/Colors";
import StatCard from "./Shared/StatCard";
import {
  usePetsPerCategory,
  useTotalPets,
  useVaccinationStatus,
} from "../../../Hooks/Reservation/useanalytics";
import TopVaccinatedCategoriesChart from "./Components/TopVaccinatedCategoriesChart";
import DoctorWorkloadChart from "./Components/DoctorWorkloadChart";
import MonthlyReservationsTrendChart from "./Components/MonthlyReservationsTrend";
import RevenueChart from "../../../Dashboard/Pages/OverView/Components/RevenueChart";

// ===== Base options for all pies =====
export const pieBaseOptions = {
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c} ({d}%)",
  },
  legend: {
    bottom: 0,
    textStyle: {
      color: COLORS.textDark,
      fontSize: 12,
    },
  },
};

const MedicalHistory: React.FC = () => {
  const { data: totalPets } = useTotalPets();
  const { data: petsPerCategory } = usePetsPerCategory();
  const { data: vaccinationStatus } = useVaccinationStatus();

  /* ===== PIE: Pets per Category ===== */
  const petsCategoryOption = {
    ...pieBaseOptions,
    series: [
      {
        name: "Pets",
        type: "pie",
        radius: ["40%", "70%"],
        itemStyle: {
          borderRadius: 10,
          borderColor: COLORS.background,
          borderWidth: 2,
        },
        label: { show: false },
        data:
          petsPerCategory?.data.map((c) => ({
            value: c.totalPets,
            name: c.categoryName,
          })) ?? [],
      },
    ],
    color: [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success],
  };

  /* ===== PIE: Vaccination Status ===== */
  const vaccinationStatusOption = {
    ...pieBaseOptions,
    series: [
      {
        name: "Vaccinations",
        type: "pie",
        radius: ["45%", "75%"],
        label: { formatter: "{b}: {c}" },
        data:
          vaccinationStatus?.data.map((v) => ({
            value: v.total,
            name: v._id,
          })) ?? [],
      },
    ],
    color: [COLORS.success, COLORS.warning, COLORS.danger],
  };

  return (
    <div
      className="p-8 min-h-screen"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* ===== HEADER ===== */}
      <h1 className="text-3xl font-bold mb-8 text-[#3E2C1C]">
        Medical History Dashboard
      </h1>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Pets"
          value={totalPets?.totalPets ?? 0}
          icon={<FaDog size={22} />}
        />

        <StatCard
          title="Vaccination Records"
          value={
            vaccinationStatus?.data.reduce((acc, v) => acc + v.total, 0) ?? 0
          }
          icon={<FaSyringe size={22} />}
        />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#3E2C1C]">
            Pets Per Category
          </h3>
          <ReactECharts option={petsCategoryOption} style={{ height: 320 }} />
        </div>
        <MonthlyReservationsTrendChart />

        <div className="rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#3E2C1C]">
            Vaccination Status
          </h3>
          <ReactECharts
            option={vaccinationStatusOption}
            style={{ height: 320 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="rounded-2xl p-6 bg-white shadow-sm">
          <DoctorWorkloadChart />
        </div>
        <div className="rounded-2xl p-6 bg-white shadow-sm">
          <TopVaccinatedCategoriesChart />
        </div>
      </div>
      <div className="pt-8">
        <RevenueChart />
      </div>
    </div>
  );
};

export default MedicalHistory;
