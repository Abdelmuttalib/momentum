// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    domains: ["pvpgmjnmehreieyinspc.supabase.co", "avatar.vercel.sh"],
  },

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */

  // react: {
  //   useSuspense: false,
  // },
};
export default nextConfig;
