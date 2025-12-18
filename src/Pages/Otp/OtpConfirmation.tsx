import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router";
import AuthCardLayout from "../../Shared/AuthCardLayout/AuthCardLayout";
import Input from "../../Components/Auth/Input";
import AuthBtn from "../../Components/Auth/AuthBtn";
import { verifyOtpApi } from "../../Apis/AuthApis";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { MdEmail, MdLock } from "react-icons/md";
import SEO from "../../Components/SEO/SEO";

type OtpFormType = {
  email: string;
  otpCode: string;
};

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

  const emailFromSignup = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormType>({
    defaultValues: {
      email: emailFromSignup,
      otpCode: "",
    },
    mode: "all",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: t("auth.otp.successTitle"),
        text: t("auth.otp.successText"),
        timer: 2000,
        showConfirmButton: false,
        willClose: () => navigate("/login"),
      });
    },
    onError: (error) => {
      let message = t("auth.otp.errorDefault");
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      Swal.fire({
        icon: "error",
        title: t("auth.otp.errorTitle"),
        text: message,
        confirmButtonColor: "#f69946",
      });
    },
  });

  const onSubmit: SubmitHandler<OtpFormType> = (data) => {
    mutate(data);
  };

  return (
    <>
      <SEO
        title="OTP confirmation |Petique Clinic"
        description="Create a Petique Clinic account to book appointments, track orders, and manage your pet’s care."
      />

      <AuthCardLayout
        motionKey="otp"
        leftContent={
          <>
            <p className="text-4xl font-bold mb-4 font-['Playfair_Display'] text-(--color-light-accent)">
              {t("auth.otp.leftTitle")}
            </p>
            <p
              className={`text-[#443935] font-bold font-['Playfair_Display'] p-2 ${
                isRTL ? "text-2xl" : ""
              }`}
            >
              {t("auth.otp.leftSubtitle")}
            </p>
          </>
        }
        rightContent={
          <>
            <h2 className="text-(--color-light-accent) font-['Playfair_Display'] text-3xl font-semibold mb-6">
              {t("auth.otp.title")}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <MdEmail
                  className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${
                    isRTL ? "right-3" : "left-3"
                  }`}
                />
                <Input
                  placeholder={t("auth.common.email")}
                  type="email"
                  register={register("email", {
                    required: "Email is required",
                  })}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <MdLock
                  className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${
                    isRTL ? "right-3" : "left-3"
                  }`}
                />
                <Input
                  placeholder={t("auth.common.otp")}
                  type="text"
                  register={register("otpCode", {
                    required: t("auth.otp.required"),
                  })}
                />
                {errors.otpCode && (
                  <p className="text-red-400 text-sm">
                    {errors.otpCode.message}
                  </p>
                )}
              </div>

              <AuthBtn
                name={isPending ? t("auth.otp.loading") : t("auth.otp.submit")}
                isLoading={isPending}
                navTo="/login"
                navName={t("auth.common.backToLogin")}
                title={t("auth.register.alreadyHaveAccount")}
              />
            </form>
          </>
        }
      />
    </>
  );
}
