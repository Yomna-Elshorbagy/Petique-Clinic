import SEO from "../../../Components/SEO/SEO";
import ReservationStats from "./Components/ReservationStats";
import TodayReservationsList from "./Components/TodayReservationsList";

export default function Reservationpet() {
  return (
    <div className="p-6">
      <SEO
        title="Reservation  | Dashboard Petique Clinic"
        description="Manage and monitor reservation slots, booking bets, and scheduling availability."
      />

      <ReservationStats />

      <h3 className="text-xl font-semibold mt-8 mb-3">Today’s Reservations</h3>
      <TodayReservationsList />
    </div>
  );
}
