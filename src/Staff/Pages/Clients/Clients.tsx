import { useMemo, useState } from "react";
import { useStaffPetOwners, useStaffPets } from "../../../Hooks/Staff/useStaff";
import DataTableComponent from "../../../Shared/Table/TableComponent";
import { Mail, Phone } from "lucide-react";
import ClientDetailsModal from "./Components/ClientDetailsModal";

export default function Clients() {
  const { data: clients, isLoading: isClientsLoading } = useStaffPetOwners();
  const { data: allPets, isLoading: isPetsLoading } = useStaffPets();

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate pet counts per owner
  const petCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (Array.isArray(allPets)) {
      allPets.forEach((pet: any) => {
        const ownerId =
          typeof pet.petOwner === "object" ? pet.petOwner?._id : pet.petOwner;
        if (ownerId) {
          counts[ownerId] = (counts[ownerId] || 0) + 1;
        }
      });
    }
    return counts;
  }, [allPets]);

  const handleOpenModal = (id: string) => {
    setSelectedClientId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClientId(null);
  };

  const columns = useMemo(
    () => [
      {
        name: "Client Name",
        selector: (row: any) => row.userName || "Unknown",
        sortable: true,
        cell: (row: any) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-extra-5)] flex items-center justify-center text-[var(--color-light-accent)] font-bold border border-[var(--color-light-accent)]/20">
              {row.userName?.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-[var(--color-text-primary)]">
              {row.userName}
            </span>
          </div>
        ),
      },
      {
        name: "Contact Info",
        cell: (row: any) => (
          <div className="flex flex-col gap-1 text-xs text-[var(--color-text-muted)]">
            <div className="flex items-center gap-1.5">
              <Mail size={12} className="text-[var(--color-light-accent)]" />{" "}
              {row.email}
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={12} className="text-[var(--color-light-accent)]" />{" "}
              {row.mobileNumber || "No Phone"}
            </div>
          </div>
        ),
      },
      {
        name: "Pets",
        selector: (row: any) => petCounts[row._id] || 0,
        sortable: true,
        cell: (row: any) => (
          <span className="bg-[var(--color-extra-5)] text-[var(--color-text-primary)] px-2.5 py-1 rounded-md text-xs font-bold">
            {petCounts[row._id] || 0} Pets
          </span>
        ),
      },
      {
        name: "Actions",
        cell: (row: any) => (
          <button
            onClick={() => handleOpenModal(row._id)}
            className="text-[var(--color-light-accent)] hover:text-[var(--color-accent-dark)] font-medium text-sm transition-colors"
          >
            View Profile
          </button>
        ),
      },
    ],
    [petCounts]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
            Clients
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Directory of all registered pet owners.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-2xl shadow-sm border border-[var(--color-extra-3)]/30 dark:border-gray-800 overflow-hidden">
        <DataTableComponent
          columns={columns}
          data={Array.isArray(clients) ? clients : []}
          loading={isClientsLoading || isPetsLoading}
          pagination
        />
      </div>

      <ClientDetailsModal
        userId={selectedClientId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
