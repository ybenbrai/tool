import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={
        `px-6 py-2 rounded-lg font-medium transition shadow focus:outline-none ` +
        (variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/80"
          : "bg-muted text-foreground hover:bg-accent/80") +
        (className ? ` ${className}` : "")
      }
      {...props}
    />
  )
);
Button.displayName = "Button";
