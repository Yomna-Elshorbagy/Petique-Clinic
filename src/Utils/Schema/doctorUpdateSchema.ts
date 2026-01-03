import { z } from "zod";

export const doctorUpdateSchema = z
    .object({
        userName: z
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(70, "Name cannot exceed 70 characters")
            .optional()
            .or(z.literal("")),
        mobileNumber: z
            .string()
            .regex(/^01[01245]\d{8}$/, "Invalid Egyptian mobile number")
            .optional()
            .or(z.literal("")),
        gender: z.enum(["Male", "Female", "male", "female"]).optional(),
        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .optional()
            .or(z.literal("")),
        confirmPassword: z.string().optional().or(z.literal("")),
        image: z.any().optional(),
    })
    .refine(
        (data) => {
            if (data.newPassword && data.newPassword.length > 0) {
                return data.newPassword === data.confirmPassword;
            }
            return true;
        },
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

export type DoctorUpdateFormInputs = z.infer<typeof doctorUpdateSchema>;
