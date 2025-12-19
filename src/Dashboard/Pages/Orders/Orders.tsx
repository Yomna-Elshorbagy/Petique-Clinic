import React, { useEffect, useState, useMemo } from "react";
import TableComponent from "../../../Shared/Table/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../Store/store";
import {
  getAllOrders,
  deleteOrderById,
  deleteOrderhard,
  updateOrderStatus,
} from "../../../Store/Slices/OrderSlice";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaEye,
  FaSearch,
  FaUndo,
  FaFilter,
  FaTrash,
} from "react-icons/fa";
import OrderDetailsModal from "./OrderDetailsModal";
import SEO from "../../../Components/SEO/SEO";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default function Orders() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useSelector((state: RootState) => state.Order);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(getAllOrders());
  }, []);

  // Filter orders based on search term, status, and date
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order: any) =>
          order._id?.toLowerCase().includes(searchLower) ||
          order.fullName?.toLowerCase().includes(searchLower) ||
          order.phone?.toLowerCase().includes(searchLower) ||
          order.address?.toLowerCase().includes(searchLower) ||
          order.status?.toLowerCase().includes(searchLower) ||
          order.payment?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((order: any) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter((order: any) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const filterDate = new Date(dateFilter).toLocaleDateString();
        return orderDate === filterDate;
      });
    }

    return filtered;
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleViewOrder = (orderId: string) => {
    const order = orders.find((o: any) => o._id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsDetailsModalOpen(true);
    }
  };

  const handleEditOrder = async (order: any) => {
    const { value: status } = await Swal.fire({
      title: "Update Order Status",
      input: "select",
      inputOptions: {
        placed: "placed",
        shipping: "shipping",
        completed: "completed",
        canceled: "canceled",
        refund: "refund",
      },
      inputPlaceholder: "Select a status",
      showCancelButton: true,
      confirmButtonColor: "#e9a66f",
      cancelButtonColor: "#b89c86",
      confirmButtonText: "Update Status",
      cancelButtonText: "Cancel",
      background: "#faf7f2",
      color: "#4f3f36",
      customClass: {
        popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
        title: "text-[#4f3f36] font-semibold",
        input: "rounded-xl border-[#d1c4b5] focus:border-[#e9a66f]",
        confirmButton: "rounded-xl px-6 py-2 font-medium",
        cancelButton: "rounded-xl px-6 py-2 font-medium",
      },
      inputValidator: (value) => {
        if (!value) {
          return "You need to choose a status!";
        }
      },
    });

    if (status) {
      try {
        const resultAction = await dispatch(
          updateOrderStatus({ id: order._id, status })
        );
        if (updateOrderStatus.fulfilled.match(resultAction)) {
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Order status has been updated successfully.",
            timer: 2000,
            timerProgressBar: true,
            confirmButtonColor: "#e9a66f",
            background: "#faf7f2",
            color: "#4f3f36",
            customClass: {
              popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
              title: "text-[#4f3f36] font-semibold",
              confirmButton: "rounded-xl px-6 py-2 font-medium",
            },
          });
        } else {
          const errorPayload = resultAction.payload as any;
          const errorMessage =
            errorPayload?.message || errorPayload?.error || "Update failed";
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            confirmButtonColor: "#e9a66f",
            background: "#faf7f2",
            color: "#4f3f36",
            customClass: {
              popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
              title: "text-[#4f3f36] font-semibold",
              confirmButton: "rounded-xl px-6 py-2 font-medium",
            },
          });
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to update order status",
          confirmButtonColor: "#e9a66f",
          background: "#faf7f2",
          color: "#4f3f36",
          customClass: {
            popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
            title: "text-[#4f3f36] font-semibold",
            confirmButton: "rounded-xl px-6 py-2 font-medium",
          },
        });
      }
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Archive Order?",
      text: "This order will be archived (soft deleted). You can restore it later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e9a66f",
      cancelButtonColor: "#b89c86",
      confirmButtonText: "Yes, archive it!",
      cancelButtonText: "Cancel",
      background: "#faf7f2",
      color: "#4f3f36",
      customClass: {
        popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
        title: "text-[#4f3f36] font-semibold",
        confirmButton: "rounded-xl px-6 py-2 font-medium",
        cancelButton: "rounded-xl px-6 py-2 font-medium",
      },
    });

    if (result.isConfirmed) {
      try {
        const resultAction = await dispatch(deleteOrderById(orderId));
        if (deleteOrderById.fulfilled.match(resultAction)) {
          Swal.fire({
            icon: "success",
            title: "Archived!",
            text: "Order has been archived successfully.",
            timer: 2000,
            timerProgressBar: true,
            confirmButtonColor: "#e9a66f",
            background: "#faf7f2",
            color: "#4f3f36",
            customClass: {
              popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
              title: "text-[#4f3f36] font-semibold",
              confirmButton: "rounded-xl px-6 py-2 font-medium",
            },
          });
        } else {
          const errorPayload = resultAction.payload as any;
          const errorMessage =
            errorPayload?.message || errorPayload?.error || "Archive failed";
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            confirmButtonColor: "#e9a66f",
            background: "#faf7f2",
            color: "#4f3f36",
            customClass: {
              popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
              title: "text-[#4f3f36] font-semibold",
              confirmButton: "rounded-xl px-6 py-2 font-medium",
            },
          });
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to archive order",
          confirmButtonColor: "#e9a66f",
          background: "#faf7f2",
          color: "#4f3f36",
          customClass: {
            popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
            title: "text-[#4f3f36] font-semibold",
            confirmButton: "rounded-xl px-6 py-2 font-medium",
          },
        });
      }
    }
  };

  const handleHardDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Permanently Delete Order?",
      text: "This action cannot be undone! The order will be permanently deleted.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#c2844d",
      cancelButtonColor: "#b89c86",
      confirmButtonText: "Yes, delete permanently!",
      cancelButtonText: "Cancel",
      background: "#faf7f2",
      color: "#4f3f36",
      customClass: {
        popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
        title: "text-[#4f3f36] font-semibold",
        confirmButton: "rounded-xl px-6 py-2 font-medium",
        cancelButton: "rounded-xl px-6 py-2 font-medium",
      },
    });

    if (result.isConfirmed) {
      try {
        const resultAction = await dispatch(deleteOrderhard(orderId));
        if (deleteOrderhard.fulfilled.match(resultAction)) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Order has been permanently deleted.",
            timer: 2000,
            timerProgressBar: true,
            confirmButtonColor: "#e9a66f",
            background: "#faf7f2",
            color: "#4f3f36",
            customClass: {
              popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
              title: "text-[#4f3f36] font-semibold",
              confirmButton: "rounded-xl px-6 py-2 font-medium",
            },
          });
        } else {
          const errorPayload = resultAction.payload as any;
          const errorMessage =
            errorPayload?.message || errorPayload?.error || "Delete failed";
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            confirmButtonColor: "#e9a66f",
            background: "#faf7f2",
            color: "#4f3f36",
            customClass: {
              popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
              title: "text-[#4f3f36] font-semibold",
              confirmButton: "rounded-xl px-6 py-2 font-medium",
            },
          });
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to delete order",
          confirmButtonColor: "#e9a66f",
          background: "#faf7f2",
          color: "#4f3f36",
          customClass: {
            popup: "rounded-2xl shadow-xl border border-[#e6ddd3]",
            title: "text-[#4f3f36] font-semibold",
            confirmButton: "rounded-xl px-6 py-2 font-medium",
          },
        });
      }
    }
  };

  const columns = [
    {
      name: "Order ID",
      selector: (row: any) => `#${row._id?.slice(-6) || "N/A"}`,
      sortable: true,
      width: "120px",
    },
    {
      name: "Customer",
      selector: (row: any) => row.fullName || "N/A",
      sortable: true,
      width: "120px",
    },
    {
      name: "Phone",
      selector: (row: any) => row.phone || "N/A",
      width: "120px",
    },
    {
      name: "Address",
      selector: (row: any) => row.address || "N/A",
      width: "120px",
    },
    {
      name: "Total",
      selector: (row: any) => `EGP ${row.finalPrice || 0}`,
      sortable: true,
      width: "120px",
    },
    {
      name: "Payment",
      selector: (row: any) => row.payment || "N/A",
      width: "120px",
    },
    {
      name: "Status",
      selector: (row: any) => {
        const getStatusColor = (status: string) => {
          switch (status?.toLowerCase()) {
            case "completed":
              return "bg-green-100 text-green-800";
            case "shipping":
              return "bg-blue-100 text-blue-800";
            case "placed":
              return "bg-yellow-100 text-yellow-800";
            case "canceled":
              return "bg-red-100 text-red-800";
            case "refund":
              return "bg-purple-100 text-purple-800";
            default:
              return "bg-gray-100 text-gray-800";
          }
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
              row.status
            )}`}
          >
            {row.status?.charAt(0).toUpperCase() +
              row.status?.slice(1).toLowerCase()}
          </span>
        );
      },
      width: "100px",
    },
    {
      name: "Date",
      selector: (row: any) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      width: "130px",
    },
    {
      name: "Actions",
      center: true,
      cell: (row: any) => (
        <div className="flex gap-3 items-center justify-center">
          <button
            onClick={() => handleViewOrder(row._id)}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 
               hover:bg-blue-100 transition-all duration-200
               hover:scale-[1.07] active:scale-[0.96]
               shadow-sm hover:shadow-md border border-blue-100"
            title="View"
          >
            <FaEye size={15} />
          </button>
          <button
            onClick={() => handleEditOrder(row)}
            className="p-2 rounded-lg bg-green-50 text-green-600 
               hover:bg-green-100 transition-all duration-200
               hover:scale-[1.07] active:scale-[0.96]
               shadow-sm hover:shadow-md border border-green-100"
            title="Edit"
          >
            <FaEdit size={15} />
          </button>
          <button
            onClick={() => handleDeleteOrder(row._id)}
            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 
               hover:bg-yellow-100 transition-all duration-200
               hover:scale-[1.07] active:scale-[0.96]
               shadow-sm hover:shadow-md border border-yellow-100"
            title="Archive"
          >
            <FaUndo size={15} />
          </button>
          <button
            onClick={() => handleHardDelete(row._id)}
            className="p-2 rounded-lg bg-red-50 text-red-600 
               hover:bg-red-100 transition-all duration-200
               hover:scale-[1.07] active:scale-[0.96]
               shadow-sm hover:shadow-md border border-red-100"
            title="Delete Permanently"
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
      width: "160px",
      right: true,
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 md:px-6">
      <SEO
        title="Orders | Dashboard Petique Clinic"
        description="View and manage customer orders, payments, and service requests."
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
          Orders Management
        </h1>
      </div>

      {/* Search Filter */}
      <div className="mb-4">
        <div className="flex gap-4 flex-wrap items-center">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[250px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" size={14} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="placed">Placed</option>
              <option value="shipping">Shipping</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
              <option value="refund">Refund</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative min-w-[200px]">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200 cursor-pointer"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setDateFilter("");
            }}
            disabled={!searchTerm && !statusFilter && !dateFilter}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
            title="Reset Filters"
          >
            Reset
          </button>
        </div>

        {/* Results Counter */}
        {(searchTerm || statusFilter || dateFilter) && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredOrders.length} order
            {filteredOrders.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <TableComponent
          columns={columns}
          data={filteredOrders}
          loading={loading}
        />
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </div>
  );
}
