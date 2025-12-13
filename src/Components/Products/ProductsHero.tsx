import { useEffect, useRef } from "react";
import { Bone } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";


const ProductsHero: React.FC = () => {
    const boneRef = useRef(null);

  useEffect(() => {
    if (boneRef.current) {
      gsap.to(boneRef.current, {
        y: -10,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);
  return (
    <div className="relative bg-[#1f1b22] h-auto px-10 py-10 overflow-visible flex flex-col md:flex-row items-center mt-20 font-serif">
        <div className="max-w-7xl text-center md:text-left md:pl-100">
          <Bone
            ref={boneRef}
            className="
        bone-icon 
        w-30 h-30 
        text-white 
        drop-shadow-[0_0_10px_#ff9100]
        ml-[-60px] md:ml-[-80px] 
        mx-auto md:mx-0
      "
            strokeWidth={2.5}
            color="#e3e3e3"
          />
          <h1 className="text-white text-4xl font-extrabold mt-4">
            SHOP
          </h1>

          <div className="mt-8 flex justify-center md:justify-start gap-6 text-[#e9a66f] font-medium text-1xl">
            <Link to="/home" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-[#e9a66f]"> &gt; </span>
            <p className="text-white font-semibold">Shop</p>
          </div>
        </div>
        <img
          src="/src/assets/images/cat-relaxing.png"
          alt="cat"
          className="hidden md:block absolute md:right-1 md:bottom-[-120px] w-[600px] z-10"
        />
      </div>
  );
};

export default ProductsHero;