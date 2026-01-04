import { useMemo } from "react";
import type { IContact } from "../../../../Interfaces/IContact ";
import DataTableComponent from "../../../../Shared/Table/TableComponent";
import type { TableColumn } from "react-data-table-component";
import { FaTrash, FaTrashRestore } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { deleteContact } from "../../../../Apis/EmailsApi";
import { useDeletedContacts, useRestoreContact } from "../../../../Hooks/Contacts/UseContacts";

interface DeletedEmailsTableProps {
    searchEmail: string;
    searchName: string;
}

const DeletedEmailsTable: React.FC<DeletedEmailsTableProps> = ({ searchEmail, searchName }) => {
    const queryClient = useQueryClient();
    const { deletedContacts, isLoading, error } = useDeletedContacts(1, 100);
    const { mutateAsync: restoreContact } = useRestoreContact();

    // Filter logic
    const filteredData = useMemo(() => {
        let data = deletedContacts || [];
        if (searchEmail) {
            data = data.filter((c: IContact) =>
                c.email?.toLowerCase().includes(searchEmail.toLowerCase())
            );
        }
        if (searchName) {
            data = data.filter((c: IContact) =>
                c.fullName?.toLowerCase().includes(searchName.toLowerCase())
            );
        }
        return data;
    }, [deletedContacts, searchEmail, searchName]);

    const handleRestore = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: "Restore Contact?",
                text: "This will restore the contact to the active list.",
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

            await restoreContact(id);

            Swal.close();
        } catch (error: any) {
            Swal.close();
            Swal.fire({
                title: "Error",
                text: error?.response?.data?.message || "Failed to restore contact.",
                icon: "error",
            });
        }
    };

    const handleDeletePermanently = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: "Delete permanently?",
                text: "This will permanently remove the contact and cannot be undone.",
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

            await deleteContact(id);

            Swal.close();
            await Swal.fire({
                title: "Deleted",
                text: "Contact was permanently deleted.",
                icon: "success",
                timer: 1400,
                showConfirmButton: false,
            });
            queryClient.invalidateQueries({ queryKey: ["deletedContacts"] });
        } catch (error: any) {
            Swal.close();
            Swal.fire("Error", error?.response?.data?.message || "Failed to delete.", "error");
        }
    };

    const columns: TableColumn<IContact>[] = [
        {
            name: "Name",
            selector: (row) => row.fullName,
            sortable: true,
            wrap: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
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
        return <div className="p-4 text-red-500">Error loading archived contacts.</div>;
    }

    return (
        <DataTableComponent<IContact>
            columns={columns}
            data={filteredData}
            loading={isLoading}
            pagination
        />
    );
};

export default DeletedEmailsTable;
