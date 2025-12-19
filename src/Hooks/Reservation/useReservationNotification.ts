import { useEffect, useRef, useState } from "react";
import { getAllReservations } from "../../Apis/ReservationApis";

export const useReservationsNotifications = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prevIdsRef = useRef<string[]>([]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAllReservations({ size: 50 });
      const list = Array.isArray(res.data) ? res.data : [];

      const currentIds = list.map((r: any) => r._id);

      const newOnes =
        prevIdsRef.current.length > 0
          ? list.filter((r: any) => !prevIdsRef.current.includes(r._id))
          : [];

      if (newOnes.length > 0) setHasNew(true);

      prevIdsRef.current = currentIds;
      setReservations(list);
    } catch (err: any) {
      setError(err?.message || "Error loading reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 40000); 
    return () => clearInterval(interval);
  }, []);

  return {
    reservations,
    hasNew,
    loading,
    error,
    clearNew: () => setHasNew(false),
  };
};
