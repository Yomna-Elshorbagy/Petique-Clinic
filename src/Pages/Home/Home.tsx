import React from "react";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import Checkout from "../Checkout/Checkout";
import HeroSection from "./HeroSection/Herosection";

export default function Home() {
  return (
    <>
      
    <CategorySlider />
    <HeroSection />
      <Checkout />
    </>
  );
}
