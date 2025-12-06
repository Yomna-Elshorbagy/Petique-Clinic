import { useForm, type SubmitHandler } from "react-hook-form";
import { signUpSchema, type SignUpSchemaType } from "../../Utils/Schema/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { userSignup } from "../../Apis/AuthApis";
import { MdEmail, MdLock, MdPerson, MdPhone } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import Input from "../../Components/Auth/Input";
import AuthBtn from "../../Components/Auth/AuthBtn";
import pet from "../../assets/images/dog.jpg";
import { motion } from "motion/react";

export default function Register() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpSchemaType>({
    // defaultValues: signupDefaultValues,
    resolver: zodResolver(signUpSchema),
    mode: "all",
  });

  const { mutate , isPending, isError, error} = useMutation({
    mutationFn: userSignup,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Check your mail Redirecting to login ... 🐱🐾",
        timer: 2000,
        showConfirmButton: false,
        willClose: () => navigate("/login"),
      });
    },

    onError: (err) => {
      let message = "Signup failed!";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }

      Swal.fire({
        icon: "error",
        title: "Signup Error",
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
            <h2 className="text-(--color-light-accent) font-['Playfair_Display'] text-3xl font-semibold mb-6">Sign Up</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e0d0c1]" />
                <Input placeholder="Your name" register={register("userName")}/>
              </div>
              {errors.userName && <p className="text-red-400 text-sm">{errors.userName.message}</p>}

              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e0d0c1]" />
                <Input placeholder="Your email" type="email" register={register("email")}/>
              </div>
              {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}

              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d5c5b5]" />
                <Input placeholder="Password" type="password" register={register("password")}/>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}

              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d5c5b5]" />
                <Input placeholder="Confirm password" type="password" register={register("Cpassword")}/>
              </div>
              {errors.Cpassword && <p className="text-red-400 text-sm">{errors.Cpassword.message}</p>}

              <div className="relative">
                <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d5c5b5]" />
                <Input placeholder="Phone number" register={register("mobileNumber")}/>
              </div>
              {errors.mobileNumber && <p className="text-red-400 text-sm">{errors.mobileNumber.message}</p>}

              <div className="flex gap-4 text-white mt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" value="male" {...register("gender")} className="appearance-none w-5 h-5 border-3 border-(--color-light-accent) rounded-full"/>
                  Male
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="female" {...register("gender")} className="appearance-none w-5 h-5 border-3 border-(--color-light-accent) rounded-full"/>
                  Female
                </label>
              </div>
              {errors.gender && <p className="text-red-400 text-sm">{errors.gender.message}</p>}

              <AuthBtn
                name={isPending ? "Creating..." : "Sign Up"}
                title="Already have an account?"
                navTo="/login"
                navName="Login"
                isLoading={isPending}
              />
            </form>
          </div>

          {isError && (
            <p className="text-red-500 text-sm mt-2">
              {(error as any)?.response?.data?.message || "Signup failed"}
            </p>
          )}

          {/* RIGHT SIDE */}
          <div className="p-10 flex flex-col justify-center items-start">
            <p className="text-4xl font-bold mb-4 font-['Playfair_Display'] text-(--color-light-accent) animate-pulse">
              Join Petique
            </p>
            <p className="text-[#443935] font-bold font-['Playfair_Display']">
              Create account and enjoy your pet world.
            </p>
          </div>

        </div>
      </motion.div>
      </div>
    </>
  )
}
