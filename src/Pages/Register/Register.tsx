import { useForm, type SubmitHandler } from "react-hook-form";
import {
  signUpSchema,
  type SignUpSchemaType,
} from "../../Utils/Schema/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { userSignup } from "../../Apis/AuthApis";
import { MdEmail, MdLock, MdPerson, MdPhone } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import Input from "../../Components/Auth/Input";
import AuthBtn from "../../Components/Auth/AuthBtn";
import pet from "../../assets/images/dog.jpg";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import SEO from "../../Components/SEO/SEO";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    // defaultValues: signupDefaultValues,
    resolver: zodResolver(signUpSchema),
    mode: "all",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: userSignup,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: t("auth.register.successTitle"),
        text: t("auth.register.successText"),
        timer: 2000,
        showConfirmButton: false,
        willClose: () => navigate("/login"),
      });
    },

    onError: (err) => {
      let message = t("auth.register.errorDefault");
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }

      Swal.fire({
        icon: "error",
        title: t("auth.register.errorTitle"),
        text: message,
        confirmButtonColor: "#f69946",
      });
    },
  });

  const onSubmit: SubmitHandler<SignUpSchemaType> = (userValue) => {
    mutate(userValue);
  };
  return (
    <>
      <SEO
        title="Sign Up |Petique Clinic"
        description="Create a Petique Clinic account to book appointments, track orders, and manage your pet’s care."
      />

      <div className="relative min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4">
        {/* Background */}
        <div
          className="absolute bg-cover bg-center h-auto w-full min-h-full"
          style={{
            backgroundImage: `url(${pet})`,
          }}
        />
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <div className="paw-print absolute top-10 left-10 text-6xl">🐾</div>
        </div>

        {/* Card */}
        <motion.div
          key="login"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="relative grid grid-cols-1 md:grid-cols-2">
            {/* FORM */}
            <div className="p-10 bg-black/40">
              <h2 className="text-(--color-light-accent) font-['Playfair_Display'] text-3xl font-semibold mb-6">
                {t("auth.register.title")}
              </h2>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="relative">
                  <MdPerson
                    className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${
                      isRTL ? "right-3" : "left-3"
                    }`}
                  />
                  <Input
                    placeholder={t("auth.common.name")}
                    register={register("userName")}
                  />
                </div>
                {errors.userName && (
                  <p className="text-red-400 text-sm">
                    {errors.userName.message}
                  </p>
                )}

                <div className="relative">
                  <MdEmail
                    className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${
                      isRTL ? "right-3" : "left-3"
                    }`}
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
                    className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${
                      isRTL ? "right-3" : "left-3"
                    }`}
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

                <div className="relative">
                  <MdLock
                    className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${
                      isRTL ? "right-3" : "left-3"
                    }`}
                  />
                  <Input
                    placeholder={t("auth.common.confirmPassword")}
                    type="password"
                    register={register("Cpassword")}
                  />
                </div>
                {errors.Cpassword && (
                  <p className="text-red-400 text-sm">
                    {errors.Cpassword.message}
                  </p>
                )}

                <div className="relative">
                  <MdPhone
                    className={`absolute top-1/2 -translate-y-1/2 text-[#d5c5b5] ${
                      isRTL ? "right-3" : "left-3"
                    }`}
                  />
                  <Input
                    placeholder={t("auth.common.phone")}
                    register={register("mobileNumber")}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-400 text-sm">
                    {errors.mobileNumber.message}
                  </p>
                )}

                <div className="flex gap-4 text-white mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="male"
                      {...register("gender")}
                      className="appearance-none w-5 h-5 border-3 border-(--color-light-accent) rounded-full"
                    />
                    {t("auth.common.male")}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="female"
                      {...register("gender")}
                      className="appearance-none w-5 h-5 border-3 border-(--color-light-accent) rounded-full"
                    />
                    {t("auth.common.female")}
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-400 text-sm">
                    {errors.gender.message}
                  </p>
                )}

                <AuthBtn
                  name={
                    isPending
                      ? t("auth.register.loading")
                      : t("auth.register.submit")
                  }
                  title={t("auth.register.alreadyHaveAccount")}
                  navTo="/login"
                  navName={t("auth.login.title")}
                  isLoading={isPending}
                />
                <p className="text-sm text-gray-400 text-center">
                  {t("auth.register.alreadyRegister")}{" "}
                  <Link
                    to="/otp"
                    className="text-[#A88F7B] cursor-pointer hover:underline"
                  >
                    {t("auth.register.confirmOtp")}
                  </Link>
                </p>
              </form>
            </div>

            {/* RIGHT SIDE */}
            <div className="p-10 flex flex-col justify-center items-start">
              <p className="text-4xl font-bold mb-4 font-['Playfair_Display'] text-(--color-light-accent) animate-pulse">
                {t("auth.register.rightTitle")}
              </p>
              <p
                className={`text-[#443935] font-bold font-['Playfair_Display'] ${
                  isRTL ? "text-2xl" : ""
                }`}
              >
                {t("auth.register.rightSubtitle")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
