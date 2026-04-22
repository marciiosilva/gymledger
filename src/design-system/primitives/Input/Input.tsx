import * as React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leadingIcon, trailingIcon, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-[6px]">
        {label && (
          <label
            htmlFor={inputId}
            className="font-body font-[700] text-[var(--text-sm)] text-[var(--color-text-primary)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <span className="absolute left-3 text-[var(--color-text-muted)]">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full min-h-[46px] px-4 rounded-[var(--radius-lg)]",
              "border border-[var(--color-border)] bg-white",
              "font-body text-[var(--text-base)] text-[var(--color-text-primary)]",
              "placeholder:text-[var(--color-text-muted)]",
              "transition-colors duration-[var(--duration-fast)]",
              "focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]",
              "disabled:opacity-50 disabled:pointer-events-none",
              hasError && "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]",
              leadingIcon && "pl-10",
              trailingIcon && "pr-10",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {trailingIcon && (
            <span className="absolute right-3 text-[var(--color-text-muted)]">
              {trailingIcon}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="font-body text-[var(--text-xs)] text-[var(--color-danger)]">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="font-body text-[var(--text-xs)] text-[var(--color-text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
