import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ProtectedRoutes from "./Shared/ProtectedRoutes/ProtectedRoutes";
import AdminProtectedRoute from "./Shared/ProtectedRoutes/AdminProtectedRoutes";
import DoctorProtectedRoute from "./Shared/ProtectedRoutes/DoctorProtectedRoutes";
import NotFoundPage from "./Components/NotFound/NotFound";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoaderPage from "./Shared/LoaderPage/LoaderPage";
import { SocketProvider } from "./contexts/SocketContext";
import StaffApointments from "./Staff/Pages/Appointments/StaffApointments";
import Clients from "./Staff/Pages/Clients/Clients";
import PetRecords from "./Staff/Pages/PetRecords/PetRecords";
import StaffVaccinations from "./Staff/Pages/Vaccinations/StaffVaccinations";
import StaffLayout from "./Staff/StaffLayout";
import StaffReservation from "./Staff/Pages/StaffReservation/StaffReservation";

// ===> Lazy imports
const Layout = lazy(() => import("./Shared/Layout/layout"));
const Home = lazy(() => import("./Pages/Home/Home"));
const ContactUs = lazy(() => import("./Pages/ContactUs/ContactUs"));
const Services = lazy(() => import("./Pages/Services/services"));
const Servicesdetails = lazy(
  () => import("./Pages/Servicedetails/servicedetails")
);
const Blog = lazy(() => import("./Pages/blog/blog"));
const Reservation = lazy(() => import("./Pages/reservation/reservation"));
const UserPetClinicProfile = lazy(
  () => import("./Pages/UserProfile/UserProfile")
);
const Checkout = lazy(() => import("./Pages/Checkout/Checkout"));
const Products = lazy(() => import("./Pages/Products/Products"));
const Cart = lazy(() => import("./Pages/Cart/Cart"));
const ProductDetails = lazy(
  () => import("./Pages/ProductDetails/ProductDetails")
);
const OrderDetails = lazy(() => import("./Pages/OrderDetails/OrderDetails"));
const ClinicReviews = lazy(() => import("./Pages/ClinicReviews/ClinicReviews"));
const ChatPage = lazy(() => import("./Pages/Chat/ChatPage"));

// ==> Auth
const AuthLayout = lazy(() => import("./Shared/AuthLayout/AuthLayout"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Register = lazy(() => import("./Pages/Register/Register"));
const ForgetPassword = lazy(
  () => import("./Pages/ForgetPassword/ForgetPassword")
);
const OtpConfirmation = lazy(() => import("./Pages/Otp/OtpConfirmation"));

// ===> Dashboards
const DashboardEcoLayout = lazy(() => import("./Dashboard/DashboardEcoLayout"));
const DashboardEcoHome = lazy(
  () => import("./Dashboard/Pages/Home/DashboardEcoHome")
);
const Orders = lazy(() => import("./Dashboard/Pages/Orders/Orders"));
const ProductsDashboared = lazy(
  () => import("./Dashboard/Pages/Products/Products")
);
const CategoriesDashboared = lazy(
  () => import("./Dashboard/Pages/Categories/Categories")
);
const Coupons = lazy(() => import("./Dashboard/Pages/Coupons/Coupons"));
const Users = lazy(() => import("./Dashboard/Pages/Users/Users"));
const Emails = lazy(() => import("./Dashboard/Pages/Emails/Emails"));
const Reports = lazy(() => import("./Dashboard/Pages/Reports/Reports"));
const OverView = lazy(() => import("./Dashboard/Pages/OverView/OverView"));

// ==> Reservation Dashboard
const DashboardLayout = lazy(() => import("./Reservation/DashboardLayout"));
const DashboardHome = lazy(
  () => import("./Reservation/Pages/DashboardHome/DashboardHome")
);
const Animals = lazy(() => import("./Reservation/Pages/Animals/Animals"));
const Reservationpet = lazy(
  () => import("./Reservation/Pages/ResevationPet/Reservationpet")
);
const AnimalCategories = lazy(
  () => import("./Reservation/Pages/AnimalCategories/AnimalCategories")
);
const Doctors = lazy(() => import("./Reservation/Pages/Doctors/Doctors"));
const Vaccinations = lazy(
  () => import("./Reservation/Pages/Vaccination/Vaccinations")
);
const MedicalHistory = lazy(
  () => import("./Reservation/Pages/MedicalHistory/MedicalHistory")
);
const ServiceDashbored = lazy(
  () => import("./Reservation/Pages/Services/Service")
);

const ChatReservation = lazy(
  () => import("./Reservation/Pages/Chat/ChatReservation")
);

const ChatEcoDashboard = lazy(
  () => import("./Dashboard/Pages/Chat/ChatEcoDashboard")
);

const ChatStaffDashboard = lazy(
  () => import("./Staff/Pages/Chat/ChatStaffDashboard")
);

const Staff = lazy(() => import("./Reservation/Pages/Staff/Staff"));

//==> NotFound

const NotFoundAnimated = lazy(() => import("./Components/NotFound/NotFound"));

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
      {
        path: "chat",
        element: <ChatPage />,
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
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "staff",
    element: <StaffLayout />,
    children: [
      { path: "", element: <StaffApointments /> },
      { path: "reservation", element: <StaffReservation /> },
      { path: "appointments", element: <StaffApointments /> },
      { path: "clients", element: <Clients /> },
      { path: "petRecord", element: <PetRecords /> },
      { path: "chat", element: <ChatStaffDashboard /> },
      { path: "vaccinations", element: <StaffVaccinations /> },
      { path: "*", element: <NotFoundPage /> },
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
        path: "chat",
        element: (
          <AdminProtectedRoute>
            {" "}
            <ChatEcoDashboard />
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
      { path: "*", element: <NotFoundAnimated /> },
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
      {
        path: "staff",
        element: (
          <DoctorProtectedRoute>
            {" "}
            <Staff />
          </DoctorProtectedRoute>
        ),
      },
      {
        path: "chat",
        element: (
          <DoctorProtectedRoute>
            {" "}
            <ChatReservation />
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
      <GoogleOAuthProvider clientId="700704531343-884jrghj44cpak2fo1na231uudd889nj.apps.googleusercontent.com">
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <SocketProvider>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-screen text-lg font-semibold">
                    <LoaderPage />
                  </div>
                }
              >
                <RouterProvider router={router} />
              </Suspense>
            </SocketProvider>
          </Provider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </>
  );
}
