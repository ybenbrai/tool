import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={
      "w-full p-3 rounded-lg border bg-background shadow focus:outline-none " +
      (className || "")
    }
    {...props}
  />
));
Input.displayName = "Input";
