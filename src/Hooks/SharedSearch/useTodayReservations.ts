import { useMemo, useState } from "react";
import { TIME_SLOTS } from "../../Constants/timeSlots";

export const useTodayReservationFilters = (reservations: any[]) => {
  const [petSearch, setPetSearch] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [timeSlot, setTimeSlot] = useState("all");

  const filteredReservations = useMemo(() => {
    return reservations.filter((res: any) => {
      const matchesPet =
        !petSearch ||
        res.pet?.name
          ?.toLowerCase()
          .includes(petSearch.toLowerCase());

      const matchesOwner =
        !ownerSearch ||
        res.petOwner?.userName
          ?.toLowerCase()
          .includes(ownerSearch.toLowerCase());

      const matchesStatus =
        status === "all" || res.status === status;

      const matchesTime =
        timeSlot === "all" || res.timeSlot === timeSlot;

      return (
        matchesPet &&
        matchesOwner &&
        matchesStatus &&
        matchesTime
      );
    });
  }, [reservations, petSearch, ownerSearch, status, timeSlot]);

  const timeSlotOptions = [
  { label: "All Times", value: "all" },
  ...TIME_SLOTS.map((t) => ({ label: t, value: t })),
];

  const resetFilters = () => {
    setPetSearch("");
    setOwnerSearch("");
    setStatus("all");
    setTimeSlot("all");
  };

  return {
    filteredReservations,

    petSearch,
    ownerSearch,

    status,
    timeSlot,

    setPetSearch,
    setOwnerSearch,
    setStatus,
    setTimeSlot,

    resetFilters,
    timeSlotOptions
  };
};
