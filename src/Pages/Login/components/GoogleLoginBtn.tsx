import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { googleLogin } from "../../../Apis/AuthApis";
import { insertUserToken } from "../../../Store/Slices/AuthSlice";
import { jwtDecode } from "jwt-decode";
import type { TokenPayload } from "../../../Interfaces/ITokenPayload";
import type { IUser } from "../../../Interfaces/IUser";
import axios from "axios";

export default function GoogleLoginBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: googleLogin,
    onSuccess: (data: any) => {
      dispatch(insertUserToken(data.accessToken));
      let role: IUser["role"] = "petOwner";
      let destination = "/home";

      try {
        const decoded = jwtDecode<TokenPayload>(data.accessToken);

        role = decoded?.role as any;

        if (role === "admin") {
          destination = "/ecoDashboard";
        } else if (role === "doctor" || role === "owner") {
          destination = "/resDashboard";
        } else {
          destination = "/home";
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }

      Swal.fire({
        title: "Welcome!",
        text: "Logged in with Google successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        willClose: () => navigate(destination),
      });
    },
    onError: (err: any) => {
      let message = "Google Login Failed";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    },
  });

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      mutate({ accessToken: codeResponse.access_token });
    },
    onError: () => {
      Swal.fire("Error", "Google Login Failed", "error");
    },
  });

  return (
    <div className="flex justify-center gap-4">
      <button
        type="button"
        onClick={() => login()}
        className="w-12 h-12 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-orange-500/20 group"
      >
        <div className="bg-white p-1.5 rounded-full group-hover:bg-opacity-90 transition">
          <FcGoogle size={24} />
        </div>
      </button>
    </div>
  );
}
