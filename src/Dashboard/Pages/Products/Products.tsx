import { useState, useMemo } from "react";
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
import {
  FaEdit,
  FaEye,
  FaPlusCircle,
  FaTrash,
  FaUndo,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
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

  // Filter states
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");

  // ===> fetch products
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = data?.data || [];

    // ID filter
    if (searchId) {
      const searchLower = searchId.toLowerCase();
      filtered = filtered.filter((product: IProduct) =>
        product._id?.toLowerCase().includes(searchLower)
      );
    }

    // Name filter
    if (searchName) {
      const searchLower = searchName.toLowerCase();
      filtered = filtered.filter((product: IProduct) =>
        product.title?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (categoryFilter) {
      const searchLower = categoryFilter.toLowerCase();
      filtered = filtered.filter((product: IProduct) =>
        product.category?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((product: IProduct) => {
        const isOut = product.stock === 0 || product.status === "out";
        const isLow = product.stock > 0 && product.stock <= 5;
        const isAvailable = product.stock > 5 && product.status !== "out";

        if (statusFilter === "out") return isOut;
        if (statusFilter === "low") return isLow;
        if (statusFilter === "available") return isAvailable;
        return true;
      });
    }

    // Price filter
    if (minPrice) {
      filtered = filtered.filter(
        (product: IProduct) => product.price >= Number(minPrice)
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (product: IProduct) => product.price <= Number(maxPrice)
      );
    }

    // Stock filter
    if (minStock) {
      filtered = filtered.filter(
        (product: IProduct) => product.stock >= Number(minStock)
      );
    }
    if (maxStock) {
      filtered = filtered.filter(
        (product: IProduct) => product.stock <= Number(maxStock)
      );
    }

    return filtered;
  }, [
    data?.data,
    searchId,
    searchName,
    categoryFilter,
    statusFilter,
    minPrice,
    maxPrice,
    minStock,
    maxStock,
  ]);

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
            src={
              typeof row.imageCover === "string"
                ? row.imageCover
                : row.imageCover?.secure_url || "/placeholder-100x100.png"
            }
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

  const resetFilters = () => {
    setSearchId("");
    setSearchName("");
    setCategoryFilter("");
    setStatusFilter("");
    setMinPrice("");
    setMaxPrice("");
    setMinStock("");
    setMaxStock("");
  };

  const hasActiveFilters =
    searchId ||
    searchName ||
    categoryFilter ||
    statusFilter ||
    minPrice ||
    maxPrice ||
    minStock ||
    maxStock;

  return (
    <div className="w-full max-w-full px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
          Products Management
        </h1>
      </div>

      {/* Filter Section */}
      <div className="mb-4">
        <div className="flex gap-4 flex-wrap items-center">
          {/* ID Search */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
            />
            {searchId && (
              <button
                onClick={() => setSearchId("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Name Search */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
            />
            {searchName && (
              <button
                onClick={() => setSearchName("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Search */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" size={14} />
            </div>
            <input
              type="text"
              placeholder="Search by category..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
            />
            {categoryFilter && (
              <button
                onClick={() => setCategoryFilter("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" size={14} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
            title="Reset Filters"
          >
            Reset
          </button>
        </div>

        {/* Second Row - Price and Stock */}
        <div className="flex gap-4 flex-wrap items-center mt-4">
          {/* Min Price */}
          <div className="relative min-w-[150px]">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
            />
          </div>

          {/* Max Price */}
          <div className="relative min-w-[150px]">
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
            />
          </div>

          {/* Min Stock */}
          <div className="relative min-w-[150px]">
            <input
              type="number"
              placeholder="Min Stock"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
            />
          </div>

          {/* Max Stock */}
          <div className="relative min-w-[150px]">
            <input
              type="number"
              placeholder="Max Stock"
              value={maxStock}
              onChange={(e) => setMaxStock(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
            />
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-extra-1)] text-[var(--color-light-dark)] font-semibold rounded-xl shadow-md hover:bg-[var(--color-light-accent)] transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap ml-auto"
          >
            <FaPlusCircle /> Add Product
          </button>
        </div>

        {/* Results Counter */}
        {hasActiveFilters && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <DataTableComponent<IProduct>
        columns={columns}
        data={filteredProducts}
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
