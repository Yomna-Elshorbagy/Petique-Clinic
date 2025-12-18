import { useState } from "react";
import { FaEnvelope, FaKey, FaUnlock } from "react-icons/fa";
import type { StepItem } from "../../Interfaces/components/stepTrackerProps";
import pet from "../../assets/images/dog.jpg";
import { motion } from "motion/react";
import Input from "../../Components/Auth/Input";
import MyButton from "../../Components/Auth/MyButton";
import { MdEmail, MdLock } from "react-icons/md";
import { useForm } from "react-hook-form";
import {
  emailSchema,
  passSchema,
  type EmailForm,
  type OTPForm,
  type PassForm,
} from "../../Utils/Schema/forgetPassSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepTracker } from "../../Shared/StepTracker/StepTracker";
import { changePass, forgetPass } from "../../Apis/AuthApis";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import OTPBlocks from "./components/OTPBlocks";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import SEO from "../../Components/SEO/SEO";

type Step = 1 | 2 | 3;

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const {
    register: regEmail,
    handleSubmit: submitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });

  const {
    handleSubmit: submitOtp,
    watch: otpWatch,
    setValue: setOtpValue,
    formState: { errors: otpErrors },
  } = useForm<OTPForm>({
    defaultValues: {
      otp: "",
    },
  });

  const {
    register: regPass,
    handleSubmit: submitPass,
    formState: { errors: passErrors },
  } = useForm<PassForm>({ resolver: zodResolver(passSchema) });

  const steps: StepItem[] = [
    {
      id: 1,
      name: t("auth.forgetPassword.step1.title"),
      icon: FaEnvelope,
      status:
        currentStep === 1
          ? "current"
          : currentStep > 1
          ? "complete"
          : "upcoming",
    },
    {
      id: 2,
      name: t("auth.forgetPassword.step2.title"),
      icon: FaKey,
      status:
        currentStep === 2
          ? "current"
          : currentStep > 2
          ? "complete"
          : "upcoming",
    },
    {
      id: 3,
      name: t("auth.forgetPassword.step3.title"),
      icon: FaUnlock,
      status: currentStep === 3 ? "current" : "upcoming",
    },
  ];

  const handleSendEmail = async (data: EmailForm) => {
    try {
      setIsSendingOtp(true);
      await forgetPass(data.email);
      setEmail(data.email);
      Swal.fire({
        icon: "success",
        title: t("auth.forgetPassword.step1.successTitle"),
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      setCurrentStep(2);
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        t("auth.forgetPassword.defaultError");

      Swal.fire({
        icon: "error",
        title: t("auth.forgetPassword.step1.errorTitle"),
        text: message,
        confirmButtonColor: "#f69946",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = (data: OTPForm) => {
    if (data.otp.length !== 6) {
      Swal.fire({
        title: t("auth.forgetPassword.step2.invalidOtp"),
        text: t("auth.forgetPassword.step2.errorMsg"),
        icon: "error",
        confirmButtonColor: "#f69946",
      });
      return;
    }
    setOtp(data.otp);
    setCurrentStep(3);
  };

  const handleResetPass = async (data: PassForm) => {
    try {
      setIsChangingPass(true);
      await changePass({
        email,
        otp,
        newPass: data.newPass,
      });

      Swal.fire({
        title: t("auth.forgetPassword.step3.successTitle"),
        text: t("auth.forgetPassword.step3.successText"),
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => navigate("/login"),
      });
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        t("auth.forgetPassword.defaultError");

      Swal.fire({
        icon: "error",
        title: t("auth.forgetPassword.step3.errorTitle"),
        text: message,
        confirmButtonColor: "#f69946",
      });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <>
      <SEO
        title="Forgot Password | Petique Clinic"
        description="Reset your Petique Clinic account password securely and regain access to your profile."
      />

      <div className="relative min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pet})` }}
        />
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <div className="paw-print absolute top-10 left-10 text-6xl">🐾</div>
        </div>

        <motion.div
          key="forget-pass"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl border border-white/10"
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          <div className="relative grid grid-cols-1 md:grid-cols-2">
            {/* LEFT TEXT */}
            <div className="p-10 flex flex-col justify-center">
              <p className="text-(--color-light-accent) text-4xl font-['Playfair_Display'] font-bold mb-4">
                {t("auth.forgetPassword.title")}
              </p>
              <p
                className={`text-[#443935] font-['Playfair_Display'] ${
                  isRTL ? "text-2xl" : ""
                }`}
              >
                {t("auth.forgetPassword.subtitle")}
              </p>

              <div className="mt-8">
                <StepTracker steps={steps} />
              </div>
            </div>

            {/* RIGHT FORM SIDE */}
            <div className="p-10 bg-black/40">
              {/* STEP 1 — EMAIL */}
              {currentStep === 1 && (
                <form onSubmit={submitEmail(handleSendEmail)}>
                  <h2 className="text-(--color-light-accent) text-2xl mb-6">
                    {t("auth.forgetPassword.step1.title")}
                  </h2>

                  <div className="relative mb-6">
                    <MdEmail
                      className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                      size={20}
                    />
                    <Input
                      type="email"
                      placeholder={t("auth.common.email")}
                      register={regEmail("email")}
                    />
                  </div>

                  {emailErrors.email && (
                    <p className="text-red-400 text-sm">
                      {emailErrors.email.message}
                    </p>
                  )}

                  <MyButton
                    title={t("auth.forgetPassword.step1.submit")}
                    isLoading={isSendingOtp}
                    type="submit"
                  />
                  <p className="text-sm text-gray-400 text-center mt-4">
                    {t("auth.forgetPassword.remember")}{" "}
                    <span
                      className="text-[#A88F7B] hover:underline cursor-pointer"
                      onClick={() => navigate("/login")}
                    >
                      {t("auth.login.title")}
                    </span>
                  </p>
                </form>
              )}

              {/* STEP 2 — OTP */}
              {currentStep === 2 && (
                <form onSubmit={submitOtp(handleVerifyOtp)}>
                  <h2 className="text-(--color-light-accent) text-2xl mb-6">
                    {t("auth.forgetPassword.step2.title")}
                  </h2>

                  <div className="mb-6">
                    <OTPBlocks
                      value={otpWatch("otp") || ""}
                      onChange={(val) => setOtpValue("otp", val)}
                    />

                    {otpErrors.otp && (
                      <p className="text-red-400 text-sm">
                        {otpErrors.otp.message}
                      </p>
                    )}
                  </div>
                  <MyButton
                    title={t("auth.forgetPassword.step2.submit")}
                    isLoading={false}
                    type="submit"
                  />
                </form>
              )}

              {/* STEP 3 — PASSWORD */}
              {currentStep === 3 && (
                <form onSubmit={submitPass(handleResetPass)}>
                  <h2 className="text-(--color-light-accent) text-2xl mb-6">
                    {t("auth.forgetPassword.step3.title")}
                  </h2>

                  <div className="relative mb-3">
                    <MdLock
                      className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                    />
                    <Input
                      type="password"
                      placeholder={t("auth.common.newPassword")}
                      register={regPass("newPass")}
                    />
                  </div>
                  {passErrors.newPass && (
                    <p className="text-red-400 text-sm">
                      {passErrors.newPass.message}
                    </p>
                  )}

                  <div className="relative mb-6">
                    <MdLock
                      className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                    />
                    <Input
                      type="password"
                      placeholder={t("auth.common.repeatPassword")}
                      register={regPass("rePass")}
                    />
                  </div>
                  {passErrors.rePass && (
                    <p className="text-red-400 text-sm">
                      {passErrors.rePass.message}
                    </p>
                  )}

                  <MyButton
                    title={t("auth.forgetPassword.step3.submit")}
                    isLoading={isChangingPass}
                    type="submit"
                  />
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
