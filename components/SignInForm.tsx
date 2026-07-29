"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { Button } from "@/components/ui/Button";

export default function SignInForm() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Sign-in incomplete:", result);
        setAuthError("Sign-in could not be completed. Please try again.");
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occurred during sign-in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] flex flex-col items-center">
      {/* Centered Flower/Loop Logo */}
      <div className="mb-6 text-[#3C3833]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 71 72"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25.0753 25.4554C19.9752 22.6862 14.313 20.4515 9.32073 20.4515C-3.16641 20.4515 -3.04727 51.3383 9.32073 51.3383C14.2772 51.3383 19.894 49.1355 24.9654 46.3939C22.2207 51.4684 20.0144 57.0903 20.0144 62.0507C20.0144 74.4187 50.9012 74.5378 50.9012 62.0507C50.9012 57.0856 48.6908 51.4578 45.9425 46.3795C51.0208 49.1278 56.6486 51.3383 61.6137 51.3383C73.9817 51.3383 74.1008 20.4515 61.6137 20.4515C56.6935 20.4515 51.1227 22.622 46.0806 25.3357C48.8055 20.2818 50.989 14.6925 50.989 9.75775C50.989 -2.61026 20.1022 -2.72939 20.1022 9.75775C20.1022 14.7315 22.3203 20.3702 25.0753 25.4554Z"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Stacked Cards Container */}
      <div className="w-full flex flex-col items-stretch">
        {/* Top Box: Header + Google Button */}
        <div className="relative p-6 flex flex-col gap-6 rounded-t-2xl border-t border-x border-stone-200 bg-stone-100 z-10 w-full">
          <div className="flex flex-col gap-1">
            <h3 className="text-stone-700 font-normal text-2xl font-cooper leading-[120%]">
              Login
            </h3>
            <p className="text-stone-500 font-normal text-sm">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold underline hover:text-indigo-600"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Box: Credentials Form */}
        <div className="relative z-0 flex flex-col items-stretch gap-6 pt-10 pb-6 px-6 w-full -mt-4 border-b border-x border-stone-200 bg-white rounded-b-2xl">
          {authError && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-lg flex items-center gap-2 text-xs animate-fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{authError}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              {/* Email field */}
              <div className="flex flex-col gap-1 group">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="identifier"
                    className="text-sm font-medium text-stone-800"
                  >
                    Email<span className="text-rose-500"> *</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="identifier"
                    type="email"
                    required
                    {...register("identifier")}
                    className={`w-full max-h-9 p-2 pl-3 outline-none text-sm rounded-lg border transition-all duration-100 ${
                      errors.identifier
                        ? "border-red-400 focus:border-red-400"
                        : "border-stone-200 focus-within:border-stone-300"
                    } bg-white text-stone-800 hover:border-stone-300`}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1 group">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-stone-800"
                  >
                    Password<span className="text-rose-500"> *</span>
                  </label>
                  <p className="text-stone-500 font-normal text-[10px]">
                    <Link
                      href="/dashboard"
                      className="hover:underline text-stone-500 hover:text-stone-800"
                    >
                      Forgot password?
                    </Link>
                  </p>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    {...register("password")}
                    className={`w-full max-h-9 p-2 pl-3 pr-10 outline-none text-sm rounded-lg border transition-all duration-100 ${
                      errors.password
                        ? "border-red-400 focus:border-red-400"
                        : "border-stone-200 focus-within:border-stone-300"
                    } bg-white text-stone-800 hover:border-stone-300`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 size-9 text-stone-500 hover:text-stone-950 flex items-center justify-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="charcoal"
              size="form"
              isLoading={isSubmitting}
              className="w-full h-10 border-2 border-stone-800"
            >
              Login
            </Button>
          </form>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-stone-500 dark:text-stone-600 font-normal text-xs px-4 md:px-0 mt-6 text-center">
        By signing in, you agree to DropX{" "}
        <a
          href="/terms"
          className="underline font-semibold hover:text-indigo-600"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="underline font-semibold hover:text-indigo-600"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
