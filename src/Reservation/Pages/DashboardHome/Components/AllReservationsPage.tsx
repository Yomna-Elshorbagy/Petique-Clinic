import React, { useMemo, useState } from "react";

import { useReservations } from "../../../../Hooks/Reservation/useReservation";
import {
  useSoftDeleteReservation,
  useHardDeleteReservation,
} from "../../../../Hooks/Reservation/useReservationMutations";

import { useLocalPagination } from "../../../Componenst/Pagination/UsePagination";
import Pagination from "../../../Componenst/Pagination/Pagination";
import ViewReservationModal from "../../ResevationPet/Components/ViewReservationModal";
import EditReservationModal from "../../ResevationPet/Components/EditReservationModal";
import ReservationTable from "./ReservationTable";
import { useReservationFilters } from "../../../../Hooks/SharedSearch/useReservationFilters";
import SharedSearch from "../../../../Shared/SharedSearch/SharedSearch";
import { useServices } from "../../../../Hooks/Services/UseServices";

const AllReservationsPage = () => {
  const { data = [], isLoading } = useReservations({});
  const { mutate: softDelete } = useSoftDeleteReservation();
  const { mutate: hardDelete } = useHardDeleteReservation();
  const { data: servicesData } = useServices();
  const services = servicesData?.data ?? [];

  const reservations = useMemo(() => data?.data ?? data ?? [], [data]);

  const {
    filteredReservations,
    petSearch,
    setPetSearch,
    ownerSearch,
    setOwnerSearch,
    serviceId,
    setServiceId,
    status,
    setStatus,
  } = useReservationFilters(reservations);

  const { page, totalPages, paginatedItems, goToPage } = useLocalPagination(
    filteredReservations,
    7
  );

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeReservation, setActiveReservation] = useState<any | null>(null);

  const openView = (res: any) => {
    setActiveReservation(res);
    setViewOpen(true);
  };

  const openEdit = (res: any) => {
    setActiveReservation(res);
    setEditOpen(true);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <ViewReservationModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        reservation={activeReservation}
      />

      <EditReservationModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        reservation={activeReservation}
        onUpdated={() => setEditOpen(false)}
      />

      <h1 className="text-2xl font-bold text-[#4A3F35] mb-4">
        All Reservations
      </h1>
      <SharedSearch
        searches={[
          { placeholder: "Search by Pet", value: petSearch, onChange: setPetSearch },
          { placeholder: "Search by Owner", value: ownerSearch, onChange: setOwnerSearch },
        ]}
        filters={[
          {
            value: serviceId,
            onChange: setServiceId,
            options: [
              { label: "All Services", value: "all" },
              ...services.map((s: any) => ({ label: s.title, value: s._id })),
            ],
          },
          {
            value: status,
            onChange: setStatus,
            options: [
              { label: "All Status", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Upcoming", value: "upcoming" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
        ]}
      />

      <ReservationTable
        items={paginatedItems}
        onView={openView}
        onEdit={openEdit}
        softDeleteMutation={softDelete}
        hardDeleteMutation={hardDelete}
      />

      <div className="mt-6">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </div>
  );
};

export default AllReservationsPage;
