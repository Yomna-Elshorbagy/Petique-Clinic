import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

export interface InputProps {
  type?: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}