import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import LowestPriceProducts from "../../Components/Products/LowestPriceProducts";
import HeroSection from "./HeroSection/Herosection";

export default function Home() {
  return (
    <>
      <HeroSection /> 
      <CategorySlider />
      <LowestPriceProducts />
    </>
  );
}
