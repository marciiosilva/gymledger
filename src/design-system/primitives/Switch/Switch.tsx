import * as React from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { cn } from "../../utils/cn";

export interface SwitchProps extends RadixSwitch.SwitchProps {
  label?: string;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(({ className, label, id, ...props }, ref) => {
  const switchId = id ?? React.useId();

  return (
    <div className="flex items-center gap-2">
      <RadixSwitch.Root
        ref={ref}
        id={switchId}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-[var(--radius-full)]",
          "border border-[var(--color-border)] bg-[var(--color-surface-soft)]",
          "transition-colors duration-[var(--duration-base)]",
          "data-[state=checked]:bg-[var(--color-accent)] data-[state=checked]:border-[var(--color-accent)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
          "disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          className
        )}
        {...props}
      >
        <RadixSwitch.Thumb
          className={cn(
            "block size-4 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)]",
            "transition-transform duration-[var(--duration-base)]",
            "translate-x-[3px] data-[state=checked]:translate-x-[23px]"
          )}
        />
      </RadixSwitch.Root>
      {label && (
        <label
          htmlFor={switchId}
          className="font-body text-[var(--text-sm)] text-[var(--color-text-primary)] cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
});

Switch.displayName = "Switch";
