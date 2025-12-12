import type { TableColumn } from "react-data-table-component";
import type { IContact } from "../../../Interfaces/IContact ";
import { FaEye, FaReply, FaTrash, FaUndo, FaEdit } from "react-icons/fa";

export const contactColumns = ({
  handleSoftDelete,
  handleHardDelete,
  openReplyModal,
  handleEdit,
  openPreviewModal,
}: {
  handleSoftDelete: (id: string) => void;
  handleHardDelete: (id: string) => void;
  openReplyModal: (contact: IContact) => void;
  handleEdit: (contact: IContact) => void;
  openPreviewModal: (contact: IContact) => void;
}): TableColumn<IContact>[] => [
  {
    name: "ID",
    cell: (row) => {
      const id = row._id || "";
      const lastFive = id.slice(-5);
      return `#${lastFive}`;
    },
    sortable: true,
    width: "90px",
  },
  {
    name: "Full Name",
    selector: (row) => row.fullName,
    sortable: true,
    width: "160px",
  },
  { name: "Email", selector: (row) => row.email },
  { name: "Category", selector: (row) => row.category },
  {
    name: "Urgency",
    selector: (row) => row.urgency,
    width: "140px",
    cell: (row) => {
      let colorClass = "";
      switch (row.urgency) {
        case "emergency":
          colorClass =
            "bg-red-100 text-red-700 border border-red-400 rounded-full px-3 py-1 text-xs font-semibold";
          break;

        case "high":
          colorClass =
            "bg-red-50 text-red-600 border border-red-300 rounded-full px-3 py-1 text-xs font-semibold";
          break;

        case "medium":
          colorClass =
            "bg-orange-100 text-orange-700 border border-orange-400 rounded-full px-3 py-1 text-xs font-semibold";
          break;

        case "low":
        default:
          colorClass =
            "bg-green-100 text-green-700 border border-green-400 rounded-full px-3 py-1 text-xs font-semibold";
          break;
      }

      const displayText =
        row.urgency.charAt(0).toUpperCase() + row.urgency.slice(1);

      return <span className={colorClass}>{displayText}</span>;
    },
  },

  {
    name: "Pet Age",
    selector: (row) => (row.petAge ? `${row.petAge} month` : "—"),
  },
  { name: "Message", selector: (row) => row.message, grow: 2 },
  {
    name: "Reply Status",
    selector: (row) => row.replyStatus,
    width: "160px",
    cell: (row) => {
      let colorClass = "";

      switch (row.replyStatus) {
        case "replied":
          colorClass =
            "bg-green-100 text-green-700 border border-green-400 rounded-full px-3 py-1 text-xs font-semibold";
          break;

        case "inProgress":
          colorClass =
            "bg-blue-100 text-blue-700 border border-blue-400 rounded-full px-3 py-1 text-xs font-semibold";
          break;

        case "pending":
        default:
          colorClass =
            "bg-orange-100 text-orange-700 border border-orange-400 rounded-full px-3 py-1 text-xs font-semibold";
          break;
      }

      const displayText =
        row.replyStatus.charAt(0).toUpperCase() + row.replyStatus.slice(1);

      return <span className={colorClass}>{displayText}</span>;
    },
  },

  {
    name: "Reply Message",
    selector: (row) => row.replyMessage || "—",
    grow: 2,
    width: "130px",
    cell: (row) => {
      const hasReply = !!row.replyMessage;
      return (
        <span className={hasReply ? "text-green-600" : "text-gray-400"}>
          {row.replyMessage || "—"}
        </span>
      );
    },
  },

  {
    name: "Actions",
    width: "250px",
    cell: (row) => (
      <div className="flex gap-2">
        {/* View Button */}
        <button
          onClick={() => openPreviewModal(row)}
          className="p-2 rounded-lg bg-blue-50 text-blue-600 
               hover:bg-blue-100 transition-all duration-200
               hover:scale-[1.07] active:scale-[0.96]
               shadow-sm hover:shadow-md border border-blue-100"
          title="Preview"
        >
          <FaEye />
        </button>

        {/* Reply Button */}
        <button
          onClick={() => openReplyModal(row)}
          className="p-2 rounded-lg bg-green-50 text-green-600 
               hover:bg-green-100 transition-all duration-200
               hover:scale-[1.07] active:scale-[0.96]
               shadow-sm hover:shadow-md border border-green-100"
          title="Reply"
        >
          <FaReply />
        </button>

        {/* Edit Button */}
        <button
          onClick={() => handleEdit(row)}
          className="p-2 rounded-lg bg-orange-50 text-orange-600 
               hover:bg-orange-100 transition-all duration-200
               hover:scale-[1.07] active:scale-[0.96]
               shadow-sm hover:shadow-md border border-orange-100"
          title="Edite"
        >
          <FaEdit />
        </button>

        {/* Soft Delete */}
        {!row.isDeleted && (
          <button
            onClick={() => handleSoftDelete(row._id)}
            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 
                         hover:bg-yellow-100 transition-all duration-200
                         hover:scale-[1.07] active:scale-[0.96]
                         shadow-sm hover:shadow-md border border-yellow-100"
            title="Archive"
          >
            <FaUndo size={15} />
          </button>
        )}

        {/* Hard Delete */}
        <button
          onClick={() => handleHardDelete(row._id)}
          className="p-2 rounded-lg bg-red-50 text-red-600 
               hover:bg-red-100 transition-all duration-200
               hover:scale-[1.07] active:scale-[0.96]
               shadow-sm hover:shadow-md border border-red-100"
          title="Delete"
        >
          <FaTrash size={15} />
        </button>
      </div>
    ),
  },
];
