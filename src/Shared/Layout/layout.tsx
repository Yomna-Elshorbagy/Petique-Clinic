import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Reservation from "../../Pages/reservation/reservation";
import Blog from "../../Pages/blog/blog";
import Services from "../../Pages/Services/services";
import Servicesdetails from "../../Pages/Servicedetails/servicedetails";

export default function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Reservation />
      <Blog />
      <Services />
      <Servicesdetails />
      <Footer />
    </>
  );
}
