import React from "react";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import UserPetClinicProfile from "../UserProfile/UserProfile";
import ContactUs from "../ContactUs/ContactUs";

export default function Home() {
  return (
    <>
      <UserPetClinicProfile />
      <CategorySlider />
      <ContactUs />
    </>
  );
}
