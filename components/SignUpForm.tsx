"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { signUpSchema } from "@/schemas/signUpSchema";
import { Button } from "@/components/ui/Button";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwrordConfirmation: "",
    },
  });

  const passwordValue = watch("password") || "";

  // Password Validation Checks
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const isMinLength = passwordValue.length >= 8;

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (error: any) {
      console.error("Sign-up error:", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occurred during sign-up. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsSubmitting(true);
    setVerificationError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Verification incomplete:", result);
        setVerificationError(
          "Verification could not be completed. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setVerificationError(
        error.errors?.[0]?.message ||
          "An error occurred during verification. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verifying) {
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

        <div className="w-full bg-stone-100 border border-stone-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="font-cooper text-[28px] font-normal leading-tight text-[#3C3833]">
              Verify Email
            </h1>
            <p className="text-xs font-sans text-[#8C8880] mt-1">
              We've sent a verification code to your email address.
            </p>
          </div>

          {verificationError && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2 text-xs">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{verificationError}</p>
            </div>
          )}

          <form onSubmit={handleVerificationSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="verificationCode"
                className="text-[10px] font-mono font-bold text-[#8C8880] uppercase tracking-wider block"
              >
                Verification Code <span className="text-red-500">*</span>
              </label>
              <input
                id="verificationCode"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#E2DFD8] rounded-lg text-sm text-[#3C3833] focus:outline-none focus:border-[#3C3833] transition-colors"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="form"
              isLoading={isSubmitting}
              className="w-full h-10"
            >
              VERIFY EMAIL
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-stone-500">
              Didn't receive a code?{" "}
              <button
                onClick={async () => {
                  if (signUp) {
                    await signUp.prepareEmailAddressVerification({
                      strategy: "email_code",
                    });
                  }
                }}
                className="underline text-[#3C3833] font-medium"
              >
                Resend code
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              Create account
            </h3>
            <p className="text-stone-500 font-normal text-sm">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold underline hover:text-indigo-600"
              >
                Login.
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Box: Credentials Form */}
        <div className="relative z-0 flex flex-col items-stretch gap-6 pt-10 pb-6 px-6 w-full -mt-4 border-b border-x border-stone-200 bg-white rounded-b-2xl">
          {authError && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-lg flex items-center gap-2 text-xs">
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
                    htmlFor="email"
                    className="text-sm font-medium text-stone-800"
                  >
                    Email<span className="text-rose-500"> *</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    {...register("email")}
                    className={`w-full max-h-9 p-2 pl-3 outline-none text-sm rounded-lg border transition-all duration-100 ${
                      errors.email
                        ? "border-red-400 focus:border-red-400"
                        : "border-stone-200 focus-within:border-stone-300"
                    } bg-white text-stone-800 hover:border-stone-300`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1 group">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-stone-800"
                    >
                      Password<span className="text-rose-500"> *</span>
                    </label>
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

                {/* Password Checker List */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <p
                      className={`font-normal text-xs leading-4 ${hasSpecialChar ? "text-green-600 font-semibold" : "text-stone-500"}`}
                    >
                      At least 1 special character
                    </p>
                    <span
                      className={
                        hasSpecialChar ? "text-green-600" : "text-stone-300"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3.33337 9.66675C3.33337 9.66675 4.33337 9.66675 5.66671 12.0001C5.66671 12.0001 9.37257 5.88897 12.6667 4.66675"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        ></path>
                      </svg>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p
                      className={`font-normal text-xs leading-4 ${hasUpperCase ? "text-green-600 font-semibold" : "text-stone-500"}`}
                    >
                      At least 1 uppercase letter
                    </p>
                    <span
                      className={
                        hasUpperCase ? "text-green-600" : "text-stone-300"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3.33337 9.66675C3.33337 9.66675 4.33337 9.66675 5.66671 12.0001C5.66671 12.0001 9.37257 5.88897 12.6667 4.66675"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        ></path>
                      </svg>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p
                      className={`font-normal text-xs leading-4 ${hasNumber ? "text-green-600 font-semibold" : "text-stone-500"}`}
                    >
                      At least 1 number
                    </p>
                    <span
                      className={
                        hasNumber ? "text-green-600" : "text-stone-300"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3.33337 9.66675C3.33337 9.66675 4.33337 9.66675 5.66671 12.0001C5.66671 12.0001 9.37257 5.88897 12.6667 4.66675"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        ></path>
                      </svg>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p
                      className={`font-normal text-xs leading-4 ${isMinLength ? "text-green-600 font-semibold" : "text-stone-500"}`}
                    >
                      Min 8 characters
                    </p>
                    <span
                      className={
                        isMinLength ? "text-green-600" : "text-stone-300"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3.33337 9.66675C3.33337 9.66675 4.33337 9.66675 5.66671 12.0001C5.66671 12.0001 9.37257 5.88897 12.6667 4.66675"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Password field */}
              <div className="flex flex-col gap-1 group">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="passwrordConfirmation"
                    className="text-sm font-medium text-stone-800"
                  >
                    Confirm Password<span className="text-rose-500"> *</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="passwrordConfirmation"
                    type="password"
                    required
                    {...register("passwrordConfirmation")}
                    className={`w-full max-h-9 p-2 pl-3 outline-none text-sm rounded-lg border transition-all duration-100 ${
                      errors.passwrordConfirmation
                        ? "border-red-400 focus:border-red-400"
                        : "border-stone-200 focus-within:border-stone-300"
                    } bg-white text-stone-800 hover:border-stone-300`}
                  />
                </div>
                {errors.passwrordConfirmation && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.passwrordConfirmation.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="form"
              isLoading={isSubmitting}
              className="w-full h-10"
            >
              Sign up
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
