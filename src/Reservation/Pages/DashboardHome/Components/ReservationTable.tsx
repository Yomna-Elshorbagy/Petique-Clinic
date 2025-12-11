import { PawPrint, Clock } from "lucide-react";
import ReservationActions from "./ReservationActions";

const ReservationTable = ({
  items,
  onView,
  onEdit,
  softDeleteMutation,
  hardDeleteMutation,
}: any) => {
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-[#F3EDE6]">
      <table className="w-full">
        <thead className="bg-[#F6EFE7]">
          <tr>
            <th className="py-3 px-6 text-left text-[#4A3F35] font-semibold">
              Pet
            </th>
            <th className="py-3 px-6 text-left text-[#4A3F35] font-semibold">
              Owner
            </th>
            <th className="py-3 px-6 text-left text-[#4A3F35] font-semibold">
              Service
            </th>
            <th className="py-3 px-6 text-left text-[#4A3F35] font-semibold">
              Time
            </th>
            <th className="py-3 px-6 text-left text-[#4A3F35] font-semibold">
              Status
            </th>
            <th className="py-3 px-6 text-center text-[#4A3F35] font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((res: any) => (
            <tr
              key={res._id}
              className="border-b border-[#F3EDE6] hover:bg-[#FAF7F3] transition"
            >
              <td className="py-4 px-6 flex items-center gap-3">
                <div className="p-3 bg-[#F6EFE7] rounded-xl">
                  <PawPrint size={22} color="#A27A55" />
                </div>
                <span className="text-[#4A3F35] font-semibold">
                  {res.pet?.name}
                </span>
              </td>

              <td className="py-4 px-6">{res.petOwner?.userName}</td>

              <td className="py-4 px-6 text-[#C1826A] font-medium">
                {res.service?.title}
              </td>

              <td className="py-4 px-6 flex items-center gap-2">
                <Clock size={15} className="text-[#A39A90]" />
                <span className="font-medium text-[#4A3F35]">
                  {res.timeSlot}
                </span>
              </td>

              <td className="py-4 px-6">
                <span
                  className={`
                    px-3 py-1 text-xs rounded-full capitalize font-semibold
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
              </td>

              <td className="py-4 px-6 text-center">
                <ReservationActions
                  res={res}
                  onView={onView}
                  onEdit={onEdit}
                  softDeleteMutation={softDeleteMutation}
                  hardDeleteMutation={hardDeleteMutation}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
