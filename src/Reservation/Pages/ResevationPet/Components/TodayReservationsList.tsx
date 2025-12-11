import React from "react";
import { motion } from "framer-motion";
import { PawPrint, Clock, Eye, Edit } from "lucide-react";
import { FaArchive, FaTrash } from "react-icons/fa";

import { useTodayReservations } from "../../../../Hooks/Reservation/useReservation";
import { useLocalPagination } from "../../../Componenst/Pagination/UsePagination";
import Pagination from "../../../Componenst/Pagination/Pagination";

const TodayReservationsList: React.FC = () => {
  const { data: allReservations = [], isLoading } = useTodayReservations();

  const { page, totalPages, paginatedItems, goToPage } = useLocalPagination(
    allReservations,
    5
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="mt-6 flex flex-col gap-4">
      {paginatedItems.map((res: any, i: number) => (
        <motion.div
          key={res._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          className="bg-white rounded-3xl px-6 py-5 shadow-sm border border-[#F3EDE6] flex items-center justify-between hover:shadow-md transition-all duration-300"
        >
          {/* LEFT */}
          <div className="flex gap-4 items-start">
            <div className="p-4 rounded-2xl bg-[#F6EFE7] flex items-center justify-center shadow-sm">
              <PawPrint size={24} color="#A27A55" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h2 className="text-[18px] font-semibold text-[#4A3F35]">
                  {res.pet?.name}
                </h2>

                <span
                  className={`px-3 py-[4px] rounded-full text-xs capitalize font-medium
                    ${
                      res.status === "completed" &&
                      "bg-green-100 text-green-700"
                    }
                    ${
                      res.status === "pending" &&
                      "bg-orange-100 text-orange-700"
                    }
                    ${res.status === "cancelled" && "bg-red-100 text-red-700"}
                    ${res.status === "confirmed" && "bg-blue-100 text-blue-700"}
                  `}
                >
                  {res.status}
                </span>
              </div>

              <p className="text-sm text-[#8C827A]">{res.petOwner?.fullName}</p>

              <div className="flex items-center gap-3 mt-1 text-sm">
                <Clock size={15} className="text-[#A39A90]" />
                <span className="font-medium text-[#4A3F35]">
                  {res.timeSlot}
                </span>
                <span className="text-[#D29A84] font-medium">
                  {res.service?.name}
                </span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button className="p-1 rounded-full hover:bg-gray-100 transition">
              <Eye size={18} className="text-[#6F665F]" />
            </button>

            <button className="p-1 rounded-full hover:bg-gray-100 transition">
              <Edit size={18} className="text-blue-600" />
            </button>

            <button className="p-1 rounded-full hover:bg-gray-100 transition">
              <FaArchive size={18} className="text-orange-500" />
            </button>

            <button className="p-1 rounded-full hover:bg-gray-100 transition">
              <FaTrash size={18} className="text-red-600" />
            </button>
          </div>
        </motion.div>
      ))}

      {/* ===> pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
};

export default TodayReservationsList;
