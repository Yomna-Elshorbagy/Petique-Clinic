import { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

import ServiceCard from "./Components/ServiceCard";
import AddServiceModal from "./Components/AddServiceModal";
import EditServiceModal from "./Components/EditServiceModal";
import StatsCards from "./Components/StatesCard";
import Pagination from "../../Componenst/Pagination/Pagination";
import SEO from "../../../Components/SEO/SEO";

import {
  useServices,
  useSoftDeleteService,
  useDeleteService,
} from "../../../Hooks/Services/UseServices";

import { useServiceSearch } from "./Hooks/useServiceSearch";
import {
  useRevenueAnalysis,
  useTotalRevenueAnalysis,
} from "../../../Hooks/Reservation/useanalytics";

export default function ServiceDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);

  // ================= SERVICES =================
  const { data, isLoading } = useServices();
  const services = data?.data || [];

  const softDelete = useSoftDeleteService();
  const hardDelete = useDeleteService();

  const { search, setSearch, filtered } = useServiceSearch(services);

  // ================= ANALYTICS =================
  const { data: totalRevenueData, isLoading: totalRevenueLoading } =
    useTotalRevenueAnalysis();

  const { data: monthlyRevenueData, isLoading: monthlyRevenueLoading } =
    useRevenueAnalysis();

  const currentMonth = new Date().getMonth() + 1;

  const monthlyRevenue =
    monthlyRevenueData?.data?.find((m: any) => m.month === currentMonth)
      ?.totalRevenue || 0;

  const totalRevenue = totalRevenueData?.data?.totalRevenue || 0;

  // ===> stats
  const stats = {
    total: services.length,
    month: monthlyRevenue,
    revenue: totalRevenue,
  };

  // ===> filters
  const categories = [
    "All",
    "Consultations",
    "Preventive Care",
    "Hygiene",
    "Dental Care",
  ];

  const filteredServices =
    activeCategory === "All"
      ? filtered
      : filtered.filter(
          (s: any) => s.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  // ===> pagination
  const pageSize = 8;
  const totalPages = Math.ceil(filteredServices.length / pageSize);
  const paginated = filteredServices.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // ===> actions
  const handleSoftDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Move to Trash?",
      text: "This will soft-delete the service.",
      showCancelButton: true,
      confirmButtonColor: "#F9BE91",
    });

    if (!result.isConfirmed) return;
    softDelete.mutate(id);
  };

  const handleHardDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Permanently?",
      icon: "error",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;
    hardDelete.mutate(id);
  };

  // ===> render
  return (
    <div className="min-h-screen bg-[#ECE7E2] p-6">
      <SEO
        title="Services | Dashboard Petique Clinic"
        description="Manage veterinary services offered for reservations at Petique Clinic."
      />

      {/* ========= models ========= */}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditServiceModal
        isOpen={!!editId}
        onClose={() => setEditId(null)}
        serviceId={editId}
      />

      {/* ========= header ========= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#86654F]">Services</h1>
          <p className="text-[#A98770]">Manage clinic services and pricing</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#86654F] text-white px-5 py-2 rounded-xl"
        >
          <FaPlus /> Add Service
        </button>
      </div>

      {/* ========= stats ========= */}
      {totalRevenueLoading || monthlyRevenueLoading ? (
        <p className="text-center text-[#86654F] py-6">Loading analytics...</p>
      ) : (
        <StatsCards stats={stats} />
      )}

      {/* ========= search ========= */}
      <div className="relative flex-1 mb-6">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98770]" />
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-1/4 pl-11 pr-4 py-3 rounded-xl bg-[#FCF9F4] border-none focus:ring-2 focus:ring-[#A98770]/50 text-[#86654F] placeholder-[#A98770]/70 shadow-sm"
        />
      </div>

      {/* ========= categories ========= */}
      <div className="flex gap-3 mb-6 overflow-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setPage(1);
              setActiveCategory(cat);
            }}
            className={`px-6 py-2 rounded-full whitespace-nowrap ${
              activeCategory === cat
                ? "bg-[#A98770] text-white shadow"
                : "bg-[#FCF9F4] text-[#86654F]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ========= grid ========= */}
      {isLoading ? (
        <p className="text-center text-[#86654F] py-12">Loading services...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginated.map((service: any) => (
            <ServiceCard
              key={service._id}
              service={service}
              onSoftDelete={handleSoftDelete}
              onHardDelete={handleHardDelete}
              onEdit={setEditId}
            />
          ))}
        </div>
      )}

      {/* ========= pagination ========= */}
      {filteredServices.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
