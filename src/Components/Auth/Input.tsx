import type { InputProps } from "../../Interfaces/components/inputProps";

const Input = ({
  type = "text",
  placeholder,
  register,
  error,
}: InputProps) => {
  return (
    <div className="w-full">
      <input
        {...register}
        type={type}
        placeholder={placeholder}
        className={`
          w-full bg-transparent border-b outline-none py-2 pl-10 text-white
          placeholder:text-gray-400 transition-all
          ${error ? "border-red-500" : "border-white/30"}
          focus:border-[#f69946]
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
