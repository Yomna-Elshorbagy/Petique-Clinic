import { useTranslation } from "react-i18next";

type Props = {
  isOpen: boolean;
  onClick: () => void;
};

export default function ToggleButton({ isOpen, onClick }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center ">
      <button
        className="flex items-center gap-2 bg-gradient-to-r from-[var(--color-light-accent)] to-[var(--color-accent-dark)] text-[var(--color-light-dark)] font-bold px-4 py-3 rounded-3xl shadow-xl hover:shadow-2xl hover:from-[var(--color-accent-dark)] hover:to-[var(--color-light-accent)] hover:text-white transition-all duration-300 transform hover:scale-105"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.787 1.48 8.247L12 18.896l-7.416 4.444 1.48-8.247L0 9.306l8.332-1.151z" />
        </svg>
        {isOpen
          ? t("ProductDetails.hideReviews")
          : t("ProductDetails.showReviews")}
      </button>
    </div>
  );
}
