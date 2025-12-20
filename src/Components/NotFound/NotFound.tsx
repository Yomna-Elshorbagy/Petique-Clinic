import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import noteImg from "../../assets/images/pet.png";
import { HiArrowSmLeft } from "react-icons/hi";



export default function NotFoundAnimated() {
  const numberRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (numberRef.current) {
      gsap.fromTo(
        numberRef.current,
        { y: -100, opacity: 0, scale: 0.5 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "bounce.out" }
      );
    }

    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, delay: 0.5 }
      );
    }
  }, []);

  return (
    <>
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] z-50">
      
      <img
        ref={imageRef}
        src={noteImg}
        alt="Not Found"
        className="w-[400px] md:w-96 animate-bounce-slow"
         style={{
    objectFit: "contain",  
    objectPosition: "center top", 
  }}
      />

      <h1
        ref={numberRef}
        className="text-6xl md:text-9xl font-extrabold text-[var(--color-light-accent)] font-serif"
        style={{marginTop: -190}}
      >
        404
      </h1>

      <h2 className="text-2xl md:text-3xl font-bold mt-8 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]  font-serif">
         Page Not Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6  font-serif">
        Oops! The page you're looking for does not exist.
      </p>
       
    <Link
  to="/home"
  className="flex items-center gap-2 px-6 py-3 bg-[var(--color-light-accent)] text-white font-semibold rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors  font-serif"
>
  <HiArrowSmLeft />
  Go Back Home
</Link>
    </div>
    </>
  );
}

