// @refresh reset
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: "default" | "line";
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        "group/tabs-list inline-flex w-fit items-center justify-center",
        variant === "default" &&
          "bg-muted text-muted-foreground h-9 rounded-xl p-[3px] flex",
        variant === "line" &&
          "bg-transparent h-9 gap-1 rounded-none p-0",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base layout
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all",
        // Focus
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-50",
        // SVG
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Default variant — colors & active state
        "text-foreground dark:text-muted-foreground",
        "data-[state=active]:bg-card dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30",
        // Underline indicator (hidden by default, revealed in line variant)
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity",
        "after:bottom-[-5px] after:inset-x-0 after:h-0.5",
        // Line variant — overrides via parent group data attribute
        "group-data-[variant=line]/tabs-list:rounded-md group-data-[variant=line]/tabs-list:px-4",
        "group-data-[variant=line]/tabs-list:bg-transparent",
        "group-data-[variant=line]/tabs-list:text-foreground/60",
        "group-data-[variant=line]/tabs-list:hover:text-foreground",
        "group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        "group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none",
        "group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent",
        "group-data-[variant=line]/tabs-list:data-[state=active]:text-foreground",
        "group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };