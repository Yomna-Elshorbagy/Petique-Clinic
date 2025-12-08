import z from "zod";

export const emailSchema = z.object({
  email: z.string().email("Invalid Email").nonempty("Email is required"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const passSchema = z
  .object({
    newPass: z
      .string()
      .regex(/^[A-Z][A-Za-z0-9]{5,20}$/, "Password must start with uppercase"),
    rePass: z.string(),
  })
  .refine((d) => d.newPass === d.rePass, {
    message: "Passwords must match",
    path: ["rePass"],
  });

export type EmailForm = z.infer<typeof emailSchema>;
export type OTPForm = z.infer<typeof otpSchema>;
export type PassForm = z.infer<typeof passSchema>;