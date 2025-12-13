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
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

export default function Reservation() {
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [pet, setPet] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [doctor, setDoctor] = useState<string | "">("");
  const [date, setDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

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

  const timeOptions = [
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
  ];

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

  console.log(date, doctor);
  console.log(availableTimes);

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
    setAvailableTimes(filteredTimes);

    if (timeSlot && !filteredTimes.includes(timeSlot)) setTimeSlot("");
  }, [date, doctor, allReservations, timeSlot]);

  // Create Reservation
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        "http://localhost:3000/reserve",
        { petOwner: userId, pet, service, doctor, date, timeSlot, notes },
        { headers: { authentication: `bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reservation created successfully");
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
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu"];
    const arr = days.map((abbr, idx) => {
      const d = new Date(today);
      const diff = (idx + 1 - today.getDay() + 7) % 7;
      d.setDate(today.getDate() + diff);
      return { abbr, iso: d.toISOString().split("T")[0] };
    });
    setNext5Days(arr);
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 space-y-6 mt-10  font-serif">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <h1 className="text-3xl font-bold flex items-center gap-2 ">
            Petique
            <PawPrint className="w-5 h-5 text-[#e9a66f]" />
          </h1>
        </div>

        <p className="text-2xl font-bold mb-6 text-center">
          Book your pet's appointment with our expert veterinarians
        </p>

        <div className="flex gap-6 rounded-xl p-6 shadow-lg bg-white border border-green-50">
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
            <div className="flex justify-between items-center mb-6">
              {["Pet", "Service", "Doctor", "Date/Time", "Notes"].map(
                (label, index) => {
                  const stepNum = index + 1;
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
                      <span className="mt-2 text-xs text-gray-600">
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
                }
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1 */}
              <div className={`p-4 }`}>
                <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
                  Select Your Pet{" "}
                  <PawPrint className="w-5 h-5 text-[#e9a66f]" />
                </h2>
                <select
                  className="w-full p-2 border-0  bg-orange-50"
                  value={pet}
                  onChange={(e) => {
                    setPet(e.target.value);
                    setStep(2);
                  }}
                >
                  <option value="">Choose your pet</option>
                  {pets?.map((p: IPet) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2 */}
              <div className="p-4">
                <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
                  Select Service
                  <PawPrint className="w-5 h-5 text-[#e9a66f]" />
                </h2>
                <select
                  className="w-full p-2 border-0  bg-orange-50"
                  value={service}
                  onChange={(e) => {
                    setService(e.target.value);
                    setStep(3);
                  }}
                >
                  <option value="">Select a service</option>
                  {services?.map((s: IService) => (
                    <option key={s._id} value={s._id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3 */}
              <div className="p-4">
                <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
                  Select Doctor
                  <PawPrint className="w-5 h-5 text-[#e9a66f]" />
                </h2>
                <select
                  className="w-full p-2 border-0  bg-orange-50 outline-none"
                  value={doctor}
                  onChange={(e) => {
                    setDoctor(e.target.value);
                    setStep(4);
                  }}
                >
                  <option value="">Select a doctor</option>
                  {doctors?.map((d: IUser) => (
                    <option key={d._id} value={d._id}>
                      {d.userName}
                    </option>
                  ))}
                </select>
              </div>

              {doctor && (
                <div className="rounded-lg shadow-md bg-white border border-gray-200 flex items-center gap-4">
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
                    <span className="font-semibold text-gray-800">
                      {doctors.find((d) => d._id === doctor)?.userName}
                    </span>
                    <span className="text-sm text-gray-500">
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
                  <h2 className="text-lg font-medium flex items-center gap-2 p-3">
                    Select Date & Time
                    <PawPrint className="w-5 h-5 text-[#e9a66f]" />
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
                ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                : "bg-gray-100 border-gray-300"
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
                <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
                  Notes
                  <PawPrint className="w-5 h-5 text-[#e9a66f]" />
                </h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded"
                  placeholder="Optional notes"
                />

                {/* Confirm Button */}
                {timeSlot && (
                  <button
                    onClick={() => {
                      if (!pet || !service || !doctor || !date || !timeSlot) {
                        toast.error("Please complete all required fields");
                        return;
                      }

                      setShowModal(true);
                    }}
                    className="bg-[#e9a66f] text-white py-2 px-4 rounded mt-4 w-full"
                  >
                    Confirm
                  </button>
                )}
              </div>
              <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                className="max-w-lg mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg"
              >
                <h2 className="text-xl font-bold mb-4">Confirm Reservation</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Pet:</strong>{" "}
                    {pets?.find((p) => p._id === pet)?.name}
                  </p>
                  <p>
                    <strong>Service:</strong>{" "}
                    {services?.find((s) => s._id === service)?.title}
                  </p>
                  <p>
                    <strong>Doctor:</strong>{" "}
                    {doctors?.find((d) => d._id === doctor)?.userName}
                  </p>
                  <p>
                    <strong>Date:</strong> {date}
                  </p>
                  <p>
                    <strong>Time:</strong> {timeSlot}
                  </p>
                  <p>
                    <strong>Notes:</strong> {notes || "None"}
                  </p>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded"
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

      <div className="mt-32 bg-[#faf9f6] py-16 px-6  shadow-inner font-serif">
        <h2 className="text-5xl font-bold text-center mb-12 text-gray-900 leading-snug">
          Over 100,000 Happy Customers <br />
          Through the Worldwide
        </h2>

        <Swiper
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
                  className="bg-amber-20 rounded-lg shadow-md overflow-hidden 
                       w-full flex flex-col items-center group cursor-pointer"
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

                  <div className="text-center bg-white">
                    <h3
                      className="text-lg font-bold mb-2 text-black text-ellipsis overflow-hidden line-clamp-1 mt-3
             transition-colors duration-300 group-hover:text-[#e9a66f]"
                      style={{ fontSize: 25 }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="text-gray-400 mb-4 text-sm text-ellipsis overflow-hidden line-clamp-2 mt-3"
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
