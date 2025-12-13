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

const AllReservationsPage = () => {
  const { data = [], isLoading } = useReservations({});
  const { mutate: softDelete } = useSoftDeleteReservation();
  const { mutate: hardDelete } = useHardDeleteReservation();

  const reservations = useMemo(() => data?.data ?? data ?? [], [data]);

  const { page, totalPages, paginatedItems, goToPage } = useLocalPagination(
    reservations,
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
