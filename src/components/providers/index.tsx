import React from "react";
import { Analytics } from "@vercel/analytics/react";
import NextNProgress from "nextjs-progressbar";

import ThemeProvider from "./theme-provider";
import ToastProvider from "./toast-provider";
import TailwindIndicator from "../tailwind-indicator";
import { SessionProvider } from "next-auth/react";
import type { TNextAuthSession } from "types";

interface ProvidersProps extends TNextAuthSession {
  children: React.ReactNode;
}

export default function Providers({ session, children }: ProvidersProps) {
  return (
    <>
      <SessionProvider session={session}>
        <ThemeProvider>
          <Analytics />
          <ToastProvider />
          {/* loader progress bar */}
          <NextNProgress color="#4740ea" height={4} />
          <TailwindIndicator />
          {children}
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}
