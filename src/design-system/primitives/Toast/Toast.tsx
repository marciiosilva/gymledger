import * as React from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const toastVariants = cva(
  [
    "group pointer-events-auto relative flex w-full items-start gap-3",
    "overflow-hidden rounded-[var(--radius-xl)] border p-4",
    "shadow-[var(--shadow-lg)] transition-all",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
    "data-[state=open]:slide-in-from-top-full",
  ],
  {
    variants: {
      variant: {
        default: "bg-white border-[var(--color-border)] text-[var(--color-text-primary)]",
        success: "bg-white border-[rgba(30,182,74,0.3)] text-[var(--color-text-primary)]",
        warning: "bg-white border-[var(--amber-100)] text-[var(--color-text-primary)]",
        danger:  "bg-white border-[var(--red-100)] text-[var(--color-text-primary)]",
        info:    "bg-white border-[var(--navy-100)] text-[var(--color-text-primary)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const ICONS: Record<string, React.ReactNode> = {
  success: <CheckCircle className="size-5 text-[var(--color-accent)] shrink-0 mt-px" />,
  warning: <AlertTriangle className="size-5 text-[var(--amber-600)] shrink-0 mt-px" />,
  danger:  <XCircle className="size-5 text-[var(--color-danger)] shrink-0 mt-px" />,
  info:    <Info className="size-5 text-[var(--navy-700)] shrink-0 mt-px" />,
};

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof RadixToast.Root>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
}

const ToastRoot = React.forwardRef<
  React.ElementRef<typeof RadixToast.Root>,
  ToastProps
>(({ className, variant = "default", title, description, children, ...props }, ref) => (
  <RadixToast.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  >
    {variant && variant !== "default" && ICONS[variant]}
    <div className="flex-1 min-w-0">
      {title && (
        <RadixToast.Title className="font-body font-[700] text-[var(--text-sm)] text-[var(--color-text-primary)] mb-1">
          {title}
        </RadixToast.Title>
      )}
      {description && (
        <RadixToast.Description className="font-body text-[var(--text-xs)] text-[var(--color-text-muted)] leading-[1.5]">
          {description}
        </RadixToast.Description>
      )}
      {children}
    </div>
    <RadixToast.Close
      className={cn(
        "shrink-0 size-6 flex items-center justify-center rounded-[var(--radius-sm)]",
        "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
        "hover:bg-[var(--color-surface-soft)] transition-colors duration-[var(--duration-fast)]",
        "opacity-0 group-hover:opacity-100 focus:opacity-100"
      )}
    >
      <X className="size-3.5" />
      <span className="sr-only">Fechar</span>
    </RadixToast.Close>
  </RadixToast.Root>
));
ToastRoot.displayName = "Toast";

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof RadixToast.Viewport>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Viewport>
>(({ className, ...props }, ref) => (
  <RadixToast.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2 p-4",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = "Toast.Viewport";

export const Toast = Object.assign(ToastRoot, {
  Provider: RadixToast.Provider,
  Viewport: ToastViewport,
  Action:   RadixToast.Action,
});
