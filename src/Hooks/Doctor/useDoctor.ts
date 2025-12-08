import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDoctor } from "../../Apis/DoctoresApis";

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateDoctor(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};
