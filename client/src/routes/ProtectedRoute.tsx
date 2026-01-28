import { useGetMeApi } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const { data, isLoading } = useGetMeApi();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin" />
        {isLoading?"Please Wait Redirecting To Login ....":"you will se Login "}
      </div>
    );
  }
  return data?.data.id ? <Outlet /> : <Navigate to="/login" />;
}
