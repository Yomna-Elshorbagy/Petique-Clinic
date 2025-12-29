import { z } from "zod";

export const fullReservationSchema = z.object({
    user: z.object({
        userName: z
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(70, "Name cannot exceed 70 characters"),
        email: z.string().email("Invalid email address"),
        mobileNumber: z
            .string()
            .regex(/^01[01245]\d{8}$/, "Invalid Egyptian mobile number"),
        gender: z.enum(["male", "female"]),
    }),
    pet: z.object({
        name: z.string().min(1, "Pet name is required"),
        age: z.number().min(0, "Age must be a positive number"),
        weight: z.number().min(0, "Weight must be a positive number"),
        category: z.string().min(1, "Category is required"),
        allergies: z.array(z.string()),
    }),
    reservation: z.object({
        service: z.string().min(1, "Service is required"),
        doctor: z.string().min(1, "Doctor is required"),
        date: z.string().min(1, "Date is required"),
        timeSlot: z.string().min(1, "Time slot is required"),
        notes: z.string().optional(),
    }),
});

export type FullReservationFormData = z.infer<typeof fullReservationSchema>;
