import { cn } from "@/utils/cn";

type LayoutContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function LayoutContainer({ children, className }: LayoutContainerProps) {
  return (
    <div className={cn("px-2 sm:px-4 md:px-6", className)}>{children}</div>
  );
}

// div props
type PageContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "xl" | "full" | "sm" | "xs";
};

export function PageContainer({
  size = "default",
  children,
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8",
        {
          "max-w-screen-2xl": size === "xl",
          "max-w-full": size === "full",
          "max-w-4xl": size === "sm",
          "max-w-2xl": size === "xs",
        },
        className
      )}
    >
      {/* <div className="absolute -left-10 h-full w-6 border-x bg-[image:repeating-linear-gradient(315deg,oklch(var(--border))_0,_oklch(var(--border))_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed sm:block md:w-8 lg:w-12" /> */}
      {children}
      {/* <div className="absolute -right-10 hidden h-full w-6 border-x bg-[image:repeating-linear-gradient(315deg,oklch(var(--border))_0,_oklch(var(--border))_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed sm:block md:w-8 lg:w-12" /> */}
    </div>
  );
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "xl" | "full" | "sm" | "xs";
}

export function DashboardPageContainer({
  size = "default",
  className,
  children,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "relative w-full flex-1 px-4 py-4 sm:px-6",
        // {
        //   "max-w-screen-2xl": size === "xl",
        //   "max-w-full": size === "full",
        //   "max-w-4xl": size === "sm",
        //   "max-w-2xl": size === "xs",
        // },
        className
      )}
    >
      {children}
    </div>
  );
}
