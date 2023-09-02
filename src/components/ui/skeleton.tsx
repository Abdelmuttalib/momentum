import { cn } from "@/utils/cn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse cursor-wait rounded-md bg-gray-200 dark:bg-gray-800",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
