import { Bone } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { IService } from "../../Interfaces/IService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { useTranslation } from "react-i18next";



const fetchServices = async (): Promise<IService[]> => {
  const res = await axios.get("http://localhost:3000/service");
  return res.data.data;
};

const fetchServiceById = async (id: string): Promise<IService> => {
  const res = await axios.get(`http://localhost:3000/service/${id}`);
  return res.data.data;
};

export default function Servicesdetails() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const {
    data: services = [],
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery<IService[]>({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const { id } = useParams<{ id: string }>();

  const firstServiceId = services[0]?._id;

  const {
    data: service,
    isLoading: isLoadingService,
    isError: isErrorService,
  } = useQuery<IService>({
    queryKey: ["service", id || firstServiceId],
    queryFn: () => fetchServiceById(id || firstServiceId),
    enabled: !!(id || firstServiceId),
  });

  const boneRef = useRef(null);
  const [activeId, setActiveId] = useState<string | null>(service?._id || null);
  useEffect(() => {
    if (service?._id && service._id !== activeId) {
      setActiveId(service._id);
    }
  }, [service, activeId]);

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
  }, [isLoadingService]);

  console.log("services data:", services);

  if (isLoadingAll || isLoadingService) return <p>Loading...</p>;
  if (isErrorAll || isErrorService || !service)
    return <p>Something went wrong</p>;

  const img1 = service.subImages?.[2]?.secure_url || service.image.secure_url;
  const img4 = service.subImages?.[4]?.secure_url || service.image.secure_url;

  const subs =
    service.subImages?.map((img) => img?.secure_url).filter(Boolean) || [];

  const gallery = subs.filter((_, i) => i !== 2);

  const lastImg = subs[subs.length - 1] || service.image.secure_url;
  if (!gallery.includes(lastImg)) {
    gallery.push(lastImg);
  }

  const limitedGallery = gallery.slice(0, 4);

  console.log("BANNER:", img1);
  console.log("GALLERY:", gallery);
  console.log("LIMITED GALLERY:", limitedGallery);

  return (
    <>
      <div className="bg-[#faf9f6]">
        <div className="relative bg-[#1f1b22] h-[360px] px-10 py-10 overflow-visible flex items-center justify-center md:justify-start font-serif">
          <div className="max-w-7xl text-center md:text-left w-full">
            <Bone
              key={i18n.language}
              ref={boneRef}
              className={`bone-icon w-30 h-30 text-white drop-shadow-[0_0_10px_#ff9100] ${
                isRTL ? "ml-0 mr-[-30px] scale-y-[-1]" : "ml-[-30px] mr-0 scale-y-[1]"
              }`}
              strokeWidth={2.5}
              color="#e3e3e3"
            />
            <h1  className={`text-white text-3xl md:text-5xl font-extrabold mt-4 ${
                isRTL ? "text-right" : "text-left"
              }`}>
              {service.title}
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-2 text-1xl justify-center md:justify-start">
              <Link
                to="/home"
                className="text-[#e9a66f] hover:text-white transition-colors"
              >
            {t("serviceDetails.home")}

              </Link>
              <span className="text-[#e9a66f]"> &gt; </span>
              <Link
                to="/service"
                className="text-[#e9a66f] hover:text-white transition-colors"
              >
                {t("serviceDetails.services")}
              </Link>
              <span className="text-[#e9a66f]"> &gt; </span>
              <p className="text-white font-semibold">{service.title}</p>
            </div>
          </div>

          <img
            src="/src/assets/images/cat-relaxing.png"
            alt="cat"
            className={`hidden md:block absolute bottom-[-120px] w-[600px] z-10 ${
              isRTL ? "left-0" : "right-0"
            }`}
          />
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 mx-auto flex flex-col md:flex-row gap-6 font-serif mt-20">
          <div className="flex flex-col md:flex-row gap-8 p-6 ">
            {/* Left Side*/}
            <div className="w-full md:w-1/4 space-y-4">
      <h1 className="font-bold text-4xl">{isRTL ? "الخدمات" : "Services"}</h1>
              {services.map((s) => {
                const serviceImg =
                  s.subImages?.[2]?.secure_url || s.image.secure_url;

                return (
                  <div
                    key={s._id}
                    onClick={() => {
                      setActiveId(s._id);
                      navigate(`/service/${s._id}`);
                    }}
                    className={`flex items-center rounded-full shadow-md p-3 cursor-pointer transition transform hover:scale-105 ${
                      s._id === activeId
                        ? "bg-[#e9a66f] text-white border-2 border-[#e9a66f]"
                        : "bg-white text-black"
                    }`}
                  >
                    <img
                      src={serviceImg}
                      alt={s.title}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <span className={`ml-3 font-semibold ${isRTL ? "mr-3 ml-0" : "ml-3"}`}>{s.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Right Side */}

            <div  className={`w-full md:w-3/4 bg-white p-6 rounded-lg shadow space-y-4 ${
    isRTL ? "text-right" : "text-left"
  }`}>
              <img
                src={img1}
                alt={service.title}
                className="w-full h-[300px] md:h-[600px] object-cover rounded"
              />
              <h1 className="text-2xl font-bold">{service.title}</h1>
              <p className="text-gray-700">{service.description}</p>

              {/* Benefits */}
              {service.benefits && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {service.benefits.split(",").map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <PawPrint className="w-4 h-4 text-[#e9a66f]" />
                        <span className="text-gray-700">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tips */}
              {service.tips && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    Tips
                  </h3>
                  <ul className="space-y-2">
                    {service.tips.split(",").map((t, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <PawPrint className="w-4 h-4 text-[#e9a66f]" />
                        <span className="text-gray-700">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4">
                <img
                  src={img4}
                  alt={service.title}
                  className="w-full h-[220px] md:h-[150px] object-cover rounded hover:scale-105 transition transform "
                />
                {limitedGallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${service.title} ${i + 1}`}
                    className="w-full h-[200px] md:h-[150px]  object-cover rounded hover:scale-105 transition transform "
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
