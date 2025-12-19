import React from "react";
import ReactECharts from "echarts-for-react";
import { useDoctorWorkload } from "../../../../Hooks/Reservation/useanalytics";
import { COLORS } from "../Shared/Colors";
import { barBaseOptions } from "../Shared/Charts";
import type { DoctorWorkload } from "../../../../Hooks/Reservation/Ianalysis";

const DoctorWorkloadChart: React.FC = () => {
  const { data } = useDoctorWorkload();

  const option = {
    ...barBaseOptions,
    xAxis: {
      ...barBaseOptions.xAxis,
      data: data?.data.map((d: DoctorWorkload) => d.doctor.userName) ?? [],
    },
    series: [
      {
        name: "Appointments",
        type: "bar",
        barWidth: "45%",
        data: data?.data.map((d: DoctorWorkload) => d.totalAppointments) ?? [],
        itemStyle: {
          color: COLORS.successDark,
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
  };

  return (
    <div className="rounded-2xl p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-[#3E2C1C]">
        Doctor Workload
      </h3>
      <ReactECharts option={option} style={{ height: 320 }} />
    </div>
  );
};

export default DoctorWorkloadChart;
