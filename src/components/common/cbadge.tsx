import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const cBadgeVariants = cva(
  "inline-flex items-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none",
  {
    variants: {
      // variant: {
      //   default: 'border-transparent bg-primary/15 text-primary hover:bg-primary/80 hover:text-primary-foreground',
      //   secondary: 'border-transparent bg-secondary/15 text-secondary-foreground hover:bg-secondary/80',
      //   destructive:
      //     'border-transparent bg-destructive/5 text-destructive hover:bg-destructive/80 hover:text-destructive-foreground',
      //   outline: 'text-foreground',
      // primary: 'text-primary',
      // secondary: 'text-secondary',
      // destructive: 'text-destructive',
      // muted: 'text-muted',
      // accent: 'text-accent',
      // neutral: 'text-neutral',
      // info: 'text-info',
      // success: 'text-success',
      // warning: 'text-warning',
      // error: 'text-error',
      // },

      //       const priorityClass = (priority: Task["priority"]) => {
      //   switch (priority) {
      //     case "LOW":
      //       return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

      //     case "MEDIUM":
      //       return "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";

      //     case "HIGH":
      //       return "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400";

      //     default:
      //       return "";
      //   }
      // };

      color: {
        blue: `bg-blue-100 text-blue-800 ring-1 ring-blue-600/20 ring-inset dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30`,
        indigo: `bg-indigo-100 text-indigo-800 ring-1 ring-indigo-600/20 ring-inset dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/30`,
        purple: `bg-purple-100 text-purple-800 ring-1 ring-purple-600/20 ring-inset dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-400/30`,
        violet: `bg-violet-100 text-violet-800 ring-1 ring-violet-600/20 ring-inset dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/30`,
        fuchsia: `bg-fuchsia-100 text-fuchsia-800 ring-1 ring-fuchsia-600/20 ring-inset dark:bg-fuchsia-500/10 dark:text-fuchsia-300 dark:ring-fuchsia-400/30`,
        pink: `bg-pink-100 text-pink-800 ring-1 ring-pink-600/20 ring-inset dark:bg-pink-500/10 dark:text-pink-300 dark:ring-pink-400/30`,
        rose: `bg-rose-100 text-rose-800 ring-1 ring-rose-600/20 ring-inset dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/30`,
        red: `bg-red-100 text-red-800 ring-1 ring-red-600/20 ring-inset dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/30`,
        orange: `bg-orange-100 text-orange-800 ring-1 ring-orange-600/20 ring-inset dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-400/30`,
        amber: `bg-amber-100 text-amber-800 ring-1 ring-amber-600/20 ring-inset dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/30`,
        yellow: `bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20 ring-inset dark:bg-yellow-500/10 dark:text-yellow-300 dark:ring-yellow-400/30`,
        lime: `bg-lime-100 text-lime-800 ring-1 ring-lime-600/20 ring-inset dark:bg-lime-500/10 dark:text-lime-300 dark:ring-lime-400/30`,
        green: `bg-green-100 text-green-800 ring-1 ring-green-600/20 ring-inset dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/30`,
        emerald: `bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20 ring-inset dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/30`,
        teal: `bg-teal-100 text-teal-800 ring-1 ring-teal-600/20 ring-inset dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-400/30`,
        cyan: `bg-cyan-100 text-cyan-800 ring-1 ring-cyan-600/20 ring-inset dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-400/30`,
        sky: `bg-sky-100 text-sky-800 ring-1 ring-sky-600/20 ring-inset dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/30`,
        gray: `bg-gray-100 text-gray-700 ring-1 ring-gray-500/20 ring-inset dark:bg-gray-500/10 dark:text-gray-300 dark:ring-gray-400/30`,
        zinc: `bg-zinc-100 text-zinc-800 ring-1 ring-zinc-600/20 ring-inset dark:bg-zinc-500/10 dark:text-zinc-300 dark:ring-zinc-400/30`,
        neutral: `bg-neutral-100 text-neutral-800 ring-1 ring-neutral-600/20 ring-inset dark:bg-neutral-500/10 dark:text-neutral-300 dark:ring-neutral-400/30`,
        stone: `bg-stone-100 text-stone-800 ring-1 ring-stone-600/20 ring-inset dark:bg-stone-500/10 dark:text-stone-300 dark:ring-stone-400/30`,
        slate: `bg-slate-100 text-slate-800 ring-1 ring-slate-600/20 ring-inset dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/30`,
      },

      size: {
        default: "text-sm px-3 py-1",
        sm: "text-xs px-2 py-0.5",
        lg: "sm:text-base px-4 py-2",
      },
    },
    defaultVariants: {
      // variant: 'default',
      color: "blue",
      size: "default",
    },
  }
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface CBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cBadgeVariants> {
  color?:
    | "blue"
    | "indigo"
    | "purple"
    | "violet"
    | "fuchsia"
    | "pink"
    | "rose"
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky"
    | "gray"
    | "zinc"
    | "neutral"
    | "stone"
    | "slate";
}

function CBadge({
  className,
  color = "gray",
  size = "default",
  ...props
}: CBadgeProps) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
    <span
      className={cn(
        "rounded-full px-4",
        cBadgeVariants({ color, size }),
        className
      )}
      {...props}
    />
  );
}

export { CBadge, cBadgeVariants };
