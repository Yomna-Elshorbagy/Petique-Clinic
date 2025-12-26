import { useMemo } from "react";
import type { ICategory } from "../../../../Interfaces/categryInterfaces";
import DataTableComponent from "../../../../Shared/Table/TableComponent";
import type { TableColumn } from "react-data-table-component";
import { FaTrash, FaTrashRestore } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../../../../Apis/CategoryApis";
import { useDeletedCategories, useRestoreCategory } from "../../../../Hooks/Categories/useCategories";

interface DeletedCategoriesTableProps {
    searchId: string;
    searchName: string;
}

const DeletedCategoriesTable: React.FC<DeletedCategoriesTableProps> = ({ searchId, searchName }) => {
    const queryClient = useQueryClient();
    const { deletedCategories, isLoading, error } = useDeletedCategories(1, 100);
    const { mutateAsync: restoreCategory } = useRestoreCategory();

    // Filter logic
    const filteredData = useMemo(() => {
        let data = deletedCategories || [];
        if (searchId) {
            data = data.filter((c: ICategory) =>
                c._id?.toLowerCase().includes(searchId.toLowerCase())
            );
        }
        if (searchName) {
            data = data.filter((c: ICategory) =>
                c.name?.toLowerCase().includes(searchName.toLowerCase())
            );
        }
        return data;
    }, [deletedCategories, searchId, searchName]);

    const handleRestore = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: "Restore Category?",
                text: "This will restore the category to the active list.",
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

            await restoreCategory(id);

            Swal.close();
            // Success alert is handled in the hook
        } catch (error: any) {
            console.error("Restore failed", error);
            Swal.close();
            Swal.fire({
                title: "Error",
                text: error?.response?.data?.message || "Failed to restore category.",
                icon: "error",
            });
        }
    };

    const handleDeletePermanently = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: "Delete permanently?",
                text: "This will permanently remove the category and cannot be undone.",
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

            await deleteCategory(id);

            Swal.close();
            await Swal.fire({
                title: "Deleted",
                text: "Category was permanently deleted.",
                icon: "success",
                timer: 1400,
                showConfirmButton: false,
            });
            queryClient.invalidateQueries({ queryKey: ["deletedCategories"] });
        } catch (error: any) {
            Swal.close();
            Swal.fire("Error", error?.response?.data?.message || "Failed to delete.", "error");
        }
    };

    const columns: TableColumn<ICategory>[] = [
        {
            name: "ID",
            cell: (row) => `#${row._id?.slice(-5)}`,
            sortable: true,
            width: "90px",
        },
        {
            name: "Image",
            cell: (row) => (
                <img
                    src={row.image?.secure_url || "/placeholder-100x100.png"}
                    alt={row.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e: any) => e.currentTarget.src = "/placeholder-100x100.png"}
                />
            ),
            width: "80px",
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
            wrap: true,
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
        return <div className="p-4 text-red-500">Error loading archived categories.</div>;
    }

    return (
        <DataTableComponent<ICategory>
            columns={columns}
            data={filteredData}
            loading={isLoading}
            pagination
        />
    );
};

export default DeletedCategoriesTable;
