import { z } from "zod";

export const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  age: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      return isNaN(num) ? 0 : num;
    })
    .refine((val) => val > 0, "Age must be a positive number"),
  weight: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      return isNaN(num) ? 0 : num;
    })
    .refine((val) => val > 0, "Weight must be a positive number"),
  category: z.string().min(1, "Category is required"),
  allergies: z.array(z.string()).default([]),
  image: z.any().optional(), 
});

export type PetFormData = z.infer<typeof petSchema>;
