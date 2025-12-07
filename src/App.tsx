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
import Reservation from "./Pages/reservation/reservation";
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
import ProductsDashboared from './Dashboard/Pages/Products/Products';
import Orders from "./Dashboard/Pages/Orders/Orders";
import Coupons from "./Dashboard/Pages/Coupons/Coupons";
import MedicalHistory from "./Reservation/Pages/MedicalHistory/MedicalHistory";
import Reservationpet from './Reservation/Pages/ResevationPet/Reservationpet';
import CategoriesDashboared from "./Dashboard/Pages/Categories/Categories";
import Users from "./Dashboard/Pages/Users/Users";
import Reports from "./Dashboard/Pages/Reports/Reports";
import Emails from "./Dashboard/Pages/Emails/Emails";
import OrderDetails from "./Pages/OrderDetails/OrderDetails";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "contact", element: <ContactUs /> },
      { path: "reservation", element: <Reservation/> },
      { path: "service", element: <Services/> },
      { path: "service/:id", element: <Servicesdetails/> },


      { path: "checkout", element: <Checkout /> },
      { path: "products", element: <Products /> },
      { path: "cart", element: <Cart /> },
      { path: "product-details/:id", element: <ProductDetails /> },
      {path:"orderdetails", element:<OrderDetails />},
      { path: "clinicReviews", element: <ClinicReviews /> },
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
      { path: "orders", element: <Orders /> },
      { path: "Categories", element: <CategoriesDashboared /> },
      { path: "products", element: <ProductsDashboared /> },
      { path: "coupons", element: <Coupons /> },
      { path: "users", element: <Users /> },
      { path: "emails", element: <Emails /> },
      { path: "reports", element: <Reports /> },
    ],
  },
  {
    path: "resDashboard",
    element: <DashboardLayout />,
    children: [
      { path: "", element: <DashboardHome /> },
      { path: "animals", element: <Animals /> },
      { path: "reserv", element: <Reservationpet /> },
      { path: "animalCategory", element: <AnimalCategories /> },
      { path: "doctors", element: <Doctors /> },
      { path: "vaccinations", element: <Vaccinations /> },
      { path: "medical", element: <MedicalHistory /> },
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
