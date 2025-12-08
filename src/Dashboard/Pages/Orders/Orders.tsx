import React, { useEffect } from "react";
import TableComponent from "../../../Shared/Table/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../Store/store";
import { useNavigate } from "react-router-dom";
import {
  getAllOrders,
  deleteOrderById,
  updateOrderStatus,
} from "../../../Store/Slices/OrderSlice";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default function Orders() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state: RootState) => state.Order);

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleViewOrder = (orderId: string) => {
    const order = orders.find((o: any) => o._id === orderId);
    if (order) {
      navigate(`/orderdetails`, { state: { order: { data: order } } });
    }
  };

  const handleEditOrder = async (order: any) => {
    const { value: status } = await Swal.fire({
      title: "Update Order Status",
      input: "select",
      inputOptions: {
        Placed: "Placed",
        Shipped: "Shipped",
        Delivered: "Delivered",
        Pending: "Pending",
        Processing: "Processing",
        Cancelled: "Cancelled",
      },
      inputPlaceholder: "Select a status",
      showCancelButton: true,
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
          });
          dispatch(getAllOrders());
        } else {
          const errorPayload = resultAction.payload as any;
          const errorMessage =
            errorPayload?.message || errorPayload?.error || "Update failed";
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
          });
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to update order status",
        });
      }
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Delete Order?",
      text: "Are you sure you want to delete this order? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d69560",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const resultAction = await dispatch(deleteOrderById(orderId));
        if (deleteOrderById.fulfilled.match(resultAction)) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Order has been deleted successfully.",
            timer: 2000,
            timerProgressBar: true,
          });
          dispatch(getAllOrders());
        } else {
          const errorPayload = resultAction.payload as any;
          const errorMessage =
            errorPayload?.message || errorPayload?.error || "Delete failed";
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
          });
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to delete order",
        });
      }
    }
  };

  const columns = [
    {
      name: "Order ID",
      selector: (row: any) => row._id?.slice(-6) || "N/A",
      sortable: true,
      width: "120px",
    },
    {
      name: "Customer",
      selector: (row: any) => row.fullName || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "Phone",
      selector: (row: any) => row.phone || "N/A",
      width: "130px",
    },
    {
      name: "Address",
      selector: (row: any) => row.address || "N/A",
      width: "150px",
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
      width: "130px",
    },
    {
      name: "Status",
      selector: (row: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            row.status === "delivered"
              ? "bg-green-100 text-green-800"
              : row.status === "shipped"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status?.charAt(0).toUpperCase() +
            row.status?.slice(1).toLowerCase()}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Date",
      selector: (row: any) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      width: "130px",
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleViewOrder(row._id)}
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            title="View"
          >
            <FaEye size={16} />
          </button>
          <button
            onClick={() => handleEditOrder(row)}
            className="p-2 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDeleteOrder(row._id)}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
          Orders Management
        </h1>
      </div>
      <TableComponent columns={columns} data={orders} loading={loading} />
    </>
  );
}
