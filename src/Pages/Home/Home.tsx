import About from "../../Components/About/About";
import CategorySlider from "../../Components/CategorySlider/CategorySlider";
import Stuff from "../../Components/Stuff/Stuff";
import HeroSection from "./HeroSection/Herosection";
import ServicesSection from "./ServicesSection/ServicesSection";
import ProductSlider2 from "../../Components/Products/ProductSlider2";
import FAQ from "../../Components/FAQ/FAQ";
import  Quote  from "../../Components/Quote/Quote";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySlider />
      <ProductSlider2/>
      <Quote />
      <ServicesSection />
       <section id="team"><Stuff /></section>
       <section id="about"><About /></section>
       <section id="faq"><FAQ /></section>
    </>
  );
}
