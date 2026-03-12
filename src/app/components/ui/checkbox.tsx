"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base styles with improved border visibility
        "peer size-4 shrink-0 rounded-[4px] border-2 transition-all outline-none",
        
        // Unchecked state - visible border
        "border-input/60 bg-background dark:border-input/40 dark:bg-card",
        
        // Hover state
        "hover:border-primary/60 hover:bg-accent dark:hover:border-primary/50",
        
        // Checked state - primary color with good contrast
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        "data-[state=checked]:text-primary-foreground",
        "dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary",
        
        // Focus state
        "focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/50",
        
        // Invalid state
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        
        // Shadow for depth
        "shadow-sm",
        
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };