import bunny from "../../assets/images/shap-33.jpg";
import pet from "../../assets/images/pet3.jpg";
import AboutHeader from "./components/AboutHeader";
import Card from './components/Card';
import FeaturesList from "./components/FeaturesList";

export default function About() {
    return (
        <>
            <section className='relative px-6 py-20 bg-[#FAF8F4]'>
                <div>
                    <img
                        src={bunny}
                        alt="Bunny"
                        className="absolute -left-1 top-90 w-33 pointer-events-none hidden md:block"
                    />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 md:pl-35 items-center'>
                    {/* about us column */}
                    <div className="flex flex-col space-y-4">
                        <AboutHeader/>
                        <h2 className="font-bold text-(--color-light-dark) text-4xl font-['Playfair_Display']">
                            We Providing The Best Pet Care Services
                        </h2>
                        <Card/>
                        <FeaturesList/>
                    </div>
                    {/* right image */}
                    <img
                        src={pet}
                        alt="Vet holding dog"
                        className="rounded-xl shadow-lg w-full h-4/5"
                    />
                </div>
            </section>
        </>
    );
}
