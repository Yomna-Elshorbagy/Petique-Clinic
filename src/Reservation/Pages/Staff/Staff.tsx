import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { FaArchive, FaPlus, FaSearch } from "react-icons/fa";
import {
  getAllEmployeesStaff,
  deleteEmployeeStaff,
  softDeleteEmployeeStaff,
} from "../../../Apis/StaffApis";
import { useState } from "react";
import AddEmployeeeModal from "./Components/AddEmployeeModel";
import Swal from "sweetalert2";
import EditEmployeeModal from "./Components/EditEmployeeModel";
import type { IUser } from "../../../Interfaces/IUser";
import { useEmployeeSearch } from "./Hook/UseEmployeeSearch";
import { useLocalPagination } from "../../Componenst/Pagination/UsePagination";
import Pagination from "../../Componenst/Pagination/Pagination";

export default function Staff() {

   const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IUser | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["staff"],
    queryFn: getAllEmployeesStaff,
  });

  const { search, setSearch, filtered } = useEmployeeSearch(data || []);
  const { page, totalPages, paginatedItems, goToPage } = useLocalPagination(
    filtered,
    5
  );

  const queryClient = useQueryClient();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };


  function handleSuccess(): void {
    queryClient.invalidateQueries({ queryKey: ["staff"] });
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  }


  const handleEdit = (employee: IUser) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  // softdelete

  const handleSoftDeleteEmployee = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Archive employee?",
        text: "This will soft-delete the employee. You can restore them later.",
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

      await softDeleteEmployeeStaff(id);

      Swal.close();
      await Swal.fire({
        title: "Archived",
        text: "Employee was archived successfully.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["staff"] });
    } catch (error: unknown) {
      Swal.close();
      const e = error as { response?: { data?: { message?: string } } };
      Swal.fire({
        title: "Error",
        text: e.response?.data?.message || "Failed to delete employee.",
        icon: "error",
      });
    }
  };

  // Harddelete

  const handleHardDeleteEmployee = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete permanently?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "#F87171",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await deleteEmployeeStaff(id);

      Swal.close();
      await Swal.fire({
        title: "Deleted",
        text: "Employee was deleted permanently.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["staff"] });
    } catch (error: unknown) {
      Swal.close();
      const e = error as { response?: { data?: { message?: string } } };

      Swal.fire({
        title: "Error",
        text: e.response?.data?.message || "Failed to delete employee.",
        icon: "error",
      });
    }
  };


  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#86654F] mb-1">Staff</h1>
          <p className="text-[#A98770]">Our Staff</p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#86654F] text-white px-6 py-2.5 rounded-xl hover:bg-[#6d5240] transition-colors shadow-sm"
          onClick={handleOpenModal}
        >
          <FaPlus size={14} />
          <span>Add New Employee</span>
        </button>
      </div>

      <div className="relative flex-1 mb-10">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98770]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search staff..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FCF9F4] border-none focus:ring-2 focus:ring-[#A98770]/50 text-[#86654F] placeholder-[#A98770]/70 shadow-sm"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "#FBF9F6" }}
      >
        <table className="w-full">
          <thead style={{ background: "#D0C6BE" }}>
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="p-5">Employee</th>
              <th className="p-5">Email</th>
              <th className="p-5">Mobile</th>
              <th className="p-5">Gender</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {isLoading && (
              <tr>
                <td className="p-5 text-center" colSpan={5}>
                  Loading...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td className="p-5 text-center text-red-500" colSpan={5}>
                  Something went wrong
                </td>
              </tr>
            )}

            {paginatedItems?.map((emp: IUser) => (
              <motion.tr
                key={emp._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  type: "spring",
                  stiffness: 240,
                  damping: 22,
                }}
                whileHover={{ scale: 1.01 }}
                className="bg-transparent"
              >
                {/*Empolyee */}
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover bg-gray-200"
                      src={
                        emp.image?.secure_url ||
                        "https://via.placeholder.com/40"
                      }
                    />
                    <span className="font-medium text-gray-900">
                      {emp.userName}
                    </span>
                  </div>
                </td>

                {/*Email*/}
                <td className="p-5 text-gray-700">{emp.email}</td>

                {/*Mobile*/}
                <td className="p-5 text-gray-700">{emp.mobileNumber}</td>

                {/*Gender*/}
                <td className="p-5">
                  {emp.gender ? (
                    <span
                      className={`inline-block px-3 py-1 rounded-full border font-medium text-sm
        ${
          emp.gender.toLowerCase() === "female"
            ? "bg-pink-100 border-pink-500 text-pink-700"
            : "bg-blue-100 border-blue-500 text-blue-700"
        }`}
                    >
                      {emp.gender}
                    </span>
                  ) : (
                    ".."
                  )}
                </td>

                {/*actions*/}
                <td className="p-5">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="p-2 text-[#86654F] hover:bg-[#FCF9F4] rounded-lg transition-colors"
                      title="Edit Employee"
                      onClick={() => handleEdit(emp)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Permanently"
                      onClick={() => handleHardDeleteEmployee(emp._id)}
                    >
                      <Trash2 size={18} />
                    </button>

                    <button
                      className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Archive Empolyee"
                      onClick={() => handleSoftDeleteEmployee(emp._id)}
                    >
                      <FaArchive size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <AddEmployeeeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />

        {selectedEmployee && (
          <EditEmployeeModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSuccess={handleSuccess}
            employee={selectedEmployee}
          />
        )}
      </motion.div>

      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
    </>
  );
}
