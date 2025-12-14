import i18n from "../../i18n";
import type { InputProps } from "../../Interfaces/components/inputProps";

const Input = ({
  type = "text",
  placeholder,
  register,
  error,
}: InputProps) => {
  const isRTL = i18n.language === "ar";
  return (
    <div className="w-full">
      <input
        {...register}
        type={type}
        placeholder={placeholder}
        className={`
          w-full bg-transparent border-b outline-none py-2 ${isRTL ? "pr-10" : "pl-10"} text-white
          focus:border-[#c18a5b]  focus:ring-1/4 focus:ring-[#b07d4f] focus:outline-none 
          transition duration-300 ease-in-out
          placeholder:text-gray-400 transition-all
          ${error ? "border-red-500" : "border-white/30"}
        `}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default Input;
