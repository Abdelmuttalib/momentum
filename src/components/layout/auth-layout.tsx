import type { ReactNode } from "react";
import { Typography } from "@/components/ui/typography";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[100svh] w-full grid-flow-row grid-cols-1 grid-rows-6 bg-background lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-1 lg:px-0">
      <div className="relative h-full">
        <div className="flex h-full w-full flex-col bg-foreground text-primary-foreground dark:bg-background">
          <div className="flex rounded-md p-4 py-3">
            <Typography
              as="h2"
              variant="5xl/semibold"
              className="bg-gradient-to-br from-primary-foreground to-foreground bg-clip-text tracking-tight text-transparent dark:bg-gradient-to-tl"
            >
              Momentum
            </Typography>
          </div>
        </div>
      </div>

      <div className="relative row-span-5 flex h-full w-full items-center justify-center rounded-t-lg bg-popover lg:col-span-2 lg:row-span-1 lg:rounded-l-lg lg:rounded-tr-none">
        {children}
      </div>
    </div>
  );
}
