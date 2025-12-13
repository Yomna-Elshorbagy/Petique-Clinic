import ReservationStats from "./Components/ReservationStats";
import TodayReservationsList from "./Components/TodayReservationsList";

export default function Reservationpet() {
  return (
    <div className="p-6">
      <ReservationStats />

      <h3 className="text-xl font-semibold mt-8 mb-3">Today’s Reservations</h3>
      <TodayReservationsList />
    </div>
  );
}
