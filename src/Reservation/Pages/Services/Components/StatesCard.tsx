import { FaStethoscope, FaChartLine, FaStar, FaCalendarCheck } from "react-icons/fa";

interface StatsProps {
  stats: {
    total: number;
    month: number;
    revenue: number;
    rating: number;
  };
}

export default function StatsCards({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      {/* total Services */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="bg-[#FAF5F2] p-4 rounded-full text-[#86654F]">
          <FaStethoscope className="text-2xl" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-[#A98770] text-sm font-medium">Total Services</p>
        </div>
      </div>

      {/* this Month */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="bg-[#FAF5F2] p-4 rounded-full text-[#86654F]">
          <FaCalendarCheck className="text-2xl" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-800">{stats.month}</p>
          <p className="text-[#A98770] text-sm font-medium">This Month</p>
        </div>
      </div>

      {/* revenue */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="bg-[#FAF5F2] p-4 rounded-full text-[#86654F]">
          <FaChartLine className="text-2xl" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-800">${(stats.revenue / 1000).toFixed(1)}k</p>
          <p className="text-[#A98770] text-sm font-medium">Revenue</p>
        </div>
      </div>

      {/* avg Rating */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className="bg-[#FAF5F2] p-4 rounded-full text-[#86654F]">
          <FaStar className="text-2xl" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-800">{stats.rating}</p>
          <p className="text-[#A98770] text-sm font-medium">Avg Rating</p>
        </div>
      </div>

    </div>
  );
}
