import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router";
import AuthCardLayout from "../../Shared/AuthCardLayout/AuthCardLayout";
import Input from "../../Components/Auth/Input";
import AuthBtn from "../../Components/Auth/AuthBtn";
import { verifyOtpApi } from "../../Apis/AuthApis";

type OtpFormType = {
  email: string;
  otpCode: string;
};

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();

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
        title: "Account Verified!",
        text: "Your account has been successfully activated.",
        timer: 2000,
        showConfirmButton: false,
        willClose: () => navigate("/login"),
      });
    },
    onError: (error) => {
      let message = "Invalid or expired OTP";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: message,
        confirmButtonColor: "#f69946",
      });
    },
  });

  const onSubmit: SubmitHandler<OtpFormType> = (data) => {
    mutate(data);
  };

  return (
    <AuthCardLayout
      motionKey="otp"
      leftContent={
        <>
          <p className="text-4xl font-bold mb-4 font-['Playfair_Display'] text-(--color-light-accent)">
            Verify Your Email
          </p>
          <p className="text-[#443935] font-bold font-['Playfair_Display'] p-2">
            Enter the OTP sent to your email.
          </p>
        </>
      }
      rightContent={
        <>
          <h2 className="text-(--color-light-accent) font-['Playfair_Display'] text-3xl font-semibold mb-6">
            OTP Verification
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              placeholder="Email address"
              type="email"
              register={register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}

            <Input
              placeholder="Enter OTP code"
              type="text"
              register={register("otpCode", {
                required: "OTP code is required",
              })}
            />
            {errors.otpCode && (
              <p className="text-red-400 text-sm">{errors.otpCode.message}</p>
            )}

            <AuthBtn
              name={isPending ? "Verifying..." : "Verify"}
              isLoading={isPending}
              navTo="/login"
              navName="Back to Login"
              title="Already have an account?"
            />
          </form>
        </>
      }
    />
  );
}
