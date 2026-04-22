import * as React from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

export interface CheckboxProps extends RadixCheckbox.CheckboxProps {
  label?: string;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(({ className, label, id, ...props }, ref) => {
  const checkboxId = id ?? React.useId();

  return (
    <div className="flex items-center gap-2">
      <RadixCheckbox.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          "size-5 flex items-center justify-center flex-shrink-0",
          "rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white",
          "transition-colors duration-[var(--duration-fast)]",
          "hover:border-[var(--color-accent)]",
          "data-[state=checked]:bg-[var(--color-accent)] data-[state=checked]:border-[var(--color-accent)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
          "disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          className
        )}
        {...props}
      >
        <RadixCheckbox.Indicator>
          <Check className="size-3 text-white stroke-[3]" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && (
        <label
          htmlFor={checkboxId}
          className="font-body text-[var(--text-sm)] text-[var(--color-text-primary)] cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";
