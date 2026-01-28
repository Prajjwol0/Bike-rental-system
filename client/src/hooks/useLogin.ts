
import { getSingleId, loginUser } from "@/services/bikeService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useGetById = (id: string | number) => {
  return useQuery({
    queryKey: ["LEARN", id],
    queryFn: () => getSingleId(id),
    
  });

};
