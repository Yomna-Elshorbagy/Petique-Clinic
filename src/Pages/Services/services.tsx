import { Bone } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { IService } from "../../Interfaces/IService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import SEO from "../../Components/SEO/SEO";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { baseURL } from "../../Apis/BaseUrl";
import catImg from "../../assets/images/pic-2.png";

const fetchServices = async (): Promise<IService[]> => {
  const res = await axios.get(`${baseURL}/service`);
  return res.data.data;
};

export default function Services() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

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
    gsap.to(".bone-icon", {
      y: -10,
      x: isRTL ? -10 : 10,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, [isRTL]);

  if (isError) return <p>Something went wrong</p>;

  return (
    <>
      <SEO
        title="Petique Clinic | Veterinary Services"
        description="Explore our full range of veterinary services including checkups, vaccinations, grooming, diagnostics, and emergency care."
      />
      <div className="relative">
        {isLoading && <LoaderPage />}
        <div className="bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] transition-colors duration-300">
          <div className="relative bg-[#86654f] dark:bg-[var(--color-dark-card)] h-auto px-25 py-10 overflow-visible flex items-center justify-center md:justify-start font-serif">
            <div className="max-w-7xl text-center md:text-left w-full">
              <Bone
                key={i18n.language}
                ref={boneRef}
                className={`bone-icon w-25 h-30 text-white ${isRTL
                  ? "ml-0 mr-[-30px] scale-y-[-1]"
                  : "ml-[-30px] mr-0 scale-y-[1]"
                  }`}
                strokeWidth={2.5}
                color="#fde5d3"
              />
              <h1
                className={`text-white text-3xl md:text-4xl font-extrabold mt-4 ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("services.services")}
              </h1>

              <div className="mt-8 flex justify-start md:justify-start gap-6 border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]font-medium text-1xl md:text-1xl">
                <Link to="/home" className="hover:text-white transition-colors">
                  {t("services.home")}
                </Link>
                <span className="border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
                  {" "}
                  &gt;{" "}
                </span>
                <p className="text-white font-semibold">
                  {t("services.ourServices")}
                </p>
              </div>
            </div>

            <img
              src={catImg}
              alt="cat"
              className={`hidden md:block absolute bottom-[-90px] w-[600px] z-10 ${isRTL ? "left-0" : "right-5"
                }`}
            />
          </div>

          <div className="mt-40 font-serif mb-10">
            <div className="flex flex-wrap justify-center gap-6 px-6">
              {services.map((service: IService) => {
                const img1 =
                  service.subImages?.[2]?.secure_url ||
                  service.image.secure_url;
                const img2 = service.subImages?.[1]?.secure_url || img1;

                return (
                  <div
                    key={service._id}
                    onClick={() => navigate(`/service/${service._id}`)}
                    className="bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] rounded-lg shadow-md overflow-hidden 
             w-full sm:w-[45%] lg:w-[25%] flex flex-col items-center group
             cursor-pointer transition-colors duration-300 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]"
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
                        className="text-lg font-bold mb-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] text-ellipsis overflow-hidden line-clamp-1 mt-3
             transition-colors duration-300 group-hover:text-[#e9a66f]"
                        style={{ fontSize: 20 }}
                      >
                        {service.title}
                      </h3>
                      <p
                        className="text-gray-500 dark:text-gray-400 mb-4 text-sm text-ellipsis overflow-hidden line-clamp-2 mt-3"
                        style={{ fontSize: 15 }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
