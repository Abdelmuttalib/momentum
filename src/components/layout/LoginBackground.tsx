import type { FC, ReactNode } from "react";
import ThemeToggle from "../theme-toggle";

const LoginBackground: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="grid min-h-[100svh] w-full grid-flow-row grid-cols-1 grid-rows-6 bg-gray-900 lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-1 lg:px-0">
      <div className="relative h-full">
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900 text-center text-primary-foreground">
          <div className="flex ">
            <h1 className="h3 sm:h2 sm:h1 xl:display-sm to-primary-900 bg-gradient-to-br from-primary-foreground bg-clip-text text-transparent dark:bg-gradient-to-br dark:from-brand-100 dark:to-gray-800 dark:bg-clip-text dark:text-transparent lg:tracking-tighter ">
              {/* dark:bg-gradient-to-br dark:from-brand-200 dark:via-brand-400 dark:to-brand-700 dark:bg-clip-text dark:text-transparent */}
              Momentum
            </h1>
          </div>
        </div>
      </div>

      <div className="relative row-span-5 flex h-full w-full items-center justify-center rounded-t-lg bg-white dark:bg-gray-800/10 lg:col-span-2 lg:row-span-1 lg:rounded-l-lg lg:rounded-tr-none">
        <ThemeToggle className="absolute right-3 top-3" />
        {children}
      </div>
    </div>
  );
};

export default LoginBackground;
