import { z } from "zod";

export const userUpdateSchema = z.object({
  userName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(70, "Name cannot exceed 70 characters"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z
    .string()
    .regex(/^01[01245]\d{8}$/, "Invalid Egyptian mobile number")
    .optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().optional(),
});
