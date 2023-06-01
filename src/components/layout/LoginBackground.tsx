import Image from "next/image";
import type { FC, ReactNode } from "react";

const LoginBackground: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="grid min-h-[100svh] w-full grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden h-full bg-gray-900 lg:block">
        {/* <Image
          src='https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
          alt='construction site'
          layout='fill'
          objectFit='cover'
          className='blur-3xl'
        /> */}
        <div className="flex h-full w-full flex-col items-center justify-center text-center">
          <Image
            src="/images/invix-logo.png"
            alt="invix logo"
            width="300"
            height="300"
            className="opacity-70"
          />
          {/* <div className='flex'>
            <h1 className='h2  bg-gradient-to-br from-primary to-primary-900 bg-clip-text text-transparent'>
              InSpect 2.0
            </h1>
            <p className='h2 bg-gradient-to-br from-gray-800 to-primary-800 bg-clip-text text-transparent'></p>
          </div> */}
        </div>
        {/* <div className='h-full w-full bg-gray-900'></div>
        <div className='absolute inset-0 h-full w-full bg-red-300'>
          <div className='mx-auto max-w-5xl py-32 sm:py-48 lg:py-56'>
            <div className='text-center'>
              <h1 className='h2 sm:display-sm lg:display-lg bg-gradient-to-br from-primary-400 to-primary-800 bg-clip-text text-transparent'>
                InSpect
              </h1>
              <p className='h2 bg-gradient-to-br from-gray-800 to-primary-800 bg-clip-text text-transparent'>
                2.0
              </p>
            </div>
          </div>
        </div> */}
      </div>

      <div className="flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default LoginBackground;
