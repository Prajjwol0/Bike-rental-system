
import { registerUser } from "@/services/bikeService";
import { useMutation } from "@tanstack/react-query"

export const useRegister=()=>{
    return useMutation({
        mutationFn:registerUser,
    });
};