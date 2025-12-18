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
import Services from "./Pages/Services/services";
import Servicesdetails from "./Pages/Servicedetails/servicedetails";

import Checkout from "./Pages/Checkout/Checkout";
import DashboardEcoLayout from "./Dashboard/DashboardEcoLayout";
import DashboardEcoHome from "./Dashboard/Pages/Home/DashboardEcoHome";
import Products from "./Pages/Products/Products";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import DashboardHome from "./Reservation/Pages/DashboardHome/DashboardHome";
import DashboardLayout from "./Reservation/DashboardLayout";
import Cart from "./Pages/Cart/Cart";
import ClinicReviews from "./Pages/ClinicReviews/ClinicReviews";
import Animals from "./Reservation/Pages/Animals/Animals";
import AnimalCategories from "./Reservation/Pages/AnimalCategories/AnimalCategories";
import Doctors from "./Reservation/Pages/Doctors/Doctors";
import Vaccinations from "./Reservation/Pages/Vaccination/Vaccinations";
import ProductsDashboared from "./Dashboard/Pages/Products/Products";
import Orders from "./Dashboard/Pages/Orders/Orders";
import Coupons from "./Dashboard/Pages/Coupons/Coupons";
import MedicalHistory from "./Reservation/Pages/MedicalHistory/MedicalHistory";
import Reservationpet from "./Reservation/Pages/ResevationPet/Reservationpet";
import CategoriesDashboared from "./Dashboard/Pages/Categories/Categories";
import Users from "./Dashboard/Pages/Users/Users";
import Reports from "./Dashboard/Pages/Reports/Reports";
import Emails from "./Dashboard/Pages/Emails/Emails";
import OrderDetails from "./Pages/OrderDetails/OrderDetails";
import ServiceDashbored from "./Reservation/Pages/Services/Service";
import UserPetClinicProfile from "./Pages/UserProfile/UserProfile";
import OverView from "./Dashboard/Pages/OverView/OverView";
import Reservation from "./Pages/reservation/reservation";
import Blog from "./Pages/blog/blog";
import ProtectedRoutes from "./Shared/ProtectedRoutes/ProtectedRoutes";
import AdminProtectedRoute from "./Shared/ProtectedRoutes/AdminProtectedRoutes";
import DoctorProtectedRoute from "./Shared/ProtectedRoutes/DoctorProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "contact", element: <ContactUs /> },
      {
        path: "reservation",
        element: (
          <ProtectedRoutes>
            {" "}
            <Reservation />{" "}
          </ProtectedRoutes>
        ),
      },
      { path: "service", element: <Services /> },
      { path: "service/:id", element: <Servicesdetails /> },
      { path: "blog", element: <Blog /> },
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            {" "}
            <UserPetClinicProfile />{" "}
          </ProtectedRoutes>
        ),
      },

      {
        path: "checkout",
        element: (
          <ProtectedRoutes>
            {" "}
            <Checkout />
          </ProtectedRoutes>
        ),
      },
      { path: "products", element: <Products /> },
      {
        path: "cart",
        element: (
          <ProtectedRoutes>
            {" "}
            <Cart />
          </ProtectedRoutes>
        ),
      },
      { path: "product-details/:id", element: <ProductDetails /> },
      {
        path: "orderdetails",
        element: (
          <ProtectedRoutes>
            {" "}
            <OrderDetails />
          </ProtectedRoutes>
        ),
      },
      {
        path: "clinicReviews",
        element: (
          <ProtectedRoutes>
            {" "}
            <ClinicReviews />{" "}
          </ProtectedRoutes>
        ),
      },
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
      {
        path: "",
        element: (
          <AdminProtectedRoute>
            {" "}
            <DashboardEcoHome />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <AdminProtectedRoute>
            {" "}
            <Orders />{" "}
          </AdminProtectedRoute>
        ),
      },
      {
        path: "Categories",
        element: (
          <AdminProtectedRoute>
            <CategoriesDashboared />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <AdminProtectedRoute>
            {" "}
            <ProductsDashboared />{" "}
          </AdminProtectedRoute>
        ),
      },
      {
        path: "coupons",
        element: (
          <AdminProtectedRoute>
            {" "}
            <Coupons />{" "}
          </AdminProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <AdminProtectedRoute>
            {" "}
            <Users />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "emails",
        element: (
          <AdminProtectedRoute>
            {" "}
            <Emails />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <AdminProtectedRoute>
            <Reports />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "overview",
        element: (
          <AdminProtectedRoute>
            {" "}
            <OverView />
          </AdminProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "resDashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: (
          <DoctorProtectedRoute>
            <DashboardHome />{" "}
          </DoctorProtectedRoute>
        ),
      },
      {
        path: "animals",
        element: (
          <DoctorProtectedRoute>
            {" "}
            <Animals />
          </DoctorProtectedRoute>
        ),
      },
      {
        path: "reserv",
        element: (
          <DoctorProtectedRoute>
            {" "}
            <Reservationpet />{" "}
          </DoctorProtectedRoute>
        ),
      },
      {
        path: "animalCategory",
        element: (
          <DoctorProtectedRoute>
            <AnimalCategories />
          </DoctorProtectedRoute>
        ),
      },
      {
        path: "doctors",
        element: (
          <DoctorProtectedRoute>
            <Doctors />
          </DoctorProtectedRoute>
        ),
      },
      {
        path: "vaccinations",
        element: (
          <DoctorProtectedRoute>
            <Vaccinations />
          </DoctorProtectedRoute>
        ),
      },
      {
        path: "medical",
        element: (
          <DoctorProtectedRoute>
            {" "}
            <MedicalHistory />
          </DoctorProtectedRoute>
        ),
      },
      {
        path: "service",
        element: (
          <DoctorProtectedRoute>
            {" "}
            <ServiceDashbored />
          </DoctorProtectedRoute>
        ),
      },
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
