// import { CircleLoader } from "react-spinners";
import Lottie from "lottie-react";
import catAnimation from "../../assets/Animal care Loading.json";

export default function LoaderPage() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        {/* <CircleLoader color="#8B5E35" size={120} />  */}
        <Lottie
          animationData={catAnimation}
          loop={true}
          style={{ width: 300, height: 300, color: "#8B5E35" }}
        />
      </div>
    </>
  );
}
