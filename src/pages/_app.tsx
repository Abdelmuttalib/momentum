import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Providers from "@/components/providers";
import type { TNextAuthSession } from "types";

const MyApp: AppType<TNextAuthSession> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <Providers session={session}>
      <div className="bg-[#fefffe] text-gray-800 dark:bg-gray-900">
        <Component {...pageProps} />
      </div>
    </Providers>
  );
};

export default api.withTRPC(MyApp);
