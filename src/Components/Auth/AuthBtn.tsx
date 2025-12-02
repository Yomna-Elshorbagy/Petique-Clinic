import { Link } from "react-router";
import type { IAuthProps } from "../../Interfaces/components/buttonProps";
import MyButton from "./MyButton";

const AuthBtn = ({ name, title, navTo, navName, isLoading }: IAuthProps) => {
  return (
    <div className="space-y-3">
      <MyButton title={name} type="submit" isLoading={isLoading}/>

      <p className="text-sm text-gray-400 text-center font-['Playfair_Display']">
        {title}{" "}
        <Link
          to={navTo}
          replace
          className="text-[#A88F7B] cursor-pointer hover:underline ml-1 font-['Playfair_Display']"
        >
          {navName}
        </Link>
      </p>
    </div>
  );
};

export default AuthBtn;