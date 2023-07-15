import type { FC, ReactNode } from "react";

const LoginBackground: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="grid min-h-[100svh] w-full grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden h-full lg:block">
        <div className="flex h-full w-full flex-col items-center justify-center bg-black text-center text-primary-foreground">
          <div className="flex">
            <h1 className="h1 to-primary-900 bg-gradient-to-br from-primary-foreground bg-clip-text text-transparent">
              Momentum 2.0
            </h1>
          </div>
        </div>
      </div>

      <div className="flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default LoginBackground;
