import { useState } from "react";
import { FaEnvelope, FaKey, FaUnlock } from "react-icons/fa";
import type { StepItem } from "../../Interfaces/components/stepTrackerProps";
import pet from "../../assets/images/dog.jpg";
import { motion } from "motion/react";
import Input from "../../Components/Auth/Input";
import MyButton from "../../Components/Auth/MyButton";
import { MdEmail, MdLock } from "react-icons/md";
import { useForm } from "react-hook-form";
import { emailSchema, passSchema, type EmailForm, type OTPForm, type PassForm } from "../../Utils/Schema/forgetPassSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepTracker } from "../../Shared/StepTracker/StepTracker";
import { changePass, forgetPass } from "../../Apis/AuthApis";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

type Step = 1 | 2 | 3;

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const {
    register: regEmail,
    handleSubmit: submitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });

  const {
    register: regOtp,
    handleSubmit: submitOtp,
    formState: { errors: otpErrors },
  } = useForm<OTPForm>();

  const {
    register: regPass,
    handleSubmit: submitPass,
    formState: { errors: passErrors },
  } = useForm<PassForm>({ resolver: zodResolver(passSchema) });

  const steps: StepItem[] = [
    {
      id: 1,
      name: "Send Code",
      icon: FaEnvelope,
      status:
        currentStep === 1 ? "current" : currentStep > 1 ? "complete" : "upcoming",
    },
    {
      id: 2,
      name: "Verify Code",
      icon: FaKey,
      status:
        currentStep === 2 ? "current" : currentStep > 2 ? "complete" : "upcoming",
    },
    {
      id: 3,
      name: "Change Password",
      icon: FaUnlock,
      status: currentStep === 3 ? "current" : "upcoming",
    },
  ];

  const handleSendEmail = async (data: EmailForm) => {
    try {
      await forgetPass(data.email);
      setEmail(data.email);
      Swal.fire({
        icon: "success",
        title: "OTP Sent! Check Yor Email",
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
        "Something went wrong. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Failed to Send OTP ❌",
        text: message,
        confirmButtonColor: "#f69946",
      });
    }
  };

  const handleVerifyOtp = (data: OTPForm) => {
    if (data.otp.length !== 6) {
      Swal.fire({
        title: "Invalid OTP ❌",
        text: "OTP must be 6 digits",
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
      await changePass({
        email,
        otp,
        newPass: data.newPass,
      });

      Swal.fire({
        title: "🎉 Password Updated",
        text: "Your password has been changed successfully.",
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
        "Something went wrong. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Failed to Update Password ❌",
        text: message,
        confirmButtonColor: "#f69946",
      });
    }
  };

  return (
    <>
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
                Reset Password
              </p>
              <p className="text-[#443935] font-['Playfair_Display']">
                Follow the steps to recover your account securely.
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
                    Enter your Email
                  </h2>

                  <div className="relative mb-6">
                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e0d0c1]" size={20} />
                    <Input
                      type="email"
                      placeholder="Your email"
                      register={regEmail("email")}
                    />
                  </div>

                  {emailErrors.email && (
                    <p className="text-red-400 text-sm">{emailErrors.email.message}</p>
                  )}

                  <MyButton title="Send OTP" isLoading={false} type="submit" />
                </form>
              )}

              {/* STEP 2 — OTP */}
              {currentStep === 2 && (
                <form onSubmit={submitOtp(handleVerifyOtp)}>
                  <h2 className="text-(--color-light-accent) text-2xl mb-6">Enter OTP</h2>

                  <div className="mb-6">
                    <Input
                      type="text"
                      placeholder="6 digit code"
                      register={regOtp("otp")}
                    />

                    {otpErrors.otp && (
                      <p className="text-red-400 text-sm">{otpErrors.otp.message}</p>
                    )}
                  </div>
                  <MyButton title="Verify Code" isLoading={false} type="submit" />
                </form>
              )}

              {/* STEP 3 — PASSWORD */}
              {currentStep === 3 && (
                <form onSubmit={submitPass(handleResetPass)}>
                  <h2 className="text-(--color-light-accent) text-2xl mb-6">New Password</h2>

                  <div className="relative mb-3">
                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d5c5b5]" />
                    <Input
                      type="password"
                      placeholder="New password"
                      register={regPass("newPass")}
                    />
                  </div>
                  {passErrors.newPass && (
                    <p className="text-red-400 text-sm">{passErrors.newPass.message}</p>
                  )}

                  <div className="relative mb-6">
                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d5c5b5]" />
                    <Input
                      type="password"
                      placeholder="Repeat password"
                      register={regPass("rePass")}
                    />
                  </div>
                  {passErrors.rePass && (
                    <p className="text-red-400 text-sm">{passErrors.rePass.message}</p>
                  )}

                  <MyButton title="Reset Password" isLoading={false} type="submit" />
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
