import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaThLarge, FaList } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  getAllDoctors,
  softDeleteDoctor,
  deleteDoctor,
} from "../../../Apis/DoctoresApis";
import AddDoctorModal from "./Components/AddDoctorModal";
import DoctorCard from "./Components/DoctorCard";
import { useDoctorSearch } from "./Hook/UseDoctorSearch";
import type { IUser } from "../../../Interfaces/IUser";

export default function Doctors() {
  const [doctors, setDoctors] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { search, setSearch, filtered } = useDoctorSearch(doctors);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);


  const handleSoftDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Archive doctor?",
        text: "This will soft-delete the doctor. You can restore them later.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, archive",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "#F9BE91",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Archiving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await softDeleteDoctor(id);

      Swal.close();
      await Swal.fire({
        title: "Archived",
        text: "Doctor was archived successfully.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      await fetchDoctors();
    } catch (error: any) {
      console.error("Soft delete failed", error);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to archive doctor.",
        icon: "error",
      });
    }
  };

  const handleHardDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete permanently?",
        text: "This action cannot be undone.",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "#d33",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await deleteDoctor(id);

      Swal.close();
      await Swal.fire({
        title: "Deleted",
        text: "Doctor was permanently deleted.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      await fetchDoctors();
    } catch (error: any) {
      console.error("Hard delete failed", error);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to delete doctor.",
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#ECE7E2] p-6 font-['Inter']">
      <AddDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDoctors}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#86654F] mb-1">Doctors</h1>
          <p className="text-[#A98770]">Our veterinary team</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#86654F] text-white px-6 py-2.5 rounded-xl hover:bg-[#6d5240] transition-colors shadow-sm"
        >
          <FaPlus size={14} />
          <span>Add Doctor</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98770]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FCF9F4] border-none focus:ring-2 focus:ring-[#A98770]/50 text-[#86654F] placeholder-[#A98770]/70 shadow-sm"
          />
        </div>

        <div className="flex bg-[#FCF9F4] p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid"
                ? "bg-[#86654F] text-white shadow-sm"
                : "text-[#A98770] hover:bg-[#ECE7E2]"
              }`}
          >
            <FaThLarge size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list"
                ? "bg-[#86654F] text-white shadow-sm"
                : "text-[#A98770] hover:bg-[#ECE7E2]"
              }`}
          >
            <FaList size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#86654F]">
          Loading doctors...
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filtered.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              view={viewMode}
              onSoftDelete={handleSoftDelete}
              onHardDelete={handleHardDelete}
              onUpdate={fetchDoctors}
            />

          ))}
        </div>
      )}
    </div>
  );
}
