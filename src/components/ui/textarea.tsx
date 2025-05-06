import * as React from "react";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={
      "w-full h-48 p-3 rounded-lg border bg-background shadow focus:outline-none " +
      (className || "")
    }
    {...props}
  />
));
Textarea.displayName = "Textarea";
