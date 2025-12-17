import { useMemo, useState } from "react";

export const useReservationFilters = (reservations: any[]) => {
  const [petSearch, setPetSearch] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [serviceId, setServiceId] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredReservations = useMemo(() => {
    return reservations.filter((res: any) => {
      const matchesPet =
        !petSearch ||
        res.pet?.name?.toLowerCase().includes(petSearch.toLowerCase());

      const matchesOwner =
        !ownerSearch ||
        res.petOwner?.userName
          ?.toLowerCase()
          .includes(ownerSearch.toLowerCase());

      const matchesService =
        serviceId === "all" || res.service?._id === serviceId;

      const matchesStatus =
        status === "all" || res.status === status;

      return (
        matchesPet &&
        matchesOwner &&
        matchesService &&
        matchesStatus
      );
    });
  }, [reservations, petSearch, ownerSearch, serviceId, status]);

  const resetFilters = () => {
    setPetSearch("");
    setOwnerSearch("");
    setServiceId("all");
    setStatus("all");
  };

  return {
    filteredReservations,

    petSearch,
    ownerSearch,
    serviceId,
    status,

    setPetSearch,
    setOwnerSearch,
    setServiceId,
    setStatus,

    resetFilters,
  };
};
