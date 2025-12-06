import zod from "zod";
import { passRegex } from "../../Constants/const";

export const loginSchema = zod.object({
  email: zod.email("Please enter a correct email"),
  password: zod.string().regex(passRegex, "Please enter a correct passwrod"),
});

export type LoginSchemaType = zod.infer<typeof loginSchema>;

export const loginDefaultValues = {
  email: "",
  password: "",
};