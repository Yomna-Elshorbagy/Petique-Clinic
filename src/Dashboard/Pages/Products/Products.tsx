import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TableColumn } from "react-data-table-component";
import { getProducts } from "../../../Apis/ProductsDashboard";
import type { IProduct } from "../../../Interfaces/IProducts";
import DataTableComponent from "../../../Shared/Table/TableComponent";
import toast from "react-hot-toast";
import { FaEdit, FaEye, FaTrash, FaUndo } from "react-icons/fa";

export default function ProductsDashboared() {
  const [page, setPage] = useState(1);
  const [size] = useState(20);

  // ===> fetch products
  const { data, isLoading } = useQuery({
    queryKey: ["products", page, size],
    queryFn: () => getProducts(page, size),
  });

  // ====> action handlers
  const handleView = (product: IProduct) => {
    console.log("View product", product);
    toast.success(`View ${product.title}`);
  };

  const handleEdit = (product: IProduct) => {
    console.log("Edit product", product);
    toast.success(`Edit ${product.title}`);
  };

  const handleDelete = (id: string) => {
    if (!confirm("are you sure you want to permanently delete this product?"))
      return;
    console.log("Delete", id);
    toast.success("Deleted ");
  };

  const handleSoftDelete = (id: string) => {
    if (!confirm("Soft delete this product?")) return;
    console.log("Soft delete", id);
    toast.success("Soft deleted");
  };

  const columns: TableColumn<IProduct>[] = [
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
      name: "Image",
      cell: (row) => (
        <div className="flex items-center">
          <img
            src={row.imageCover?.secure_url || "/placeholder-100x100.png"}
            alt={row.title || "product"}
            style={{
              width: 48,
              height: 48,
              objectFit: "cover",
              borderRadius: 8,
              display: "block",
            }}
            onError={(e: any) => {
              e.currentTarget.src = "/placeholder-100x100.png";
            }}
          />
        </div>
      ),
      sortable: false,
      width: "72px",
    },
    {
      name: "Name",
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
    },
    {
      name: "Price",
      selector: (row) => `${row.price} EGP`,
      sortable: true,
      width: "120px",
    },
    {
      name: "Discount",
      selector: (row) => (row.discount ? `${row.discount} EGP` : "—"),
      sortable: true,
      width: "120px",
    },
    {
      name: "Status",
      cell: (row) => {
        const isOut = row.stock === 0 || row.status === "out";
        const isLow = row.stock > 0 && row.stock <= 5;
        const isAvailable = row.stock > 5 && row.status !== "out";

        const label = isOut ? "Out" : isLow ? "Low" : "Available";
        const bg = isOut
          ? "bg-red-100 text-red-700"
          : isLow
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700";

        return (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${bg}`}
            style={{
              minWidth: 70,
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {label}
          </span>
        );
      },
      sortable: true,
      width: "120px",
    },
    {
      name: "Category",
      selector: (row) => row.category?.name || "—",
      sortable: true,
      width: "140px",
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
      width: "100px",
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
      allowOverflow: true,
      button: true,
      width: "160px",
    },
  ];

  const tableData = data?.data || [];

  return (
    <div>
      <h2>Products</h2>

      <DataTableComponent<IProduct>
        title="Products List"
        columns={columns}
        data={tableData}
        loading={isLoading}
        onRowClicked={(row) => console.log("Clicked:", row)}
        pagination
      />
    </div>
  );
}
