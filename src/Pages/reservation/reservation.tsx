import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Star } from "lucide-react";
import Modal from "react-modal";
import { PawPrint } from "lucide-react";
import type { IAppointment } from "../../Interfaces/IAppointment ";
import type { IUser } from "../../Interfaces/IUser";
import { AxiosError } from "axios";
import type { IPet } from "../../Interfaces/Ipet";
import type { IService } from "../../Interfaces/IService";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import React from "react";
import { useTranslation } from "react-i18next";

type ReservationPayload = {
  petOwner: string;
  pet: string;
  service: string;
  doctor: string;
  date: string;
  timeSlot: string;
  notes?: string;
};

export default function Reservation() {
  const [step, setStep] = useState<number>(1);
  const [pet, setPet] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [doctor, setDoctor] = useState<string | "">("");
  const [date, setDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  console.log(i18n.language);
  const isRTL = i18n.language === "ar";

  const stepKeys = [
    t("reservation.steps.pet"),
    t("reservation.steps.service"),
    t("reservation.steps.doctor"),
    t("reservation.steps.dateTime"),
    t("reservation.steps.notes"),
  ];
  const orderedSteps = isRTL ? [...stepKeys].reverse() : stepKeys;
  const totalSteps = stepKeys.length;

  const token = localStorage.getItem("accessToken");
  let userId: string | null = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log(payload);
      userId = payload._id || payload.id || payload.userId || null;
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }

  console.log("User ID:", userId);

  const timeOptions = React.useMemo(
    () => [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "01:00 PM",
      "01:30 PM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
    ],
    []
  );

  // Fetch Pets
  const { data: pets } = useQuery<IPet[]>({
    queryKey: ["pets"],
    queryFn: async () => {
      if (!token) return [];
      const res = await axios.get("http://localhost:3000/pet/userPet", {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token,
  });

  // Fetch Services
  const { data: services } = useQuery<IService[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/service");
      return res.data.data;
    },
  });

  // Fetch Doctors
  const { data: doctors = [] } = useQuery<IUser[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      if (!token) return [] as IUser[];
      const res = await axios.get("http://localhost:3000/user/allUsers", {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data.filter((u: IUser) => u.role === "doctor") as IUser[];
    },
    enabled: !!token,
  });

  // Create Reservation

  console.log("User ID:", userId);
  console.log({
    petOwner: userId,
    pet,
    service,
    doctor,
    date,
    timeSlot,
    notes,
  });

  const [availableTimes, setAvailableTimes] = useState<string[]>(timeOptions);

  const { data: allReservations } = useQuery<IAppointment[]>({
    queryKey: ["allReservations"],

    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/reserve", {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token,
  });

  console.log(allReservations);

  useEffect(() => {
    if (!date || !doctor || !allReservations) return;

    const bookedTimes = allReservations
      .filter((r) => r.date?.split("T")[0] === date && r.doctor?._id === doctor)
      .map((r) => r.timeSlot);

    const filteredTimes = timeOptions.filter((t) => !bookedTimes.includes(t));
    setTimeout(() => {
      setAvailableTimes(filteredTimes);
      if (timeSlot && !filteredTimes.includes(timeSlot)) setTimeSlot("");
    }, 0);
  }, [date, doctor, allReservations, timeSlot, timeOptions]);

  // Create Reservation
  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Invalid token");

      const payload: ReservationPayload = {
        petOwner: userId,
        pet,
        service,
        doctor,
        date,
        timeSlot,
      };
      if (notes) payload.notes = notes;

      const res = await axios.post(
        "http://localhost:3000/reserve",
        { petOwner: userId, pet, service, doctor, date, timeSlot, notes },
        { headers: { authentication: `bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: t("reservation.successTitle"),
        text: t("reservation.successMessage"),
        icon: "success",
        confirmButtonColor: "#b89c86",
      });

      setShowModal(false);
      setStep(1);
      setPet("");
      setService("");
      setDoctor("");
      setDate("");
      setTimeSlot("");
      setNotes("");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409)
        toast.error("This time slot is already taken.");
      else toast.error("Failed to create reservation");
    },
  });

  const [next5Days, setNext5Days] = useState<{ abbr: string; iso: string }[]>(
    []
  );
  useEffect(() => {
    const today = new Date();
    const clinicDays = ["Sun", "Mon", "Tue", "Wed", "Thu"];
    const arr: { abbr: string; iso: string }[] = [];

    let added = 0;
    const checkDate = new Date(today);

    while (added < 5) {
      const dayAbbr = checkDate.toLocaleDateString("en-US", {
        weekday: "short",
      });
      if (clinicDays.includes(dayAbbr)) {
        arr.push({ abbr: dayAbbr, iso: checkDate.toISOString().split("T")[0] });
        added++;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }

    setTimeout(() => {
      setNext5Days(arr);
    }, 0);
  }, []);

  const showAlert = (title: string, message: string) => {
    Swal.fire({
      title,
      text: message,
      icon: "error",
      confirmButtonColor: "#b89c86",
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 space-y-6 mt-10 font-serif">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
            Petique
            <PawPrint className="w-5 h-5 text-[#e9a66f] dark:text-[var(--color-dark-accent)]" />
          </h1>
        </div>

        <p className="text-2xl font-bold mb-6 text-center text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
          {t("reservation.title")}
        </p>

        <div className="flex gap-6 rounded-xl p-6 shadow-lg bg-white dark:bg-[var(--color-dark-card)] border border-green-50 dark:border-[var(--color-dark-accent)]/20 transition-colors duration-300">
          {/* Left image */}
          <div className="w-2/5 max-h-[600px] overflow-hidden rounded-xl hidden md:block">
            <img
              src="https://i.pinimg.com/736x/27/de/c9/27dec9a621e90a7d93c946ce086e95e4.jpg"
              alt="Reservation"
              className="object-cover w-full h-full"
            />
          </div>

          {/*right steps */}
          <div className="flex-1 space-y-6">
            {/* Step Indicator */}
            <div
              className={`flex items-center w-full ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {orderedSteps.map((label, index) => {
                const stepNum = isRTL ? totalSteps - index : index + 1;
                const isActive = step === stepNum;
                const isCompleted = step > stepNum;

                return (
                  <div
                    key={label}
                    className="flex-1 relative flex flex-col items-center"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold 
          ${
            isCompleted
              ? "bg-green-500"
              : isActive
              ? "bg-[#e9a66f]"
              : "bg-gray-300"
          }`}
                    >
                      {stepNum}
                    </div>
                    {/* Label */}
                    <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      {label}
                    </span>
                    {/* Line */}
                    {index < 4 && (
                      <div
                        className={`absolute top-3 left-1/2 w-full h-1 bg-gray-300 -z-10`}
                        style={{
                          marginLeft: "16px",
                          marginRight: "-16px",
                          zIndex: 0,
                        }}
                      >
                        <div
                          className={`h-1 ${
                            isCompleted ? "bg-green-500" : "bg-gray-300"
                          }`}
                          style={{ width: "100%" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1 */}
              <div className={`p-4 }`}>
                <h2 className="text-lg font-medium mb-2 flex items-center gap-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  {t("reservation.selectPet")}{" "}
                  <PawPrint className="w-5 h-5 text-[#e9a66f] dark:text-[var(--color-dark-accent)]" />
                </h2>
                <select
                  className="w-full p-2 border-0 bg-orange-50 dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] rounded"
                  value={pet}
                  onChange={(e) => {
                    setPet(e.target.value);
                    setStep(2);
                  }}
                >
                  <option value=""> {t("reservation.choosePet")}</option>
                  {pets?.map((p: IPet) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2 */}
              <div className="p-4">
                <h2 className="text-lg font-medium mb-2 flex items-center gap-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  {t("reservation.selectService")}
                  <PawPrint className="w-5 h-5 text-[#e9a66f] dark:text-[var(--color-dark-accent)]" />
                </h2>
                <select
                  className="w-full p-2 border-0 bg-orange-50 dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] rounded"
                  value={service}
                  onChange={(e) => {
                    setService(e.target.value);
                    setStep(3);
                  }}
                >
                  <option value=""> {t("reservation.selectService")}</option>
                  {services?.map((s: IService) => (
                    <option key={s._id} value={s._id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3 */}
              <div className="p-4">
                <h2 className="text-lg font-medium mb-2 flex items-center gap-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  {t("reservation.selectDoctor")}
                  <PawPrint className="w-5 h-5 text-[#e9a66f] dark:text-[var(--color-dark-accent)]" />
                </h2>
                <select
                  className="w-full p-2 border-0 bg-orange-50 dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] outline-none rounded"
                  value={doctor}
                  onChange={(e) => {
                    setDoctor(e.target.value);
                    setStep(4);
                  }}
                >
                  <option value="">{t("reservation.selectDoctor")}</option>
                  {doctors?.map((d: IUser) => (
                    <option key={d._id} value={d._id}>
                      {d.userName}
                    </option>
                  ))}
                </select>
              </div>

              {doctor && (
                <div className="rounded-lg shadow-md bg-white dark:bg-[var(--color-dark-card)] border border-gray-200 dark:border-[var(--color-dark-accent)]/20 flex items-center gap-4 transition-colors duration-300">
                  <img
                    src={
                      doctors.find((d) => d._id === doctor)?.image
                        ?.secure_url || "https://via.placeholder.com/60"
                    }
                    alt={doctors.find((d) => d._id === doctor)?.userName}
                    className="w-16 h-16 rounded-full object-cover border ml-2"
                  />
                  {/* Doctor Info */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 dark:text-[var(--color-dark-text)]">
                      {doctors.find((d) => d._id === doctor)?.userName}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {doctors.find((d) => d._id === doctor)?.email}
                    </span>
                    <span className="text-sm text-gray-500">
                      {doctors.find((d) => d._id === doctor)?.mobileNumber}
                    </span>

                    <div className="flex items-center gap-1 mt-2 mb-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" />
                      ))}
                      <span className="text-xs text-gray-500">(5.0)</span>
                    </div>
                  </div>
                </div>
              )}

              {step >= 4 && (
                <div className="flex-1">
                  <h2 className="text-lg font-medium flex items-center gap-2 p-3 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                    {t("reservation.selectDateTime")}{" "}
                    <PawPrint className="w-5 h-5 text-[#e9a66f] dark:text-[var(--color-dark-accent)]" />
                  </h2>

                  <div className="flex gap-3 justify-start p-4  ">
                    <div className="flex gap-3 justify-start">
                      {next5Days.map((d) => (
                        <div key={d.iso} className="flex flex-col items-center">
                          <span className="text-xs mb-1">{d.abbr}</span>
                          <button
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
          ${
            date === d.iso
              ? "bg-[#e9a66f] text-white"
              : "bg-orange-200 text-orange-700"
          }`}
                            onClick={() => {
                              setDate(d.iso);
                              if (step < 4) setStep(4);
                            }}
                          >
                            {date === d.iso && (
                              <span className="text-sm font-bold text-white">
                                ✓
                              </span>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {date && doctor && (
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto w-60">
                      {timeOptions.map((t) => {
                        const isAvailable = availableTimes.includes(t);

                        return (
                          <button
                            key={t}
                            disabled={!isAvailable}
                            className={`text-xs px-1 py-1 rounded border transition-colors
            ${
              timeSlot === t
                ? "bg-[#e9a66f] text-white border-[#e9a66f]"
                : !isAvailable
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                : "bg-gray-100 dark:bg-[var(--color-dark-background)] border-gray-300 dark:border-[var(--color-dark-accent)]/30 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]"
            }`}
                            onClick={() => {
                              if (isAvailable) {
                                setTimeSlot(t);
                                if (step === 4) setStep(5);
                              }
                            }}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 5 */}
              <div className={`p-4 }`}>
                <h2 className="text-lg font-medium mb-2 flex items-center gap-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  {t("reservation.notesLabel")}
                  <PawPrint className="w-5 h-5 text-[#e9a66f] dark:text-[var(--color-dark-accent)]" />
                </h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded bg-white dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] border-gray-300 dark:border-[var(--color-dark-accent)]/30"
                  placeholder={t("reservation.notesPlaceholder")}
                />

                {/* Confirm Button */}
                {timeSlot && (
                  <button
                    onClick={() => {
                      if (!service || !doctor || !date || !timeSlot) {
                        showAlert(
                          t("reservation.errors.missingFieldTitle"),
                          t("reservation.errors.missingFields")
                        );
                        return;
                      }

                      if (!pets || pets.length === 0) {
                        showAlert(
                          t("reservation.errors.noPetsTitle"),
                          t("reservation.errors.noPets")
                        );
                        return;
                      }

                      if (!pet) {
                        showAlert(
                          t("reservation.errors.nopetSelected"),
                          t("reservation.errors.petNotSelected")
                        );
                        return;
                      }

                      setShowModal(true);
                    }}
                    className="bg-[#e9a66f] text-white py-2 px-4 rounded mt-4 w-full"
                  >
                    {t("reservation.confirm")}{" "}
                  </button>
                )}
              </div>
              <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                className="max-w-lg mx-auto mt-20 p-6 bg-white dark:bg-[var(--color-dark-card)] rounded-xl shadow-lg"
              >
                <h2 className="text-xl font-bold mb-4 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  {t("reservation.modal.title")}
                </h2>
                <div className="space-y-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  <p>
                    <strong>{t("reservation.modal.pet")}:</strong>{" "}
                    {pets?.find((p) => p._id === pet)?.name}
                  </p>
                  <p>
                    <strong>{t("reservation.modal.service")}:</strong>{" "}
                    {services?.find((s) => s._id === service)?.title}
                  </p>
                  <p>
                    <strong>{t("reservation.modal.doctor")}:</strong>{" "}
                    {doctors?.find((d) => d._id === doctor)?.userName}
                  </p>
                  <p>
                    <strong>{t("reservation.modal.date")}:</strong> {date}
                  </p>
                  <p>
                    <strong>{t("reservation.modal.time")}:</strong> {timeSlot}
                  </p>
                  <p>
                    <strong>{t("reservation.modal.notes")}:</strong>{" "}
                    {notes || "None"}
                  </p>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded bg-white dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] border-gray-300 dark:border-[var(--color-dark-accent)]/30 hover:bg-gray-50 dark:hover:bg-[var(--color-dark-background)]/80"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!userId) {
                        toast.error("Invalid token, cannot get user ID");
                        return;
                      }

                      mutation.mutate();
                    }}
                    className="px-4 py-2 bg-[#e9a66f] text-white rounded"
                  >
                    Confirm
                  </button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32 bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] py-16 px-6 shadow-inner font-serif transition-colors duration-300">
        <h2 className="text-5xl font-bold text-center mb-12 text-gray-900 dark:text-[var(--color-dark-text)] leading-snug">
          {t("hero.happyCustomersLine1")}
          <br />
          {t("hero.happyCustomersLine2")}
        </h2>

        <Swiper
          key={i18n.language}
          modules={[Autoplay]}
          navigation={false}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="max-w-7xl mx-auto"
        >
          {services?.map((service) => {
            const img1 =
              service.subImages?.[2]?.secure_url || service.image?.secure_url;
            const img2 = service.subImages?.[1]?.secure_url || img1;

            return (
              <SwiperSlide key={service._id}>
                <div
                  onClick={() => navigate(`/service/${service._id}`)}
                  className="bg-white dark:bg-[var(--color-dark-card)] rounded-lg shadow-md overflow-hidden 
                       w-full flex flex-col items-center group cursor-pointer transition-colors duration-300"
                >
                  <div className="relative w-full h-[360px] overflow-hidden rounded-t-lg">
                    <img
                      src={img1}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover
                           transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                    />
                    <img
                      src={img2}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover
                           transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    />
                  </div>

                  <div className="text-center bg-white dark:bg-[var(--color-dark-card)] transition-colors duration-300">
                    <h3
                      className="text-lg font-bold mb-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] text-ellipsis overflow-hidden line-clamp-1 mt-3
             transition-colors duration-300 group-hover:text-[#e9a66f] dark:group-hover:text-[var(--color-dark-accent)]"
                      style={{ fontSize: 25 }}
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
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
}
