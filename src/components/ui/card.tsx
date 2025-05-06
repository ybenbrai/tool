import * as React from "react";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={
      "rounded-2xl bg-card shadow-lg border border-border/30 p-6 " +
      (className || "")
    }
    {...props}
  />
));
Card.displayName = "Card";
