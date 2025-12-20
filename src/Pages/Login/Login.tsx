import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock } from "react-icons/md";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  loginDefaultValues,
  loginSchema,
  type LoginSchemaType,
} from "../../Utils/Schema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { userLogin } from "../../Apis/AuthApis";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { insertUserToken } from "../../Store/Slices/AuthSlice";
import axios from "axios";
import Swal from "sweetalert2";
import Input from "../../Components/Auth/Input";
import AuthBtn from "../../Components/Auth/AuthBtn";
import AuthCardLayout from "../../Shared/AuthCardLayout/AuthCardLayout";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import SEO from "../../Components/SEO/SEO";
import type { TokenPayload } from "../../Interfaces/ITokenPayload";
import { jwtDecode } from "jwt-decode";
import type { IUser } from "../../Interfaces/IUser";
import GoogleLoginBtn from "./components/GoogleLoginBtn";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    defaultValues: loginDefaultValues,
    resolver: zodResolver(loginSchema),
    mode: "all",
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      dispatch(insertUserToken(data.accessToken));

      let username = "User";
      let role: IUser["role"] = "petOwner";
      let destination = "/home";

      try {
        const decoded = jwtDecode<TokenPayload>(data.accessToken);
        username = decoded?.name || "User";
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

      const welcomeText =
        role === "admin"
          ? `Welcome Admin ${username}!`
          : role === "doctor"
            ? `Welcome Dr. ${username}!`
            : `Welcome ${username}!`;

      Swal.fire({
        title: `👋 ${welcomeText}`,
        text: "Login successful. Redirecting...",
        icon: "success",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => navigate(destination),
      });
    },

    onError: (err) => {
      let message = t("auth.login.errorDefault");
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      Swal.fire({
        icon: "error",
        title: t("auth.login.errorTitle"),
        text: message,
        confirmButtonColor: "#f69946",
      });
    },
  });

  const onSubmit: SubmitHandler<LoginSchemaType> = (userValue) => {
    mutate(userValue);
  };

  return (
    <AuthCardLayout
      motionKey="login"
      leftContent={
        <>
          <p className="text-4xl font-bold mb-4 font-['Playfair_Display'] text-(--color-light-accent) animate-pulse">
            {t("auth.login.welcomeTitle")}
          </p>
          <p
            className={`text-[#443935] font-bold font-['Playfair_Display'] p-2 ${isRTL ? "text-2xl" : ""
              }`}
          >
            {t("auth.login.welcomeSubtitle")}
          </p>
        </>
      }
      rightContent={
        <>
          <SEO
            title="Petique Clinic | Login"
            description="Log in to your Petique Clinic account to manage appointments, orders, and pet health records."
          />

          <h2 className="text-(--color-light-accent) font-['Playfair_Display'] text-3xl font-semibold mb-6">
            {t("auth.login.title")}
          </h2>
          <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3 mb-6">
                <div className="relative">
                  <MdEmail
                    className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${isRTL ? "right-3" : "left-3"
                      }`}
                    size={20}
                  />
                  <Input
                    placeholder={t("auth.common.email")}
                    type="email"
                    register={register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email.message}</p>
                )}

                <div className="relative">
                  <MdLock
                    className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${isRTL ? "right-3" : "left-3"
                      }`}
                    size={20}
                  />
                  <Input
                    placeholder={t("auth.common.password")}
                    type="password"
                    register={register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <AuthBtn
                name={
                  isPending ? t("auth.login.loading") : t("auth.login.submit")
                }
                title={t("auth.login.createAccount")}
                navTo="/register"
                navName={t("auth.login.signupHere")}
                isLoading={isPending}
              />
            </form>

            <p className="text-sm text-gray-400 text-center">
              {t("auth.login.forgetPassword")}{" "}
              <Link
                to="/forgetPass"
                className="text-[#A88F7B] cursor-pointer hover:underline"
              >
                {t("auth.login.forget")}
              </Link>
            </p>

            {isError && (
              <p className="text-red-400 text-sm mt-2">
                {(error as any)?.response?.data?.message ||
                  t("auth.login.errorDefault")}
              </p>
            )}
            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-gray-400 text-sm">
                {t("auth.common.or")}
              </span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            <GoogleLoginBtn />
          </div>
        </>
      }
    />
  );
}
