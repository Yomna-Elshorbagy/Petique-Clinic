import { useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TableColumn } from "react-data-table-component";
import {
  deleteProduct,
  getProducts,
  softDeleteProducts,
} from "../../../Apis/ProductsDashboard";
import type { IProduct } from "../../../Interfaces/IProducts";
import DataTableComponent from "../../../Shared/Table/TableComponent";
import toast from "react-hot-toast";
import { FaEdit, FaEye, FaPlusCircle, FaTrash, FaUndo } from "react-icons/fa";
import Swal from "sweetalert2";
import ProductModal from "./Components/viewProductModle";
import EditProductModal from "./Components/EditProductModel";
import AddProductModal from "./Components/AddProductModel";

export default function ProductsDashboared() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);

  // ===> fetch products
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  // ====> action handlers
  const handleView = (product: IProduct) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleSoftDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return toast.error("Unauthorized");
      const result = await Swal.fire({
        title: "Archive category?",
        text: "This will soft-delete (archive) the category.",
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

      await softDeleteProducts(id, token);

      Swal.close();
      await Swal.fire({
        title: "Archived",
        text: "Category was archived successfully.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error: any) {
      console.error("Soft delete failed", error);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to archive category.",
        icon: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete permanently?",
        text: "This will permanently remove the category and cannot be undone.",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Yes, delete permanently",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "red",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await deleteProduct(id);

      Swal.close();
      await Swal.fire({
        title: "Deleted",
        text: "Category was permanently deleted.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error: any) {
      console.error("Hard delete failed", error);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to delete category.",
        icon: "error",
      });
    }
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
    <div className="w-full max-w-full px-4 md:px-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setAddOpen(true)}
          className="
      flex items-center gap-2 px-4 py-2 
      bg-[var(--color-extra-1)] 
      text-[var(--color-light-dark)]
      font-semibold rounded-xl shadow-md
      hover:bg-[var(--color-light-accent)]
      transition-all duration-300 
      hover:scale-105 active:scale-95
      animate-fadeIn
    "
        >
          <FaPlusCircle /> Add Product
        </button>
      </div>{" "}
      <DataTableComponent<IProduct>
        columns={columns}
        data={tableData}
        loading={isLoading}
        pagination
      />
      <ProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        product={selectedProduct}
      />
      <EditProductModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        product={selectedProduct}
        onUpdated={() =>
          queryClient.invalidateQueries({ queryKey: ["products"] })
        }
      />
      <AddProductModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onProductAdded={() => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
        }}
      />
    </div>
  );
}
