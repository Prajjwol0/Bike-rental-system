import { httpClient } from "@/api/auth.api";
import { endpoints } from "@/constants/endpoints";
import type { IProfile } from "@/types/auth.types";
import { useQuery } from "@tanstack/react-query";

const getme = () => httpClient.get<IProfile>(endpoints.me);

export const useGetMeApi = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: getme,
    select: (d) => d.data,
    
  });

