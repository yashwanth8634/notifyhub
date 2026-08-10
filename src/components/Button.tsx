import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn-gradient text-white",
  secondary: "bg-gray-700 text-white hover:bg-gray-600",
  ghost: "text-gray-400 hover:text-white hover:bg-white/5",
  outline:
    "border border-white/10 text-gray-200 hover:text-white hover:bg-white/5",
  danger:
    "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm rounded-md",
  md: "px-5 py-2.5 text-sm rounded-md",
  lg: "px-6 py-3 text-base rounded-md",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed tracking-tight ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
