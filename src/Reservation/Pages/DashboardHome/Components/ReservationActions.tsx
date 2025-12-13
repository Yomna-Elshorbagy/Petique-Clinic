import { Eye, Edit } from "lucide-react";
import { FaArchive, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const ReservationActions = ({
  res,
  onView,
  onEdit,
  softDeleteMutation,
  hardDeleteMutation,
}: any) => {
  const handleSoftDelete = async () => {
    const result = await Swal.fire({
      title: "Archive reservation?",
      text: "This will soft-delete (archive) the reservation.",
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

    softDeleteMutation(
      { id: res._id },
      {
        onSuccess: () => {
          Swal.close();
          Swal.fire({
            title: "Archived",
            text: "Reservation archived successfully",
            icon: "success",
            timer: 1400,
            showConfirmButton: false,
          });
        },
        onError: (err: any) => {
          Swal.close();
          Swal.fire({
            title: "Error",
            text:
              err?.response?.data?.message || "Failed to archive reservation",
            icon: "error",
          });
        },
      }
    );
  };

  const handleHardDelete = async () => {
    const result = await Swal.fire({
      title: "Delete permanently?",
      text: "This cannot be undone.",
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

    hardDeleteMutation(
      { id: res._id },
      {
        onSuccess: () => {
          Swal.close();
          Swal.fire({
            title: "Deleted",
            text: "Reservation deleted successfully",
            icon: "success",
            timer: 1400,
            showConfirmButton: false,
          });
        },
        onError: (err: any) => {
          Swal.close();
          Swal.fire({
            title: "Error",
            text:
              err?.response?.data?.message || "Failed to delete reservation",
            icon: "error",
          });
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onView(res)}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <Eye size={18} className="text-[#6F665F]" />
      </button>

      <button
        onClick={() => onEdit(res)}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <Edit size={18} className="text-amber-600" />
      </button>

      <button
        className="p-1 rounded-full hover:bg-gray-100"
        onClick={handleSoftDelete}
      >
        <FaArchive size={18} className="text-gray-600" />
      </button>

      <button
        className="p-1 rounded-full hover:bg-gray-100"
        onClick={handleHardDelete}
      >
        <FaTrash size={18} className="text-red-700" />
      </button>
    </div>
  );
};

export default ReservationActions;
