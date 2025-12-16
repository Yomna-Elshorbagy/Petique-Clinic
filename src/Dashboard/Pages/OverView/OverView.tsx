import React from "react";
import RevenueChart from "./Components/RevenueChart";
import TopSellingProducts from "../Reports/Components/TopSellingProducts";
import GenderPieChart from "./Components/GenderChart";
import RolesBarChart from "./Components/RolesChart";

const OverView = () => {
    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        Based on Analysis
                    </h1>
                    <p className="text-[var(--color-text-muted)]">
                        Detailed overview of your clinic's performance
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* <div className="lg:col-span-3"> */}
                    {/* <RevenueChart /> */}
                    <GenderPieChart/>
                    <RolesBarChart/>
                {/* </div> */}
            </div>
        </div>
    );
};

export default OverView;

