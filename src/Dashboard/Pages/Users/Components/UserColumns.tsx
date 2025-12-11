import type { TableColumn } from "react-data-table-component";
import { FaEye, FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import type { IUser } from "../../../../Interfaces/IUser";

export const UserColumns = (handleView: (user: IUser) => void , handleEdit: (user: IUser) => void , handleSoftDelete: (id: string) => void,
  handleDelete: (id: string) => void) : TableColumn<IUser>[] => [
  {
    name: "Image",
    selector: (row) => row.image?.secure_url,
    cell: (row) => (
      <img
        src={row.image?.secure_url}
        alt="user"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    ),
    width: "80px",
  },

  {
      name: "ID",
      selector: (row) => {
        const id = row._id || "";
        const lastFive = id.slice(-5);
        return `#${lastFive}`;
      },
      sortable: true,
      width: "90px",
    },

  {
    name: "Name",
    selector: (row) => row.userName,
    sortable: true,
    width: "150px",
  },

  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },

  {
    name: "Phone",
    selector: (row) => row.mobileNumber || "—",
    sortable: true,
  },

  {
    name: "Actions",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <button
        onClick={() => handleView(row)}
        className="p-2 rounded-lg bg-blue-50 text-blue-600 
         hover:bg-blue-100 transition-all duration-200
        hover:scale-[1.07] active:scale-[0.96]
        shadow-sm hover:shadow-md border border-blue-100"
        title="View"
    >
        <FaEye size={15} />
        </button>
      
        <button
          onClick={() => handleEdit(row)}
        className="p-2 rounded-lg bg-green-50 text-green-600 
         hover:bg-green-100 transition-all duration-200
        hover:scale-[1.07] active:scale-[0.96]
        shadow-sm hover:shadow-md border border-green-100"
        title="Edit"
        >
        <FaEdit size={15} />
        </button>
      
        <button
        onClick={() => handleSoftDelete(row._id)}
        className="p-2 rounded-lg bg-yellow-50 text-yellow-600 
         hover:bg-yellow-100 transition-all duration-200
        hover:scale-[1.07] active:scale-[0.96]
        shadow-sm hover:shadow-md border border-yellow-100"
        title="Soft Delete"
        >
        <FaUndo size={15} />
        </button>
      
        <button
        onClick={() => handleDelete(row._id)}
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
    ignoreRowClick: true,
  },
];