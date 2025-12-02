import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Shared/Layout/layout";
import Home from "./Pages/Home/Home";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthLayout from "./Shared/AuthLayout/AuthLayout";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import OtpConfirmation from "./Pages/Otp/OtpConfirmation";
import ContactUs from "./Pages/ContactUs/ContactUs";
import Checkout from "./Pages/Checkout/Checkout";
import DashboardEcoLayout from "./Dashboard/DashboardEcoLayout";
import DashboardEcoHome from "./Dashboard/Pages/Home/DashboardEcoHome";
import Products from "./Pages/Products/Products";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import DashboardHome from "./Reservation/Pages/DashboardHome/DashboardHome";
import Reservations from "./Reservation/Pages/Reservations/Reservations";
import DashboardLayout from "./Reservation/DashboardLayout";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "contact", element: <ContactUs /> },
      { path: "checkout", element: <Checkout /> },
      { path: "products", element: <Products /> },
      { path: "product-details/:id", element: <ProductDetails /> },
    ],
  },
  {
    path: "",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgetPass", element: <ForgetPassword /> },
      { path: "otp", element: <OtpConfirmation /> },
    ],
  },
  {
    path: "ecoDashboard",
    element: <DashboardEcoLayout />,
    children: [
      { path: "", element: <DashboardEcoHome /> },
    ],
  },
  {
    path: "resDashboard",
    element: <DashboardLayout />,
    children: [
      { path: "", element: <DashboardHome /> },
      { path: "reservations", element: <Reservations /> },
    ],
  },
]);

export default function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </QueryClientProvider>
    </>
  );
}
