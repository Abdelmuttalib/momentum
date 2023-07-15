import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { Toaster } from "sonner";
import TailwindIndicator from "@/components/tailwind-indicator";
import GradientBackground from "@/components/GradientBackground";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster
        position="top-right"
        richColors
        expand
        visibleToasts={6}
        closeButton
        style={{
          marginRight: "1.5rem",
        }}
      />
      <GradientBackground />
      <Component {...pageProps} />
      <TailwindIndicator />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
