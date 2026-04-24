import * as React from "react";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../../utils/cn";

const itemBase = cn(
  "relative flex cursor-pointer select-none items-center gap-2",
  "min-h-[38px] rounded-[var(--radius-md)] px-3",
  "font-body text-[var(--text-sm)] text-[var(--color-text-primary)]",
  "outline-none transition-colors duration-[var(--duration-fast)]",
  "focus:bg-[var(--color-surface-soft)] data-[highlighted]:bg-[var(--color-surface-soft)]",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
);

const DropdownRoot = RadixDropdown.Root;
const DropdownTrigger = RadixDropdown.Trigger;
const DropdownGroup = RadixDropdown.Group;
const DropdownSub = RadixDropdown.Sub;

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <RadixDropdown.Portal>
    <RadixDropdown.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[180px] overflow-hidden",
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-1",
        "shadow-[var(--shadow-md)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </RadixDropdown.Portal>
));
DropdownContent.displayName = "Dropdown.Content";

const DropdownItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.Item>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.Item> & { destructive?: boolean }
>(({ className, destructive, ...props }, ref) => (
  <RadixDropdown.Item
    ref={ref}
    className={cn(
      itemBase,
      destructive && "text-[var(--color-danger)] focus:bg-[var(--red-100)] data-[highlighted]:bg-[var(--red-100)]",
      className
    )}
    {...props}
  />
));
DropdownItem.displayName = "Dropdown.Item";

const DropdownCheckboxItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <RadixDropdown.CheckboxItem
    ref={ref}
    className={cn(itemBase, "pl-8", className)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-3 flex size-4 items-center justify-center">
      <RadixDropdown.ItemIndicator>
        <Check className="size-3 text-[var(--color-accent)]" />
      </RadixDropdown.ItemIndicator>
    </span>
    {children}
  </RadixDropdown.CheckboxItem>
));
DropdownCheckboxItem.displayName = "Dropdown.CheckboxItem";

const DropdownRadioItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.RadioItem>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.RadioItem>
>(({ className, children, ...props }, ref) => (
  <RadixDropdown.RadioItem
    ref={ref}
    className={cn(itemBase, "pl-8", className)}
    {...props}
  >
    <span className="absolute left-3 flex size-4 items-center justify-center">
      <RadixDropdown.ItemIndicator>
        <Circle className="size-2 fill-[var(--color-accent)] text-[var(--color-accent)]" />
      </RadixDropdown.ItemIndicator>
    </span>
    {children}
  </RadixDropdown.RadioItem>
));
DropdownRadioItem.displayName = "Dropdown.RadioItem";

const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.Label>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.Label>
>(({ className, ...props }, ref) => (
  <RadixDropdown.Label
    ref={ref}
    className={cn(
      "px-3 py-1.5 font-body text-[var(--text-xs)] font-[800] uppercase tracking-widest text-[var(--color-text-muted)]",
      className
    )}
    {...props}
  />
));
DropdownLabel.displayName = "Dropdown.Label";

const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.Separator>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.Separator>
>(({ className, ...props }, ref) => (
  <RadixDropdown.Separator
    ref={ref}
    className={cn("my-1 h-px bg-[var(--color-border)]", className)}
    {...props}
  />
));
DropdownSeparator.displayName = "Dropdown.Separator";

const DropdownSubTrigger = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <RadixDropdown.SubTrigger
    ref={ref}
    className={cn(itemBase, "justify-between", className)}
    {...props}
  >
    {children}
    <ChevronRight className="size-4 text-[var(--color-text-muted)]" />
  </RadixDropdown.SubTrigger>
));
DropdownSubTrigger.displayName = "Dropdown.SubTrigger";

const DropdownSubContent = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.SubContent>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.SubContent>
>(({ className, ...props }, ref) => (
  <RadixDropdown.Portal>
    <RadixDropdown.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-[160px] overflow-hidden",
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-1",
        "shadow-[var(--shadow-md)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  </RadixDropdown.Portal>
));
DropdownSubContent.displayName = "Dropdown.SubContent";

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger:      DropdownTrigger,
  Content:      DropdownContent,
  Item:         DropdownItem,
  CheckboxItem: DropdownCheckboxItem,
  RadioItem:    DropdownRadioItem,
  RadioGroup:   RadixDropdown.RadioGroup,
  Label:        DropdownLabel,
  Separator:    DropdownSeparator,
  Group:        DropdownGroup,
  Sub:          DropdownSub,
  SubTrigger:   DropdownSubTrigger,
  SubContent:   DropdownSubContent,
});
