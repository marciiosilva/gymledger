import * as React from "react";
import { cn } from "../../utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const textareaId = id ?? React.useId();
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-[6px]">
        {label && (
          <label
            htmlFor={textareaId}
            className="font-body font-[700] text-[var(--text-sm)] text-[var(--color-text-primary)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full min-h-[112px] px-4 py-3 rounded-[var(--radius-lg)]",
            "border border-[var(--color-border)] bg-white",
            "font-body text-[var(--text-base)] text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-muted)]",
            "transition-colors duration-[var(--duration-fast)]",
            "focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]",
            "disabled:opacity-50 disabled:pointer-events-none resize-y",
            hasError && "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="font-body text-[var(--text-xs)] text-[var(--color-danger)]">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${textareaId}-helper`} className="font-body text-[var(--text-xs)] text-[var(--color-text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
