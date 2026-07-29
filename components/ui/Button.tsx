import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "charcoal";
  size?: "sm" | "md" | "lg" | "responsive" | "form";
  href?: string;
  external?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "responsive",
      href,
      external,
      isLoading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "cursor-pointer box-border flex items-center justify-center font-semibold font-mono uppercase border transition-all ease-in duration-75 whitespace-nowrap text-center select-none disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed gap-x-2 active:shadow-none active:scale-95";

    const variantStyles = {
      secondary:
        "bg-white border-stone-200 hover:bg-stone-100 hover:border-stone-300 text-stone-800 disabled:bg-stone-100 disabled:border-stone-200 dark:bg-stone-100 dark:border-stone-200 dark:hover:bg-stone-200 dark:hover:border-stone-300 disabled:dark:bg-stone-200",
      primary:
        "text-stone-50 bg-[#615FFF] border border-[#4E4BCC] hover:bg-[#4E4BCC] dark:text-stone-900 dark:bg-[#615FFF] dark:disabled:bg-stone-400 dark:hover:disabled:bg-stone-400",
      charcoal:
        "bg-[#3C3833] border border-[#3C3833] hover:bg-stone-700 text-white disabled:bg-stone-400",
    };

    const sizeStyles = {
      sm: "text-xs leading-4 rounded-lg px-3 py-1 h-6",
      md: "text-sm leading-5 rounded-lg px-4 py-1.5 h-8",
      lg: "text-sm md:text-base leading-6 rounded-lg px-6 py-2.5 h-11",
      form: "text-[11px] leading-5 rounded-lg px-4 py-2.5 h-10 tracking-wider",
      responsive:
        "text-xs leading-4 rounded-lg px-3 py-1 h-6 lg:text-sm lg:leading-5 lg:rounded-lg lg:px-4 lg:py-1.5 lg:h-8",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      isLoading && "opacity-75 cursor-not-allowed",
      className,
    );

    if (href && !isLoading) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClassName}
            ref={ref}
            translate="no"
          >
            <div className="flex items-center gap-x-2">{children}</div>
          </a>
        );
      }
      return (
        <Link
          href={href}
          className={combinedClassName}
          ref={ref}
          translate="no"
        >
          <div className="flex items-center gap-x-2">{children}</div>
        </Link>
      );
    }

    return (
      <button
        className={combinedClassName}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        <div className="flex items-center gap-x-2">
          {isLoading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {children}
        </div>
      </button>
    );
  },
);

Button.displayName = "Button";
