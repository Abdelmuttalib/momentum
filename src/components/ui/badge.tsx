import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export type BadgeColor =
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "gray"
  | "white"
  | "dark-gray";

const Badge = ({
  color,
  children,
  className,
}: {
  color: BadgeColor;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium",
        {
          "border-green-600/10 bg-green-100/80 text-green-800 dark:opacity-80":
            color === "green",
          "border-yellow-600/10 bg-yellow-100/80 text-yellow-800 dark:opacity-90":
            color === "yellow",
          "border-red-600/10 bg-red-100/80 text-red-700 dark:opacity-90":
            color === "red",
          "border-primary-blue-600/10 bg-primary-blue-100/50 text-primary-blue-600 dark:bg-primary-blue-100 dark:opacity-70":
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
