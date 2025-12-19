import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { User, Stethoscope, Building2, Calendar } from "lucide-react";
import type { IClinicReviewWithUser } from "../../../Interfaces/IReviews";
import { useTranslation } from "react-i18next";

interface ReviewCardProps {
  review: IClinicReviewWithUser;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { user, rate, comment, createdAt, doctor, service, reservation } =
    review;
  const { t } = useTranslation();

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-[#E5A46C]" : "text-[#EAE0D5]"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getReviewTarget = () => {
    if (doctor) {
      return (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#F5EBE0] dark:bg-[var(--color-dark-background)] text-[#8C7A6B] dark:text-[var(--color-dark-text)] rounded-full text-sm font-medium w-fit mt-4">
          <Stethoscope className="w-4 h-4" />
          <span>
            {t("clinicReviews.doctorLabel")} {doctor.userName}
          </span>
        </div>
      );
    }
    if (service) {
      return (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#F5EBE0] dark:bg-[var(--color-dark-background)] text-[#8C7A6B] dark:text-[var(--color-dark-text)] rounded-full text-sm font-medium w-fit mt-4">
          <Stethoscope className="w-4 h-4" />
          <span>
            {t("clinicReviews.serviceLabel")} {service.title}
          </span>
        </div>
      );
    }
    if (reservation) {
      return (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#F5EBE0] dark:bg-[var(--color-dark-background)] text-[#8C7A6B] dark:text-[var(--color-dark-text)] rounded-full text-sm font-medium w-fit mt-4">
          <Calendar className="w-4 h-4" />
          <span>
            {t("clinicReviews.reservationLabel")} {reservation.date}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-4 py-1.5 bg-[#F5EBE0] dark:bg-[var(--color-dark-background)] text-[#8C7A6B] dark:text-[var(--color-dark-text)] rounded-full text-sm font-medium w-fit mt-4">
        <Building2 className="w-4 h-4" />
        <span>{t("clinicReviews.clinicReview")}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[var(--color-dark-card)] p-8 rounded-[2rem] shadow-sm border border-[#F0EAE0] dark:border-[var(--color-dark-border-light)] hover:shadow-xl hover:shadow-[#E5A46C]/10 transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#F5EBE0] dark:bg-[var(--color-dark-background)] rounded-full flex items-center justify-center text-[#8C7A6B] dark:text-[var(--color-dark-text)] shadow-inner">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#5A4033] dark:text-[var(--color-dark-text)] text-lg">
              {user?.userName || t("clinicReviews.anonymous")}
            </h3>
            <p className="text-xs text-[#8C7A6B] dark:text-gray-400 font-medium tracking-wide uppercase">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-1">{renderStars(rate)}</div>
      </div>

      <div className="flex-grow">
        <p className="text-[#6B5D54] dark:text-gray-300 leading-relaxed mb-6 text-[15px] line-clamp-4 relative">
          {comment}
        </p>
      </div>

      <div className="pt-6 border-t border-[#F5EBE0] dark:border-[var(--color-dark-border-light)] mt-auto">
        {getReviewTarget()}
      </div>
    </motion.div>
  );
};

export default ReviewCard;
