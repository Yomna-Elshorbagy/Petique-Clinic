import About from "../../Components/About/About";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import Stuff from "../../Components/Stuff/Stuff";
import LowestPriceProducts from "../../Components/Products/LowestPriceProducts";
import HeroSection from "./HeroSection/Herosection";

export default function Home() {
  return (
    <>
      <HeroSection /> 
      <CategorySlider />
      <About/>
      <Stuff/>
      <LowestPriceProducts />
    </>
  );
}
