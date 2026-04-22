import * as React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "../../utils/cn";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: RadixTooltip.TooltipContentProps["side"];
  delayDuration?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  delayDuration = 300,
  className,
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={6}
            className={cn(
              "z-50 max-w-[280px] px-3 py-2 rounded-[var(--radius-md)]",
              "bg-[var(--navy-900)] text-white",
              "font-body text-[var(--text-xs)] font-[700] leading-[1.5]",
              "shadow-[var(--shadow-md)]",
              "animate-in fade-in-0 zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "data-[side=top]:slide-in-from-bottom-2",
              "data-[side=bottom]:slide-in-from-top-2",
              className
            )}
          >
            {content}
            <RadixTooltip.Arrow className="fill-[var(--navy-900)]" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}

Tooltip.displayName = "Tooltip";
