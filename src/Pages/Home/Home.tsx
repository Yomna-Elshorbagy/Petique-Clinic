import About from "../../Components/About/About";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import Stuff from "../../Components/Stuff/Stuff";
import LowestPriceProducts from "../../Components/Products/LowestPriceProducts";
import HeroSection from "./HeroSection/Herosection";
import ServicesSection from "./ServicesSection/ServicesSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <Stuff />
      <About />
      <CategorySlider />
      <LowestPriceProducts />
    </>
  );
}
