import { useState } from "react";

import type { TableColumn } from "react-data-table-component";
import {
  FaEye,
  FaEdit,
  FaPlusCircle,
  FaTrash,
  FaUndo,
  FaTags,
} from "react-icons/fa";
import DataTableComponent from "../../../Shared/Table/TableComponent";
import Swal from "sweetalert2";

import {
  useCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  useSoftDeleteCoupon,
} from "../../../Hooks/Coupons/useCoupons";
import { FaBoxOpen } from "react-icons/fa";
import DeletedCouponsTable from "./Components/DeletedCouponsTable";

import type { ICoupon, ICouponCreate } from "../../../Interfaces/ICoupon";
import CouponModal from "./Components/CouponModal";
import FilterCoupons from "./Components/FilterCoupons";
import SEO from "../../../Components/SEO/SEO";

export default function Coupons() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
  const [page, _setPage] = useState(1);
  const [viewMode, setViewMode] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false); // Toggle state

  const [limit] = useState(10);

  // Fetch coupons
  const { data, isLoading } = useCoupons(page, limit);

  // States for filters
  const [searchCode, setSearchCode] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Mutations
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();
  const softDeleteMutation = useSoftDeleteCoupon();

  // Handlers
  const handleAdd = () => {
    setSelectedCoupon(null);
    setOpenModal(true);
  };

  const handleView = (coupon: ICoupon) => {
    setSelectedCoupon(coupon);
    setViewMode(true);
    setOpenModal(true);
  };

  const handleEdit = (coupon: ICoupon) => {
    setSelectedCoupon(coupon);
    setOpenModal(true);
  };

  const handleSubmit = async (couponData: ICouponCreate) => {
    if (selectedCoupon) {
      await updateMutation.mutateAsync({
        id: selectedCoupon._id,
        data: couponData,
      });
    } else {
      await createMutation.mutateAsync(couponData);
    }
    setOpenModal(false);
    setSelectedCoupon(null);
  };

  const handleSoftDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Soft Delete Coupon?",
        text: "This will mark the coupon as deleted but keep it in the database.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, soft delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "#f59e0b",
      });

      if (!result.isConfirmed) return;
      await softDeleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Soft delete failed", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete permanently?",
        text: "This will permanently remove the coupon and cannot be undone.",
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

      await deleteMutation.mutateAsync(id);

      Swal.close();
      await Swal.fire({
        title: "Deleted",
        text: "Coupon was permanently deleted.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.close();
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to delete coupon.",
        icon: "error",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (expireDate: string) => {
    return new Date(expireDate) < new Date();
  };

  const isCouponValid = (coupon: ICoupon) => {
    return !coupon.isDeleted && !isExpired(coupon.expire);
  };

  // TABLE COLUMNS
  const columns: TableColumn<ICoupon>[] = [
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
      width: "120px",
    },
    {
      name: "Type",
      cell: (row) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            row.type === "fixedAmount"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          {row.type === "fixedAmount" ? "Fixed" : "Percentage"}
        </span>
      ),
      sortable: true,
      width: "110px",
    },
    {
      name: "Discount",
      cell: (row) => (
        <span className="font-semibold">
          {row.type === "percentage"
            ? `${row.discount}%`
            : `${row.discount} EGP`}
        </span>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: "Start Date",
      cell: (row) => formatDate(row.fromDate),
      sortable: true,
      width: "130px",
    },
    {
      name: "Expiry Date",
      cell: (row) => (
        <span
          className={!isCouponValid(row) ? "text-red-600 font-semibold" : ""}
        >
          {formatDate(row.expire)}
        </span>
      ),
      sortable: true,
      width: "130px",
    },
    {
      name: "Status",
      cell: (row) => {
        const deleted = row.isDeleted;
        const expired = isExpired(row.expire);

        let label = "Active";
        let bg = "bg-green-100 text-green-700";

        if (deleted) {
          label = "Invalid (Deleted)";
          bg = "bg-red-100 text-red-700";
        } else if (expired) {
          label = "Expired";
          bg = "bg-red-100 text-red-700";
        }

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
      width: "100px",
    },
    {
      name: "Assigned Users",
      cell: (row) => row.usedBy?.length || 0,
      sortable: true,
      width: "130px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {/* VIEW */}
          <button
            onClick={() => handleView(row)}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 
            hover:bg-blue-100 transition-all duration-200
            hover:scale-[1.07] active:scale-[0.96]
            shadow-sm hover:shadow-md border border-blue-100"
            title="Preview"
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

          {/* SOFT DELETE */}
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
  //END COLUMNS

  // Filter local data
  const filteredData = (data?.data || []).filter((coupon: ICoupon) => {
    const matchCode = coupon.code
      .toLowerCase()
      .includes(searchCode.toLowerCase());

    const matchType = filterType ? coupon.type === filterType : true;

    const expired = isExpired(coupon.expire);
    const deleted = coupon.isDeleted;

    let status = "active";
    if (deleted) status = "unactive";
    else if (expired) status = "expired";

    const matchStatus = filterStatus ? status === filterStatus : true;

    return matchCode && matchType && matchStatus;
  });

  return (
    <div className="w-full max-w-full px-4 md:px-6">
      <SEO
        title="Coupons | Dashboard Petique Clinic"
        description="Manage discount coupons, and marketing campaigns for Petique Clinic."
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h2 className="text-xl text-[#6c5136] font-semibold flex items-center gap-2">
          <FaTags className="text-[#6c5136]" />
          {showDeleted ? "Archived Coupons" : "Coupons Management"}
        </h2>

        <div className="flex gap-4 items-center">
          {/* Unique Toggle Button */}
          <div className="flex bg-gray-200/80 p-1.5 rounded-xl shadow-inner relative w-[240px]">
            {/* Slider Background */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                showDeleted ? "translate-x-full left-1.5" : "left-1.5"
              }`}
            />

            <button
              onClick={() => setShowDeleted(false)}
              className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                !showDeleted
                  ? "text-[var(--color-primary)]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaBoxOpen className={!showDeleted ? "animate-pulse" : ""} />
              Active
            </button>

            <button
              onClick={() => setShowDeleted(true)}
              className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                showDeleted
                  ? "text-red-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaTrash className={showDeleted ? "animate-bounce" : ""} />
              Archived
            </button>
          </div>

          {!showDeleted && (
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 
                    bg-[var(--color-extra-1)] 
                    text-[var(--color-light-dark)]
                    font-semibold rounded-xl shadow-md
                    hover:bg-[var(--color-light-accent)]
                    transition-all duration-300 
                    hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <FaPlusCircle /> Add Coupon
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4 rounded-lg"></div>

      {/*Filter Component */}
      <FilterCoupons
        searchCode={searchCode}
        setSearchCode={setSearchCode}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onReset={() => {
          setSearchCode("");
          setFilterType("");
          setFilterStatus("");
        }}
      />

      {/* USE FILTERED DATA */}
      {showDeleted ? (
        <DeletedCouponsTable searchCode={searchCode} />
      ) : (
        <DataTableComponent<ICoupon>
          columns={columns}
          data={filteredData}
          loading={isLoading}
          pagination
        />
      )}

      <CouponModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedCoupon(null);
          setViewMode(false);
        }}
        coupon={selectedCoupon}
        onSubmit={viewMode ? () => {} : handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        viewMode={viewMode}
      />
    </div>
  );
}
