import React from "react";
import CatBanner from "../../assets/images/R.png"; 
import BoneIcon from "../../assets/images/bone.svg";
import styles from './ProductsHero.module.css';

const ProductsHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-stone-900 min-h-[300px] md:min-h-[70vh] flex items-center">
      <div 
        
         className={`absolute left-50 top-30 sm:left-130 sm:top-30 z-10 opacity-80 ${styles['animate-bone-spin']}`}
      >
        <img
          src={BoneIcon} 
          alt="Decorative Spinning Bone Icon"
          className="w-13 h-13 sm:w-15 sm:h-15" 
        />
      </div>

    
      <div className="relative z-10 max-w-6xl px-4 sm:px-6 lg:px-8 ">
        <div className="text-white space-y-2">
          <p className="text-3xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl">
          Find the Best Pet Care Products
  
          </p>
          <p className="text-xl tracking-tight sm:text-2xl lg:text-2xl">
          
          Trusted, Petique Essentials for Your Pet’s Health
          </p>
          <div className="flex items-center space-x-2 text-1xl">
            <a href="/" className="text-orange-400 hover:text-orange-300 transition-colors">
              Home
            </a>
            <span className="text-orange-400 opacity-60">
              -&gt;
            </span>
            <span className="text-white font-semibold">
              Products
            </span>
          </div>
        </div>
      </div>

<div className="absolute inset-x-0 bottom-0">
  <div className="relative z-20 h-10 w-full bg-white sm:h-16"></div> 
  
  <div className="absolute right-0 bottom-0 z-30 w-full sm:max-w-md overflow-hidden **h-[350px] sm:h-[450px]**">
    <img
      src={CatBanner}
      alt="Relaxing Cat"
      
      className="**w-full h-full object-cover object-bottom**" 
    />
  </div>
</div>
    </section>
  );
};

export default ProductsHero;