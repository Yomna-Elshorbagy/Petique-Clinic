import { useMemo } from "react";
import type { ICoupon } from "../../../../Interfaces/ICoupon";
import DataTableComponent from "../../../../Shared/Table/TableComponent";
import type { TableColumn } from "react-data-table-component";
import { FaTrash, FaTrashRestore } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCoupon } from "../../../../Apis/CouponApis";
import { useDeletedCoupons, useRestoreCoupon } from "../../../../Hooks/Coupons/useCoupons";

interface DeletedCouponsTableProps {
    searchCode: string;
}

const DeletedCouponsTable: React.FC<DeletedCouponsTableProps> = ({ searchCode }) => {
    const queryClient = useQueryClient();
    const { deletedCoupons, isLoading, error } = useDeletedCoupons(1, 100);
    const { mutateAsync: restoreCoupon } = useRestoreCoupon();

    // Filter logic
    const filteredData = useMemo(() => {
        let data = deletedCoupons || [];
        if (searchCode) {
            data = data.filter((item: ICoupon) =>
                item.code?.toLowerCase().includes(searchCode.toLowerCase())
            );
        }
        return data;
    }, [deletedCoupons, searchCode]);

    const handleRestore = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: "Restore Coupon?",
                text: "This will restore the coupon to the active list.",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, restore",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#10B981",
            });

            if (!result.isConfirmed) return;

            Swal.fire({
                title: "Restoring...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            await restoreCoupon(id);

            Swal.close();
        } catch (error: any) {
            Swal.close();
            Swal.fire({
                title: "Error",
                text: error?.response?.data?.message || "Failed to restore coupon.",
                icon: "error",
            });
        }
    };

    const handleDeletePermanently = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: "Delete permanently?",
                text: "This will permanently remove the coupon and cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete permanently",
                cancelButtonText: "Cancel",
                confirmButtonColor: "red",
            });

            if (!result.isConfirmed) return;

            Swal.fire({
                title: "Deleting...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            await deleteCoupon(id);

            Swal.close();
            await Swal.fire({
                title: "Deleted",
                text: "Coupon was permanently deleted.",
                icon: "success",
                timer: 1400,
                showConfirmButton: false,
            });
            queryClient.invalidateQueries({ queryKey: ["deletedCoupons"] });
        } catch (error: any) {
            Swal.close();
            Swal.fire("Error", error?.response?.data?.message || "Failed to delete.", "error");
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

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
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${row.type === "fixedAmount"
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
            name: "Expiry Date",
            cell: (row) => formatDate(row.expire),
            sortable: true,
            width: "130px",
        },
        {
            name: "Deleted At",
            selector: (row: any) => row.deletedAt ? new Date(row.deletedAt).toLocaleDateString() : "N/A",
            sortable: true,
            width: "140px",
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleRestore(row._id)}
                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all shadow-sm border border-green-100"
                        title="Restore"
                    >
                        <FaTrashRestore size={15} />
                    </button>
                    <button
                        onClick={() => handleDeletePermanently(row._id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all shadow-sm border border-red-100"
                        title="Delete Permanently"
                    >
                        <FaTrash size={15} />
                    </button>
                </div>
            ),
            button: true,
            width: "160px",
        },
    ];

    if (error) {
        return <div className="p-4 text-red-500">Error loading archived coupons.</div>;
    }

    return (
        <DataTableComponent<ICoupon>
            columns={columns}
            data={filteredData}
            loading={isLoading}
            pagination
        />
    );
};

export default DeletedCouponsTable;
