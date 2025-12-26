import { useMemo } from "react";

import TableComponent from "../../../Shared/Table/TableComponent";
import { FaTrash, FaTrashRestore } from "react-icons/fa";
import Swal from "sweetalert2";
import { deleteOrderhard } from "../../../Store/Slices/OrderSlice";
import { useDeletedOrders, useRestoreOrder } from "../../../Hooks/Orders/useOrderTracking";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../Store/store";

interface DeletedOrdersTableProps {
    searchTerm: string;
}

const DeletedOrdersTable: React.FC<DeletedOrdersTableProps> = ({ searchTerm }) => {
    const { deletedOrders, isLoading, error, refetch } = useDeletedOrders(1, 100);
    const { mutateAsync: restoreOrder } = useRestoreOrder();
    const dispatch = useDispatch<AppDispatch>();

    // Filter logic
    const filteredData = useMemo(() => {
        let data = deletedOrders || [];
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            data = data.filter((order: any) =>
                order._id?.toLowerCase().includes(searchLower) ||
                order.fullName?.toLowerCase().includes(searchLower) ||
                order.phone?.toLowerCase().includes(searchLower)
            );
        }
        return data;
    }, [deletedOrders, searchTerm]);

    const handleRestore = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: "Restore Order?",
                text: "This will restore the order to the active list.",
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

            await restoreOrder(id);

            Swal.close();
        } catch (error: any) {
            console.error("Restore failed", error);
            Swal.close();
            Swal.fire({
                title: "Error",
                text: error?.response?.data?.message || "Failed to restore order.",
                icon: "error",
            });
        }
    };

    const handleDeletePermanently = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: "Delete permanently?",
                text: "This will permanently remove the order and cannot be undone.",
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

            await dispatch(deleteOrderhard(id));

            Swal.close();
            await Swal.fire({
                title: "Deleted",
                text: "Order was permanently deleted.",
                icon: "success",
                timer: 1400,
                showConfirmButton: false,
            });
            refetch();
        } catch (error: any) {
            Swal.close();
            Swal.fire("Error", error?.message || "Failed to delete.", "error");
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
            name: "Total",
            selector: (row: any) => `EGP ${row.finalPrice || 0}`,
            sortable: true,
            width: "120px",
        },
        {
            name: "Deleted At",
            selector: (row: any) => row.deletedAt ? new Date(row.deletedAt).toLocaleDateString() : "N/A",
            sortable: true,
            width: "140px",
        },
        {
            name: "Actions",
            cell: (row: any) => (
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
            width: "160px",
            right: true,
        },
    ];

    if (error) {
        return <div className="p-4 text-red-500">Error loading archived orders.</div>;
    }

    return (
        <TableComponent
            columns={columns}
            data={filteredData}
            loading={isLoading}
        />
    );
};

export default DeletedOrdersTable;
