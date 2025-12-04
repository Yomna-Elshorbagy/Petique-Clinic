import { motion } from "motion/react";
import type { IButtonProps } from "../../Interfaces/components/buttonProps";

const MyButton = ({ title, type = "button", isLoading, onClick }: IButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isLoading}
      type={type}
      onClick={onClick}
      className="w-full py-3 rounded-lg bg-linear-to-br
        from-[#f69946]
        to-[#dcae85] text-white font-semibold disabled:opacity-50 hover:cursor-pointer
        transition-transform duration-200 ease-in-out hover:from-[#e8872c] hover:to-[#c89a74] 
        hover:shadow-xl hover:shadow-amber-300/30"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
        <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
        {title}
        </span>
      ) : (
        title
      )}
    </motion.button>
  );
};

export default MyButton;