import React, { useState } from "react";
import {
  FaTimes,
  FaEdit,
  FaSave,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaBox,
  FaBan,
  FaUndo,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  updateOrderDetails,
  getAllOrders,
} from "../../../Store/Slices/OrderSlice";
import type { AppDispatch } from "../../../Store/store";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState({
    fullName: order?.fullName || "",
    phone: order?.phone || "",
    address: order?.address || "",
    status: order?.status || "",
    notes: order?.note || "",
    finalPrice: order?.finalPrice || 0,
  });

  if (!isOpen || !order) return null;

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return <FaClock className="text-yellow-500" />;
      case "shipping":
        return <FaTruck className="text-blue-500" />;
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "canceled":
        return <FaBan className="text-red-500" />;
      case "refund":
        return <FaUndo className="text-purple-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

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

  const handleSaveChanges = async () => {
    try {
      const resultAction = await dispatch(
        updateOrderDetails({
          id: order._id,
          fullName: editedOrder.fullName,
          phone: editedOrder.phone,
          address: editedOrder.address,
          status: editedOrder.status,
          finalPrice: editedOrder.finalPrice,
          notes: editedOrder.notes,
        })
      );
      if (updateOrderDetails.fulfilled.match(resultAction)) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Order has been updated successfully.",
          timer: 1400,
          showConfirmButton: false,
          background: "#FCF9F4",
          color: "#4f3f36",
          iconColor: "#C58D52",
        });
        dispatch(getAllOrders());
        setIsEditing(false);
        onClose();
      } else {
        const errorPayload = resultAction.payload as any;
        const errorMessage =
          errorPayload?.message || errorPayload?.error || "Update failed";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          background: "#FCF9F4",
          color: "#4f3f36",
          confirmButtonColor: "#C58D52",
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update order",
        background: "#FCF9F4",
        color: "#4f3f36",
        confirmButtonColor: "#C58D52",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--color-light-background)] border border-[var(--color-light-secondary)]/40 rounded-2xl shadow-xl animate-fadeIn my-8">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-light-primary)] text-[var(--color-light-dark)] px-6 py-4 flex justify-between items-center rounded-t-2xl border-b border-[var(--color-light-secondary)]/40">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🛒 Order #{order._id?.slice(-6)}
          </h2>
          <div className="flex gap-2 items-center">
            {/* Status Badge */}
            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                isEditing ? editedOrder.status : order.status
              )}`}
            >
              {getStatusIcon(isEditing ? editedOrder.status : order.status)}
              {(isEditing ? editedOrder.status : order.status)
                .charAt(0)
                .toUpperCase() +
                (isEditing ? editedOrder.status : order.status)
                  .slice(1)
                  .toLowerCase()}
            </div>

            {!isEditing ? (
              <button
                onClick={() => {
                  setEditedOrder({
                    fullName: order.fullName || "",
                    phone: order.phone || "",
                    address: order.address || "",
                    status: order.status || "",
                    notes: order.note || "",
                    finalPrice: order.finalPrice || 0,
                  });
                  setIsEditing(true);
                }}
                className="p-2 rounded-lg bg-[var(--color-accent-light)] text-[var(--color-light-dark)] hover:bg-[var(--color-light-accent)] transition-colors"
                title="Edit Order"
              >
                <FaEdit size={18} />
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 rounded-lg bg-[var(--color-extra-1)] text-[var(--color-light-dark)] hover:bg-[var(--color-light-accent)] transition-colors flex items-center gap-2 font-medium"
                  title="Save Changes"
                >
                  <FaSave size={16} />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-[var(--color-extra-3)] text-[var(--color-light-dark)] hover:bg-[var(--color-extra-6)] transition-colors font-medium"
                  title="Cancel"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="hover:text-[var(--color-light-accent)] transition"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Customer Information */}
          <div className="border border-[var(--color-light-secondary)]/40 rounded-xl p-4 bg-[var(--color-extra-5)]">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-light-accent)] flex items-center gap-2">
              👤 Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-light-dark)] mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrder.fullName}
                    onChange={(e) =>
                      setEditedOrder({
                        ...editedOrder,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-black focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
                  />
                ) : (
                  <p className="text-[var(--color-light-dark)] font-medium">
                    {order.fullName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-light-dark)] mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrder.phone}
                    onChange={(e) =>
                      setEditedOrder({ ...editedOrder, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-black focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
                  />
                ) : (
                  <p className="text-[var(--color-light-dark)] font-medium">
                    {order.phone}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-light-dark)] mb-1">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={editedOrder.address}
                    onChange={(e) =>
                      setEditedOrder({
                        ...editedOrder,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-black focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200 resize-none"
                    rows={2}
                  />
                ) : (
                  <p className="text-[var(--color-light-dark)] font-medium">
                    {order.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="border border-[var(--color-light-secondary)]/40 rounded-xl p-4 bg-[var(--color-extra-5)]">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-light-accent)] flex items-center gap-2">
              📦 Order Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-light-dark)] mb-1">
                  Order ID
                </label>
                <p className="text-[var(--color-light-dark)] font-mono">
                  #{order._id?.slice(-6)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-light-dark)] mb-1">
                  Payment Method
                </label>
                <p className="text-[var(--color-light-dark)] font-medium">
                  {order.payment}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-light-dark)] mb-1">
                  Status
                </label>
                {isEditing ? (
                  <select
                    value={editedOrder.status}
                    onChange={(e) =>
                      setEditedOrder({ ...editedOrder, status: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] focus:border-black focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200 cursor-pointer"
                  >
                    <option value="placed">Placed</option>
                    <option value="shipping">Shipping</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                    <option value="refund">Refund</option>
                  </select>
                ) : (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status?.charAt(0).toUpperCase() +
                      order.status?.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-light-dark)] mb-1">
                  Order Date
                </label>
                <p className="text-[var(--color-light-dark)] font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-light-dark)] mb-1">
                  Note
                </label>
                {isEditing ? (
                  <textarea
                    value={editedOrder.notes}
                    onChange={(e) =>
                      setEditedOrder({ ...editedOrder, notes: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-black focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200 resize-none"
                    rows={2}
                    placeholder="Add special notes..."
                  />
                ) : (
                  <p className="text-[var(--color-light-dark)]">
                    {order.note || "No notes"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-[var(--color-light-secondary)]/40 rounded-xl p-4 bg-[var(--color-extra-5)]">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-light-accent)] flex items-center gap-2">
              🛍️ Order Items
            </h3>
            <div className="space-y-3">
              {order.products?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 flex justify-between items-center border border-[var(--color-light-secondary)]/20"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-[var(--color-light-dark)]">
                      {item.productId?.name || item.title || "Product"}
                    </h4>
                    <p className="text-sm text-[var(--color-light-textSecondary)]">
                      Quantity: {item.quantity} × EGP {item.price}
                    </p>
                    {item.discount > 0 && (
                      <p className="text-sm text-[var(--color-light-accent)]">
                        Discount: {item.discount}%
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-light-dark)]">
                      EGP {item.finalPrice || item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border border-[var(--color-light-secondary)]/40 rounded-xl p-4 bg-[var(--color-extra-5)]">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-light-accent)] flex items-center gap-2">
              💰 Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--color-light-textSecondary)]">
                  Subtotal:
                </span>
                <span className="font-medium text-[var(--color-light-dark)]">
                  EGP {order.totalPrice || 0}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[var(--color-light-accent)]">
                  <span>Discount:</span>
                  <span>-EGP {order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-[var(--color-light-secondary)]/40 text-[var(--color-light-dark)]">
                <span>Total:</span>
                <span>EGP {order.finalPrice || order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
