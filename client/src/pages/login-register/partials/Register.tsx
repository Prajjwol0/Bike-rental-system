import { useRegister } from "@/hooks/useRegister";
import type { RegisterPayload } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaApple, FaGoogle } from "react-icons/fa";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "@/schemas/auth.schema";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  // const{isshowing ,setIsShowing}=useState(true)
  const { mutateAsync, isPending, isError, isSuccess } = useRegister();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onsubmit: SubmitHandler<RegisterPayload> = async (data) => {
    console.log("Form data", data);

    // Submit the form
    try {
      const result = await mutateAsync({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      {
      
         toast(result.data.message);
          reset();
          navigate("/login")
        

    }
  }
     catch (e) {
      toast.error((e as Error).message);
    }
  };

  const ImageUrl = "/images/bikers.jpg";

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <div className=" w-full flex items-center justify-center  p-2 sm:p-4 overflow-hidden">
        <div className="w-full max-w-4xl bg-white rounded-2xl flex overflow-hidden">
          {/* LEFT FORM */}
          <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-14">
            <h2 className="text-2xl  text-left font-medium mb-8">
              Get Started Now
            </h2>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm mb-1 font-medium text-gray-700 text-left"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("username")}
                  placeholder="Enter your name"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-600 outline-none font-medium"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm ">
                    {errors.username.message}{" "}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm mb-1 font-medium text-gray-700 text-left"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="w-full border rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-gray-600 outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm ">
                    {" "}
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm mb-1 font-medium text-gray-700 text-left"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-600 outline-none font-medium"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm ">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* //confirmPassword */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm mb-1 font-medium text-gray-700 text-left"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("confirmPassword")}
                  placeholder=" Re-Enter your password"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-600 outline-none font-medium"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm ">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              

              <div className="flex items-center gap-2 text-xs text-gray-600 accent-zinc-700">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
                <label htmlFor="terms" className="font-medium text-sm">
                  I agree to the terms & policy
                </label>
              </div>

              {/* Error/Success Messages */}
              {isError && (
                <p className="text-red-500 text-sm text-center">
                  Registration failed. Please try again.
                </p>
              )}
              {isSuccess && (
                <p className="text-green-600 text-sm text-center">
                  Registered successfully!
                </p>
              )}

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isSubmitting || !agreeToTerms}
                className="w-full bg-zinc-500 text-white text-sm py-2.5 rounded-md hover:bg-neutral-400 transition disabled:bg-neutral-400 disabled:cursor-not-allowed"
              >
                {isPending ? "waiting..." : "Signup"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex-1 border-t" />
                Or
                <div className="flex-1 border-t" />
              </div>

              {/* Social Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={(e) => e.preventDefault()}
                  className="flex-1 border rounded-md py-2 flex items-center justify-center gap-2 text-sm hover:bg-gray-50"
                >
                  <FaGoogle className="" />
                  Google
                </button>

                <button
                  onClick={(e) => e.preventDefault()}
                  className="flex-1 border rounded-md py-2 flex items-center justify-center gap-2 text-sm hover:bg-gray-50"
                >
                  <FaApple />
                  Apple
                </button>
              </div>

              {/* Sign In */}
              <Link to="/login">
                <p className="md-flex text-center  mt-10 font-medium text-gray-600">
                  Have an account?
                  <span className="ml-1 text-blue-600 cursor-pointer">
                    Sign In
                  </span>
                </p>
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden lg:block w-1/2 p-4">
            <img
              src={ImageUrl}
              alt="Leaf"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
