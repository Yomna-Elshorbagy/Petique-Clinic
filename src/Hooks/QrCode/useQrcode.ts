// src/hooks/useQr.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseURL } from "../../Apis/BaseUrl";

export interface QrResponse {
  success: boolean;
  qrCode: string;
  expiresIn: string;
}

export function useQr() {
  return useQuery<QrResponse>({
    queryKey: ["qr-code"],
    queryFn: async () => {
      const res = await axios.get(
        `${baseURL}/qr/generate`
      );
      return res.data;
    },
    refetchInterval: 60 * 60 * 1000, 
    staleTime: 1000 * 60 * 10,
  });
}
