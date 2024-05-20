import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Providers from "@/components/providers";
import type { TNextAuthSession } from "types";

import { Inter } from "next/font/google";
import { ThemeColorWrapper } from "@/components/theme-color-wrapper";
import { useThemeColor } from "@/hooks/use-theme-color";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// import localFont from "next/font/local";

// If loading a variable font, you don't need to specify the font weight

// const calSans = localFont({
//   src: "../../public/fonts/CalSans-SemiBold.woff2",
//   // weight: 600,
//   variable: "--font-CalSans",
// });

const MyApp: AppType<TNextAuthSession> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [themeColor] = useThemeColor();

  return (
    <ThemeColorWrapper defaultTheme={themeColor.colorName}>
      <Providers session={session}>
        <Component {...pageProps} />
      </Providers>
    </ThemeColorWrapper>
  );
};

export default api.withTRPC(MyApp);
