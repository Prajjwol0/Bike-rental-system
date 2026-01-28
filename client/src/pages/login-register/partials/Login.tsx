import { useLogin } from "@/hooks/useLogin";
import type { LoginPayload } from "@/types/auth.types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaApple, FaGoogle } from "react-icons/fa";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export default function Login() {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { mutateAsync, isError, isPending, isSuccess } = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginPayload>();

  const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
    console.log("form data", data);

    try {
      const result = await mutateAsync({
        email: data.email,
        password: data.password,
      });

      toast(result.data.message);
      reset();
      navigate("/dashboard");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const ImageUrl = "/images/bikers.jpg";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <div className="w-full max-w-4xl h-150 lg:h-175 bg-white rounded-2xl flex overflow-hidden ">
          {/* LEFT  */}
          <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-14 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="text-left">
                <h2 className="text-2xl font-medium mb-2">Welcome back!</h2>
                <p className="text-gray-600 text-sm">
                  Enter your Credentials to access your account
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Please Enter Your Email",
                  })}
                  className="w-full border rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-gray-600 outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password  */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Please Enter your password",
                  })}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-600 outline-none font-medium"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 text-xs text-gray-600 accent-zinc-700">
                <input
                  id="check"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
                <label
                  htmlFor="check"
                  className="font-medium text-sm cursor-pointer"
                >
                  Remember for 30 days
                </label>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Error Success */}
              <div className="h-20 p-3 rounded-md flex items-center justify-center bg-gray-50">
                {isError && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-md w-full text-center">
                    <p className="text-red-700 text-sm">
                      Login failed. Please check your credentials.
                    </p>
                  </div>
                )}
                {isSuccess && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-md w-full text-center">
                    <p className="text-green-700 text-sm">
                      Login successful! Redirecting...
                    </p>
                  </div>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isPending || !agreeToTerms}
                className="w-full bg-zinc-500 text-white text-sm py-3 rounded-md hover:bg-neutral-400 transition-all disabled:bg-neutral-400 disabled:cursor-not-allowed shadow-md font-medium"
              >
                {isPending ? "Logging in..." : "Login"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex-1 border-t" />
                Or
                <div className="flex-1 border-t" />
              </div>

              {/* Social Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={(e) => e.preventDefault()}
                  className="flex-1 border border-gray-300 rounded-md py-2.5 flex items-center justify-center gap-2 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isPending}
                >
                  <FaGoogle className="text-lg" />
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => e.preventDefault()}
                  className="flex-1 border border-gray-300 rounded-md py-2.5 flex items-center justify-center gap-2 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isPending}
                >
                  <FaApple className="text-lg" />
                  <span>Apple</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center mt-8 font-medium text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="ml-1 text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          <div className="hidden lg:block w-1/2 p-4">
            <img
              src={ImageUrl}
              alt="Welcome"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
