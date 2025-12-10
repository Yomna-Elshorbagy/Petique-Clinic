import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getVaccinationRecords } from "../../../../Apis/PetApis";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface VaccinationRecord {
  petId: string;
  petName: string;
  petImage?: string;
  vaccineName?: string;
  date: string;
  nextDose?: string;
  status: "completed" | "scheduled" | "overdue";
}

const statusConfig = {
  completed: {
    label: "Completed",
    text: "text-green-600",
    border: "border-green-200",
    icon: <CheckCircle size={14} />,
  },
  scheduled: {
    label: "Scheduled",
    text: "text-orange-500",
    border: "border-orange-200",
    icon: <Clock size={14} />,
  },
  overdue: {
    label: "Overdue",
    text: "text-red-500",
    border: "border-red-200",
    icon: <AlertCircle size={14} />,
  },
};

const VaccinationTable = () => {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVaccinationRecords();
        setRecords(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
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
            <th className="p-5">Pet</th>
            <th className="p-5">Vaccine</th>
            <th className="p-5">Date</th>
            <th className="p-5">Status</th>
            <th className="p-5">Next Due</th>
            <th className="p-5 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {!loading &&
            records.map((record, index) => {
              const status = statusConfig[record.status];

              return (
                <motion.tr
                  key={`${record.petId}-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                    type: "spring",
                    stiffness: 240,
                    damping: 22,
                  }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-transparent"
                >
                  {/* ===> pet */}
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={record.petImage || "/pet-placeholder.png"}
                        alt={record.petName}
                        className="w-10 h-10 rounded-full object-cover bg-gray-200"
                      />
                      <span className="font-medium text-gray-900">
                        {record.petName}
                      </span>
                    </div>
                  </td>

                  {/* ===> vaccine */}
                  <td className="p-5 text-gray-700">
                    {record.vaccineName || "—"}
                  </td>

                  {/* ===> date */}
                  <td className="p-5 text-gray-700">
                    {new Date(record.date).toLocaleDateString()}
                  </td>

                  {/* ===> status */}
                  <td className="p-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 
                      rounded-full text-sm border 
                      ${status.text} ${status.border}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </td>

                  {/* ===> next due */}
                  <td className="p-5 text-gray-700">
                    {record.nextDose
                      ? new Date(record.nextDose).toLocaleDateString()
                      : "—"}
                  </td>

                  {/* ===> actions */}
                  <td className="p-5 text-right">
                    <button className="text-orange-500 hover:underline text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </motion.tr>
              );
            })}

          {/* ===> In case of no vaccinations*/}
          {!loading && records.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-10 text-gray-500">
                No vaccination records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default VaccinationTable;
