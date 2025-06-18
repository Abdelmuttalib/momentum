import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Providers from "@/components/providers";
import type { TNextAuthSession } from "types";

import { ThemeColorWrapper } from "@/components/theme-color-wrapper";

const MyApp: AppType<TNextAuthSession> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeColorWrapper>
      <Providers session={session}>
        <Component {...pageProps} />
      </Providers>
    </ThemeColorWrapper>
  );
};

export default api.withTRPC(MyApp);
