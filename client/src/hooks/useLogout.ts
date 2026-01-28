

import { logoutApi } from "@/services/bikeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogoutApi = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: logoutApi, onSuccess: () => qc.clear() });
};
