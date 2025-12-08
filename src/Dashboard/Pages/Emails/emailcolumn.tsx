import type { TableColumn } from "react-data-table-component";
import type { IContact } from "../../../Interfaces/IContact ";
import { FaEye, FaReply, FaTrash, FaTrashAlt, FaEdit } from "react-icons/fa";



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

}): TableColumn<IContact>[] =>  [
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
     { name: "Full Name", selector: (row) => row.fullName, sortable: true, width: "160px" },
  { name: "Email", selector: (row) => row.email,  width: "150px" },
  { name: "Category", selector: (row) => row.category },
  {
  name: "Urgency",
  selector: (row) => row.urgency,
  cell: (row) => {
    let colorClass = "";
    switch (row.urgency) {
      case "emergency":
        colorClass = "text-red-700 font-semibold";
        break;
      case "high":
        colorClass = "text-red-500 font-semibold";
        break;
      case "medium":
        colorClass = "text-orange-500 font-semibold";
        break;
      case "low":
      default:
        colorClass = "text-green-600 font-semibold";
        break;
    }

    const displayText =
      row.urgency.charAt(0).toUpperCase() + row.urgency.slice(1);

    return <span className={colorClass}>{displayText}</span>;
  },
},

{ 
  name: "Pet Age", 
  selector: (row) => row.petAge ? `${row.petAge} month` : "—" 
},
{ name: "Message", selector: (row) => row.message, grow: 2 },
{
  name: "Reply Status",
  selector: (row) => row.replyStatus,
  cell: (row) => {
    let colorClass = "";

    switch (row.replyStatus) {
      case "replied":
        colorClass = "text-green-600 font-semibold";
        break;
      case "inProgress":
        colorClass = "text-blue-600 font-semibold";
        break;
      case "pending":
      default:
        colorClass = "text-orange-500 font-semibold";
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
  cell: (row) => {
    const hasReply = !!row.replyMessage;
    return <span className={hasReply ? "text-green-600" : "text-gray-400"}>{row.replyMessage || "—"}</span>;
  },
},

{
  name: "Actions",
  width: "250px", 
  cell: (row) => (
    <div className="flex gap-2">
      {/* View Button */}
      <button
      onClick={() =>  openPreviewModal(row)}
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        <FaEye />
      </button>

      {/* Reply Button */}
      <button
onClick={() => openReplyModal(row)}
 
       className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        <FaReply />
      </button>

      {/* Edit Button */}
      <button
        onClick={() => handleEdit(row)}
        className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
      >
        <FaEdit />
      </button>

      {/* Soft Delete */}
      {!row.isDeleted && (
        <button
          onClick={() => handleSoftDelete(row._id)}
          className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          <FaTrashAlt />
        </button>
      )}

      {/* Hard Delete */}
      <button
        onClick={() => handleHardDelete(row._id)}
        className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        <FaTrash />
      </button>
    </div>
  ),
}


]