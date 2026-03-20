import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base = variant === "primary" ? "glass-btn-primary" : "glass-btn-ghost";
  return (
    <button className={`${base} px-5 py-2.5 text-sm ${className}`} {...props}>
      {children}
    </button>
  );
}
