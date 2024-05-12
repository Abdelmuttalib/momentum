import type { ReactNode } from "react";
import { Typography } from "../ui/typography";
import GradientBackground from "../GradientBackground";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[100svh] w-full grid-flow-row grid-cols-1 grid-rows-6 bg-background lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-1 lg:px-0">
      <div className="relative h-full">
        <div className="text-primary-foreground flex h-full w-full flex-col items-center justify-center bg-foreground text-center dark:bg-background">
          <div className="flex rounded bg-primary-200 p-4 py-3">
            {/* <h1 className="h3 sm:h2 sm:h1 xl:display-sm from-primary-foreground dark:from-brand-100 bg-gradient-to-br to-primary-900 bg-clip-text text-transparent dark:bg-gradient-to-br dark:to-gray-800 dark:bg-clip-text dark:text-transparent lg:tracking-tighter ">
              Momentum
            </h1> */}
            <Typography
              as="h2"
              variant="display-lg/semibold"
              className="bg-gradient-to-br from-foreground to-primary-900 bg-clip-text text-transparent dark:from-background dark:to-primary-800 lg:tracking-tighter"
            >
              Momentum
            </Typography>
          </div>
        </div>
      </div>

      <div className="relative row-span-5 flex h-full w-full items-center justify-center rounded-t-lg bg-layer lg:col-span-2 lg:row-span-1 lg:rounded-l-lg lg:rounded-tr-none">
        <GradientBackground />
        {children}
      </div>
    </div>
  );
}
