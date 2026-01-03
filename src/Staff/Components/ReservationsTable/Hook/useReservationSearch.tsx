import { useMemo, useState } from "react";

export const useReservationSearch = (records: any[]) => {
  const [emailSearch, setEmailSearch] = useState("");
  const [petSearch, setPetSearch] = useState("");
  const [doctor, setDoctor] = useState("all");
  const [service, setService] = useState("all");

  const doctorOptions = useMemo(() => {
    const doctors = Array.from(
      new Set(
        records
          .map((r) => r.doctor?.userName)
          .filter(Boolean)
      )
    );

    return [
      { label: "All Doctors", value: "all" },
      ...doctors.map((d) => ({ label: d, value: d })),
    ];
  }, [records]);

  const serviceOptions = useMemo(() => {
    const services = Array.from(
      new Set(
        records
          .map((r) => r.service?.title)
          .filter(Boolean)
      )
    );

    return [
      { label: "All Services", value: "all" },
      ...services.map((s) => ({ label: s, value: s })),
    ];
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesEmail =
        !emailSearch ||
        r.petOwner?.email
          ?.toLowerCase()
          .includes(emailSearch.toLowerCase());

      const matchesPet =
        !petSearch ||
        r.pet?.name
          ?.toLowerCase()
          .includes(petSearch.toLowerCase());

      const matchesDoctor =
        doctor === "all" || r.doctor?.userName === doctor;

      const matchesService =
        service === "all" || r.service?.title === service;

      return (
        matchesEmail &&
        matchesPet &&
        matchesDoctor &&
        matchesService
      );
    });
  }, [records, emailSearch, petSearch, doctor, service]);

  return {
    filteredRecords,
    emailSearch,
    setEmailSearch,
    petSearch,
    setPetSearch,
    doctor,
    setDoctor,
    service,
    setService,
    doctorOptions,
    serviceOptions,
  };
};
