import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

export type BadgeColor =
  | "primary"
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "gray"
  | "white"
  | "dark-gray";

const badgeVariants = cva(
  "relative inline-flex items-center justify-center w-full text-sm sm:w-auto rounded font-medium border-0 transition-colors transition duration-150 ease-linear focus:outline-transparent disabled:opacity-50 disabled:pointer-events-none disabled:opacity-60 disabled:hover:opacity-60 disabled:cursor-not-allowed disabled:shadow-none ring-1 ring-transparent ring-inset focus:ring-2 focus:ring-inset outline-none focus:outline-none",
  {
    variants: {
      variant: {
        primary:
          "text-white bg-primary shadow-sm hover:bg-primary-600 focus:ring-primary-200 dark:focus:ring-primary-600 active:bg-primary focus:bg-primary",
        "primary-outline":
          "text-primary bg-background ring-primary-400 hover:bg-primary-100/40 dark:hover:bg-layer-3 focus:ring-primary",
        outline:
          "text-foreground bg-background ring-border hover:bg-layer-2 focus:ring-primary",
        secondary:
          "text-primary-800 dark:text-gray-200 bg-primary-100/50 hover:bg-primary-100/70 focus:bg-primary-100/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/60 dark:ring-gray-700  dark:focus:bg-gray-800/70",
        destructive:
          "bg-error text-white hover:bg-red-600 dark:hover:bg-red-600",
        "destructive-outline":
          "ring-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:ring-red-200 focus:text-white dark:text-red-400 dark:ring-red-400 dark:hover:ring-red-500 dark:hover:bg-error dark:hover:text-white dark:focus:bg-red-500 dark:focus:ring-red-400 dark:focus:text-white",
        dark: "bg-gray-900 text-white duration-150 ease-linear hover:bg-gray-900/90 active:bg-gray-700 disabled:bg-gray-700 focus:ring-primary-300",
        ghost:
          "hover:bg-gray-hover dark:hover:bg-layer-2 text-foreground-light",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2.5",
        xs: "px-2.5 py-1",
        sm: "px-3 py-1.5",
        lg: "px-5 py-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

const Badge = ({
  color = "primary",
  children,
  className,
}: {
  color?: BadgeColor;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium",
        {
          "border-primary-600/10 bg-primary-200/70 text-primary-900 dark:opacity-80":
            color === "primary",
          "border-green-600/10 bg-green-100/80 text-green-800 dark:opacity-80":
            color === "green",
          "border-yellow-600/10 bg-yellow-100/80 text-yellow-800 dark:opacity-90":
            color === "yellow",
          "border-red-600/10 bg-red-100/80 text-red-700 dark:opacity-90":
            color === "red",
          "border-blue-600/10 bg-blue-100/50 text-blue-600 dark:bg-blue-100 dark:opacity-70":
            color === "blue",
          "border-gray-600/10 bg-gray-200/70 text-gray-700": color === "gray",
          "border-gray-500/10 bg-white text-gray-800": color === "white",
          "border-gray-600/10 bg-gray-200/70 text-gray-500/80 dark:text-gray-600":
            color === "dark-gray",
        },
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;

// export function BadgesExamples() {
//   return (
//     <div className="flex flex-col">
//       <div className="flex">
//         <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
//           Badge
//         </span>
//         <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
//           Badge
//         </span>
//         <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
//           Badge
//         </span>
//         <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
//           Badge
//         </span>
//         <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
//           Badge
//         </span>
//         <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
//           Badge
//         </span>
//         <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
//           Badge
//         </span>
//         <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
//           Badge
//         </span>
//       </div>
//       <div className="flex">
//         <Badge color="green">Badge</Badge>
//         <Badge color="yellow">Badge</Badge>
//         <Badge color="red">Badge</Badge>
//         <Badge color="blue">Badge</Badge>
//         <Badge color="gray">Badge</Badge>
//         <Badge color="white">Badge</Badge>
//         <Badge color="dark-gray">Badge</Badge>
//       </div>
//     </div>
//   );
// }
