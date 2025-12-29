import { useState, useMemo } from "react";
import {
  User,
  Dog,
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { useAllDoctors } from "../../../Hooks/Doctor/useDoctor";
import { useServices } from "../../../Hooks/Services/UseServices";
import {
  useCreateFullReservationStaff,
  useStaffReservations,
} from "../../../Hooks/Staff/useStaff";
import { useAnimalCategories } from "../../../Hooks/AnimalCategoey/UseAnimalCategory";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fullReservationSchema,
  type FullReservationFormData,
} from "../../../Utils/Schema/fullReservationSchema";
import Swal from "sweetalert2";

import ClientInfoStep from "./Components/ClientInfoStep";
import PetInfoStep from "./Components/PetInfoStep";
import ReservationStep from "./Components/ReservationStep";

const StaffReservation = () => {
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FullReservationFormData>({
    resolver: zodResolver(fullReservationSchema),
    mode: "onTouched",
    defaultValues: {
      user: { userName: "", email: "", mobileNumber: "", gender: "male" },
      pet: { name: "", age: 0, weight: 0, category: "", allergies: [] },
      reservation: {
        service: "",
        doctor: "",
        date: "",
        timeSlot: "",
        notes: "",
      },
    },
  });

  const formData = watch();
  const { data: doctors } = useAllDoctors();
  const { data: servicesData } = useServices(1, 100);
  const services = servicesData?.data || [];
  const { data: animalCategories } = useAnimalCategories();
  const { mutate: createReservation, isPending } =
    useCreateFullReservationStaff();

  // Fetch taken slots for conflict check
  const { data: doctorReservations } = useStaffReservations(
    {
      doctor: formData.reservation.doctor,
      date: formData.reservation.date,
      isDeleted: false,
    },
    { enabled: !!formData.reservation.doctor && !!formData.reservation.date }
  );

  // Calculate unavailable slots
  const unavailableSlots = useMemo(() => {
    if (!Array.isArray(doctorReservations)) return [];
    return doctorReservations.map((res: any) => res.timeSlot);
  }, [doctorReservations]);

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 0)
      fieldsToValidate = ["user.userName", "user.email", "user.mobileNumber"];
    if (step === 1)
      fieldsToValidate = [
        "pet.name",
        "pet.category",
        "pet.age",
        "pet.weight",
        "pet.allergies",
      ];

    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) {
      setStep((s) => s + 1);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Step",
        text: "Please correct the errors before proceeding.",
        confirmButtonColor: "var(--color-extra-2)",
      });
    }
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleRegistration = (data: FullReservationFormData) => {
    if (unavailableSlots.includes(data.reservation.timeSlot)) {
      Swal.fire({
        icon: "error",
        title: "Time Slot Taken",
        text: "The selected time slot is already reserved. Please choose another one.",
        confirmButtonColor: "var(--color-extra-2)",
      });
      return;
    }

    createReservation(data, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Reservation Created!",
          text: "The client, pet, and appointment have been successfully registered.",
          confirmButtonColor: "var(--color-extra-2)",
        }).then(() => {
          setStep(0);
          reset();
        });
      },
      onError: (err: any) => {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            err?.response?.data?.message ||
            "Something went wrong during creation.",
          confirmButtonColor: "var(--color-extra-2)",
        });
      },
    });
  };

  const steps = [
    { title: "Client Info", icon: <User size={18} /> },
    { title: "Pet Info", icon: <Dog size={18} /> },
    { title: "Reservation", icon: <CalendarIcon size={18} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-3 tracking-tight">
          New Reservation
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          Register clients, pets, and schedule appointments effortlessly.
        </p>
      </div>

      {/* Steper */}
      <div className="flex items-center justify-between mb-12 relative px-4 max-w-2xl mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[var(--color-extra-3)] -translate-y-1/2 z-0"></div>
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-[var(--color-extra-2)] -translate-y-1/2 transition-all duration-700 ease-in-out z-0"
          style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((s, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                step >= idx
                  ? "bg-[var(--color-extra-2)] border-[var(--color-extra-2)] text-white shadow-xl shadow-[var(--color-extra-2)]/20 scale-110"
                  : "bg-white border-[var(--color-extra-3)] text-[var(--color-text-muted)]"
              }`}
            >
              {step > idx ? <Check size={24} strokeWidth={3} /> : s.icon}
            </div>
            <span
              className={`mt-3 text-[13px] font-bold tracking-wide transition-all duration-300 ${
                step >= idx
                  ? "text-[var(--color-extra-2)]"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit(handleRegistration)}
        className="bg-white dark:bg-[var(--color-dark-card)] rounded-3xl shadow-2xl shadow-[var(--color-extra-3)]/50 border border-[var(--color-extra-3)]/40 overflow-hidden animate-fadeIn"
      >
        <div className="p-8 lg:p-12">
          {step === 0 && <ClientInfoStep register={register} errors={errors} />}
          {step === 1 && (
            <PetInfoStep
              register={register}
              errors={errors}
              setValue={setValue}
              animalCategories={animalCategories}
            />
          )}
          {step === 2 && (
            <ReservationStep
              register={register}
              errors={errors}
              formData={formData}
              services={services}
              doctors={doctors || []}
              unavailableSlots={unavailableSlots}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 lg:px-12 py-8 bg-[var(--color-bg-cream)]/50 dark:bg-white/5 border-t border-[var(--color-extra-3)]/60 flex justify-between items-center">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 0}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all duration-300 ${
              step === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-[var(--color-text-muted)] hover:bg-white hover:text-[var(--color-extra-2)] hover:shadow-lg active:scale-95"
            }`}
          >
            <ChevronLeft size={20} /> Previous
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-10 py-3.5 bg-[var(--color-extra-2)] text-white rounded-2xl font-bold flex items-center gap-3 hover:translate-x-1 hover:shadow-xl hover:shadow-[var(--color-extra-2)]/30 transition-all active:scale-95"
            >
              Next Step <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="px-10 py-3.5 bg-[var(--color-extra-2)] text-white rounded-2xl font-bold flex items-center gap-3 hover:shadow-xl hover:shadow-[var(--color-extra-2)]/30 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Confirm Booking{" "}
                  <Check
                    size={20}
                    strokeWidth={3}
                    className="group-hover:scale-110 transition-transform"
                  />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StaffReservation;
