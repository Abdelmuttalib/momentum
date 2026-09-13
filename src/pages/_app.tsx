import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";

import { api } from "@/lib/api";

import "@/styles/globals.css";
import Providers from "@/components/providers";
import type { TNextAuthSession } from "types";

import { ThemeColorWrapper } from "@/components/theme-color-wrapper";
import { DirectionEffect } from "@/components/direction-effect";
import { resolveLocale } from "@/i18n/config";

const MyApp: AppType<
  TNextAuthSession & { messages?: AbstractIntlMessages }
> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const { locale } = useRouter();
  return (
    <ThemeColorWrapper>
      <NextIntlClientProvider
        locale={resolveLocale(locale)}
        messages={pageProps.messages}
      >
        <DirectionEffect />
        <Providers session={session}>
          <Component {...pageProps} />
        </Providers>
      </NextIntlClientProvider>
    </ThemeColorWrapper>
  );
};

export default api.withTRPC(MyApp);
