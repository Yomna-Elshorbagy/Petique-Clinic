import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Stethoscope, Building2, Syringe } from "lucide-react";
import { useForm } from "react-hook-form";
import { addClinicReview } from "../../../Apis/ClinicReviewsApis";
import { getAllDoctors } from "../../../Apis/DoctoresApis";
import { getAllServices } from "../../../Apis/ServicesApis";
import type { IService } from "../../../Interfaces/IService";
import type { IUser } from "../../../Interfaces/IUser";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ReviewType = "doctor" | "service" | "clinic";

interface ReviewFormInputs {
  comment: string;
  rate: number;
  type: ReviewType;
  targetId?: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedType, setSelectedType] = useState<ReviewType>("clinic");
  const [doctors, setDoctors] = useState<IUser[]>([]);
  const [services, setServices] = useState<IService[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormInputs>({
    defaultValues: {
      type: "clinic",
      rate: 0,
    },
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const docs = await getAllDoctors();
          setDoctors(docs);
          const srvs = await getAllServices(1, 100);
          setServices(srvs.data);
        } catch (error) {
          console.error("Failed to fetch options", error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const onSubmit = async (data: ReviewFormInputs) => {
    if (rating === 0) {
      Swal.fire(
        t("clinicReviews.error"),
        t("clinicReviews.selectRating"),
        "error"
      );
      return;
    }

    try {
      const payload: any = {
        comment: data.comment,
        rate: rating,
      };

      if (data.type === "doctor" && data.targetId) {
        payload.doctor = data.targetId;
      } else if (data.type === "service" && data.targetId) {
        payload.service = data.targetId;
      } else if (data.type === "clinic") {
        payload.clinic = "PetiqueClinic";
      }

      await addClinicReview(payload);
      Swal.fire({
        icon: "success",
        title: t("clinicReviews.thankYou"),
        text: t("clinicReviews.reviewSubmitted"),
        confirmButtonColor: "#E5A46C",
      });
      reset();
      setRating(0);
      setSelectedType("clinic");
      onSuccess();
      onClose();
    } catch (error: any) {
      Swal.fire(
        t("clinicReviews.error"),
        error.response?.data?.message || t("clinicReviews.failedSubmit"),
        "error"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
        >
          {/*==> header <== */}
          <div className="p-6 border-b border-[#F0EAE0] flex justify-between items-center bg-gradient-to-r from-[#FDFBF7] to-white">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#5A4033]">
                {t("clinicReviews.shareExperience")}
              </h2>
              <p className="text-sm text-[#8C7A6B]">
                {t("clinicReviews.valueFeedback")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F5F0EB] rounded-full transition-colors text-[#D4C5B5] hover:text-[#8C7A6B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/*==> review type selection <==*/}
            <div className="space-y-3">
              <label className="text-sm font-medium text-[#5A4033] block">
                {t("clinicReviews.whatReviewing")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    id: "doctor",
                    icon: Stethoscope,
                    label: t("clinicReviews.doctor"),
                  },
                  {
                    id: "service",
                    icon: Syringe,
                    label: t("clinicReviews.service"),
                  },
                  {
                    id: "clinic",
                    icon: Building2,
                    label: t("clinicReviews.clinicLabel"),
                  },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(type.id as ReviewType);
                      setValue("type", type.id as ReviewType);
                      setValue("targetId", ""); // Reset target when switching
                    }}
                    className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl border transition-all duration-200 ${
                      selectedType === type.id
                        ? "bg-[#E5A46C] text-white border-[#E5A46C] shadow-md shadow-[#E5A46C]/20 scale-105"
                        : "bg-white text-[#8C7A6B] border-[#EAE0D5] hover:border-[#E5A46C] hover:bg-[#FDFBF7]"
                    }`}
                  >
                    <type.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/*==> target Selection (Doctor/Service) <==*/}
            <AnimatePresence mode="wait">
              {selectedType === "doctor" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-sm font-medium text-[#5A4033]">
                    {t("clinicReviews.selectDoctor")}
                  </label>
                  <select
                    {...register("targetId", {
                      required: selectedType === "doctor",
                    })}
                    className="w-full p-3 rounded-xl border border-[#EAE0D5] focus:border-[#E5A46C] focus:ring-4 focus:ring-[#E5A46C]/10 outline-none transition-all bg-[#FDFBF7] focus:bg-white text-[#5A4033]"
                  >
                    <option value="">{t("clinicReviews.chooseDoctor")}</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.userName}
                      </option>
                    ))}
                  </select>
                  {errors.targetId && (
                    <span className="text-red-500 text-xs">
                      {t("clinicReviews.pleaseSelectDoctor")}
                    </span>
                  )}
                </motion.div>
              )}

              {selectedType === "service" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-sm font-medium text-[#5A4033]">
                    {t("clinicReviews.selectService")}
                  </label>
                  <select
                    {...register("targetId", {
                      required: selectedType === "service",
                    })}
                    className="w-full p-3 rounded-xl border border-[#EAE0D5] focus:border-[#E5A46C] focus:ring-4 focus:ring-[#E5A46C]/10 outline-none transition-all bg-[#FDFBF7] focus:bg-white text-[#5A4033]"
                  >
                    <option value="">{t("clinicReviews.chooseService")}</option>
                    {services.map((srv) => (
                      <option key={srv._id} value={srv._id}>
                        {srv.title}
                      </option>
                    ))}
                  </select>
                  {errors.targetId && (
                    <span className="text-red-500 text-xs">
                      {t("clinicReviews.pleaseSelectService")}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rating */}
            <div className="space-y-3 text-center">
              <label className="text-sm font-medium text-[#5A4033] block">
                {t("clinicReviews.rateExperience")}
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110 p-1"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors duration-200 ${
                        star <= (hoveredRating || rating)
                          ? "fill-[#E5A46C] text-[#E5A46C] drop-shadow-sm"
                          : "text-[#EAE0D5]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#5A4033]">
                {t("clinicReviews.yourReview")}
              </label>
              <textarea
                {...register("comment", {
                  required: t("clinicReviews.pleaseWriteComment"),
                  minLength: {
                    value: 10,
                    message: t("clinicReviews.minCharacters"),
                  },
                })}
                placeholder={t("clinicReviews.tellExperience")}
                rows={4}
                className="w-full p-4 rounded-xl border border-[#EAE0D5] focus:border-[#E5A46C] focus:ring-4 focus:ring-[#E5A46C]/10 outline-none transition-all resize-none bg-[#FDFBF7] focus:bg-white text-[#5A4033] placeholder-[#D4C5B5]"
              />
              <div className="flex justify-between text-xs text-[#D4C5B5] px-1">
                <span className="text-red-500">
                  {errors.comment?.message as string}
                </span>
                <span>{watch("comment")?.length || 0}/500</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#E5A46C] hover:bg-[#D4935B] text-white rounded-xl font-bold shadow-lg shadow-[#E5A46C]/20 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                t("clinicReviews.submitReview")
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;
