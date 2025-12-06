import About from "../../Components/About/About";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import Stuff from "../../Components/Stuff/Stuff";
import Checkout from "../Checkout/Checkout";

export default function Home() {
  return (
    <>
      <CategorySlider />
      <Checkout />
      <About/>
      <Stuff/>
    </>
  );
}
