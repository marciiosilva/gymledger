import * as React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<RadixSelect.SelectProps, "children"> {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

export function Select({
  options,
  placeholder = "Selecione...",
  label,
  error,
  helperText,
  className,
  ...props
}: SelectProps) {
  const id = React.useId();
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-[6px]">
      {label && (
        <label
          htmlFor={id}
          className="font-body font-[700] text-[var(--text-sm)] text-[var(--color-text-primary)]"
        >
          {label}
        </label>
      )}
      <RadixSelect.Root {...props}>
        <RadixSelect.Trigger
          id={id}
          className={cn(
            "w-full flex items-center justify-between gap-2",
            "min-h-[46px] px-4 rounded-[var(--radius-lg)]",
            "border border-[var(--color-border)] bg-white",
            "font-body text-[var(--text-base)] text-[var(--color-text-primary)]",
            "transition-colors duration-[var(--duration-fast)]",
            "focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]",
            "data-[placeholder]:text-[var(--color-text-muted)]",
            "disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
            hasError && "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]",
            className
          )}
          aria-invalid={hasError}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="size-4 text-[var(--color-text-muted)]" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className={cn(
              "z-50 min-w-[var(--radix-select-trigger-width)]",
              "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white",
              "shadow-[var(--shadow-md)] p-1",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            )}
            position="popper"
            sideOffset={6}
          >
            <RadixSelect.Viewport>
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    "flex items-center justify-between gap-2",
                    "min-h-[40px] px-3 rounded-[var(--radius-md)]",
                    "font-body text-[var(--text-sm)] text-[var(--color-text-primary)]",
                    "cursor-pointer select-none outline-none",
                    "hover:bg-[var(--color-surface-soft)]",
                    "focus:bg-[var(--color-surface-soft)]",
                    "data-[highlighted]:bg-[var(--color-success-soft)] data-[highlighted]:text-[var(--color-accent-active)]",
                    "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
                  )}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check className="size-4 text-[var(--color-accent)]" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error && (
        <p className="font-body text-[var(--text-xs)] text-[var(--color-danger)]">{error}</p>
      )}
      {!error && helperText && (
        <p className="font-body text-[var(--text-xs)] text-[var(--color-text-muted)]">{helperText}</p>
      )}
    </div>
  );
}

Select.displayName = "Select";
