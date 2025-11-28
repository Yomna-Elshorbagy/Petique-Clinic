import { CircleLoader } from "react-spinners";

export default function LoaderPage() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <CircleLoader color="#8B5E35" size={120} /> 
      </div>
    </>
  );
}
