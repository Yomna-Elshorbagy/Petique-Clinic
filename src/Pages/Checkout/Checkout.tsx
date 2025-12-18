import React from "react";
import CheckoutForm from "./components/CheckoutForm";
import OrderSummary from "./components/OrderSummary";
import SEO from "../../Components/SEO/SEO";

const Checkout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] transition-colors duration-300 font-sans mt-20">
      <SEO
        title="CheckOut | Petique Clinic"
        description="View your past pet service orders and purchase history at Petique Clinic."
      />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-start">
          {/* Left Column: Form */}
          <CheckoutForm />

          {/* Right Column: Order Summary */}
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
