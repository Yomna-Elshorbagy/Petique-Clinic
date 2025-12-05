import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import Checkout from "../Checkout/Checkout";
import LowestPriceProducts from "../../Components/Products/LowestPriceProducts";


export default function Home() {
  return (
    <>
      <CategorySlider />

      <LowestPriceProducts />
      
      <Checkout />
    </>
  );
}
