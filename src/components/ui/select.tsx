import * as React from "react";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={
      "w-full p-2 rounded-lg border bg-background shadow focus:outline-none " +
      (className || "")
    }
    {...props}
  />
));
Select.displayName = "Select";
