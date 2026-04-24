import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

const DialogRoot = RadixDialog.Root;
const DialogTrigger = RadixDialog.Trigger;
const DialogClose = RadixDialog.Close;
const DialogPortal = RadixDialog.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[var(--navy-900)]/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "Dialog.Overlay";

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  showClose?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  DialogContentProps
>(({ className, children, showClose = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <RadixDialog.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        "w-full max-w-lg max-h-[85vh] overflow-y-auto",
        "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lg)]",
        "p-6 focus:outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
      {showClose && (
        <DialogClose
          className={cn(
            "absolute right-4 top-4 size-8 flex items-center justify-center",
            "rounded-[var(--radius-md)] text-[var(--color-text-muted)]",
            "hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]",
            "transition-colors duration-[var(--duration-fast)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          )}
        >
          <X className="size-4" />
          <span className="sr-only">Fechar</span>
        </DialogClose>
      )}
    </RadixDialog.Content>
  </DialogPortal>
));
DialogContent.displayName = "Dialog.Content";

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 mb-5", className)} {...props} />
);
DialogHeader.displayName = "Dialog.Header";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-2 mt-6 pt-4 border-t border-[var(--color-border)]", className)}
    {...props}
  />
);
DialogFooter.displayName = "Dialog.Footer";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Title>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={cn("font-display font-[700] text-[var(--text-xl)] text-[var(--color-text-primary)] tracking-tight m-0", className)}
    {...props}
  />
));
DialogTitle.displayName = "Dialog.Title";

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Description>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
  <RadixDialog.Description
    ref={ref}
    className={cn("font-body text-[var(--text-sm)] text-[var(--color-text-muted)] leading-[1.6] m-0", className)}
    {...props}
  />
));
DialogDescription.displayName = "Dialog.Description";

export const Dialog = Object.assign(DialogRoot, {
  Trigger:     DialogTrigger,
  Content:     DialogContent,
  Header:      DialogHeader,
  Footer:      DialogFooter,
  Title:       DialogTitle,
  Description: DialogDescription,
  Close:       DialogClose,
});
