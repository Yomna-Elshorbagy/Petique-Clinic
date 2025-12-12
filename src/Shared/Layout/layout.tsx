import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import ChatWidget from "../../Components/Chat/ChatWidget";


export default function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <ChatWidget />
      <Footer />
    </>
  );
}
