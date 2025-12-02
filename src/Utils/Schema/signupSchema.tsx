import zod from "zod";
import { passRegex, phoneRegex } from "../../Constants/const";

export const signUpSchema = zod
  .object({
    userName: zod
      .string()
      .min(3, "Please Enter your fullname")
      .max(15, "max length is 15"),
    email: zod.email("Please Enter a correct email"),
    password: zod
      .string()
      .min(8, "Your password should be 8 characters")
      .regex(
        passRegex,
        "Password must contain lower, upper chartecter"
      ),
    Cpassword: zod.string(),
    mobileNumber: zod
      .string()
      .regex(phoneRegex, "Invalid Egyptian mobile number"),
    gender: zod.enum(["male", "female"]).refine((val) => !!val, {
      message: "Please select a gender",
    }),
  })
  .refine((data) => data.password === data.Cpassword, {
    message: "Passwords do not match",
    path: ["Cpassword"],
  });

export type SignUpSchemaType = zod.infer<typeof signUpSchema>;

// export const signupDefaultValues : SignUpSchemaType = {
//   username: "",
//   email: "",
//   password: "",
//   Cpassword: "",
//   mobileNumber: "",
//   gender: "female",
// };