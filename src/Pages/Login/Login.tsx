import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock } from "react-icons/md";
import { useForm, type SubmitHandler } from "react-hook-form";
import { loginDefaultValues, loginSchema, type LoginSchemaType } from "../../Utils/Schema/loginSchema";
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

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchemaType>({
    defaultValues: loginDefaultValues,
    resolver: zodResolver(loginSchema),
    mode: "all",
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      console.log(data);
      dispatch(insertUserToken(data.accessToken));
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome back to Petique 🐶",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => navigate("/home"),
      });
    },

    onError: (err) => {
      let message = "Something went wrong!";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || "Invalid email or password";
      }
      Swal.fire({
        icon: "error",
        title: "Login Failed",
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
    leftContent = {
      <>
      <p className="text-4xl font-bold mb-4 font-['Playfair_Display'] text-(--color-light-accent) animate-pulse">Welcome Back!</p>
      <p className="text-[#443935] font-bold font-['Playfair_Display'] p-2">For better experience with your pets.</p>
      </>
    }
    rightContent={
      <>
      <h2 className="text-(--color-light-accent) font-['Playfair_Display'] text-3xl font-semibold mb-6">Log in</h2>
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)}>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e0d0c1]" size={20} />
                    <Input placeholder="your email"
                    type="email" 
                    register={register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email.message}</p>
                  )}

                  <div className="relative">
                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d5c5b5]" size={20} />
                    <Input placeholder="Your password"
                    type="password" 
                    register={register("password")} 
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm">{errors.password.message}</p>
                  )}

                </div>

                <AuthBtn name={isPending ? "Logging in..." : "Sign in"} 
                  title="Create new account?" 
                  navTo="/register" 
                  navName="Sign up here" 
                  isLoading={isPending} />
              </form>

              <p className="text-sm text-gray-400 text-center">
                Forget Password?{" "}
                <Link to="/forgetPass" className="text-[#A88F7B] cursor-pointer hover:underline">
                  forget password
                </Link>
              </p>

              {isError && (
                <p className="text-red-400 text-sm mt-2">
                  {(error as any)?.response?.data?.message || "Login failed"}
                </p>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>
              <div className="flex justify-center gap-4">
                <button className="w-10 h-10 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition">
                  <FcGoogle size={20} />
                </button>
              </div>
            </div>
      </>
    }
    />
  );
}