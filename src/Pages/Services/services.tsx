import { Bone } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { IService } from "./../../Interfaces/IService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const fetchServices = async (): Promise<IService[]> => {
  const res = await axios.get("http://localhost:3000/service");
  return res.data.data;
};

export default function Services() {
  const navigate = useNavigate();

  const {
    data: services = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

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
  }, [isLoading]);

  console.log("services data:", services);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  return (
    <>
      <div className="relative  bg-[#1f1b22] h-[360px] px-10 py-10 overflow-visible flex items-center mt-20 font-serif">
        <div className="max-w-7xl text-left pl-100">
          <Bone
            ref={boneRef}
            className="
            bone-icon 
            w-30 h-30 
            text-white 
            drop-shadow-[0_0_10px_#ff9100]
               ml-[-80px]
            
          "
            strokeWidth={2.5}
            color="#e3e3e3"
          />
          <h1 className="text-white text-6xl font-extrabold">Our Services</h1>

          <div className="mt-8 flex justify-start gap-6 text-orange-500 font-medium text-3xl">
            <Link to="/home" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-orange-500"> &gt; </span>
            <p className="text-white font-semibold">Services</p>
          </div>
        </div>
        <img
          src="/src/assets/images/cat-relaxing.png"
          alt="cat"
          className="absolute right-1 bottom-[-120px] w-[600px] z-10"
        />
      </div>

      <div className="mt-40 font-serif">
        <div className="flex flex-wrap justify-center gap-6 px-6">
          {services.map((service: IService) => {
            const img1 =
              service.subImages?.[2]?.secure_url || service.image.secure_url;
            const img2 = service.subImages?.[1]?.secure_url || img1;

            return (
              <div
                key={service._id}
                onClick={() => navigate(`/service/${service._id}`)}
                className="bg-amber-20 rounded-lg shadow-md overflow-hidden 
             w-full sm:w-[45%] lg:w-[25%] flex flex-col items-center group
             cursor-pointer"
              >
                <div className="relative w-full h-90 overflow-hidden rounded-t-lg">
                  <img
                    src={img1}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover
                         transition-opacity duration-300
                         opacity-100 group-hover:opacity-0"
                  />

                  <img
                    src={img2}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover
                         transition-opacity duration-300
                         opacity-0 group-hover:opacity-100"
                  />
                </div>

                <div className="text-center">
                  <h3
                    className="text-lg font-bold mb-2 text-black text-ellipsis overflow-hidden line-clamp-1 mt-3
             transition-colors duration-300 group-hover:text-orange-400"
                    style={{ fontSize: 25 }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-gray-400 mb-4 text-sm text-ellipsis overflow-hidden line-clamp-2 mt-3"
                    style={{ fontSize: 20 }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
