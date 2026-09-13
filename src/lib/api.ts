/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { httpBatchLink, loggerLink, TRPCClientError } from "@trpc/client";
import type { TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "@/server/api/root";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/**
 * Sends expired sessions to /sign-in with a safe returnTo instead of
 * surfacing raw UNAUTHORIZED tRPC errors. Guarded against redirect loops
 * (auth pages excluded, single-flight flag) — server pages already redirect
 * via getServerSideProps; this covers client-side session expiry.
 */
const expiredSessionLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          const code =
            err instanceof TRPCClientError
              ? (err as unknown as { data?: { code?: string } }).data?.code
              : undefined;
          if (
            typeof window !== "undefined" &&
            code === "UNAUTHORIZED" &&
            !window.location.pathname.startsWith("/sign-in") &&
            !window.location.pathname.startsWith("/register") &&
            !(window as unknown as { __sessionRedirecting?: boolean })
              .__sessionRedirecting
          ) {
            (window as unknown as { __sessionRedirecting?: boolean })
              .__sessionRedirecting = true;
            const returnTo =
              window.location.pathname + window.location.search;
            window.location.href = `/sign-in?returnTo=${encodeURIComponent(
              returnTo
            )}`;
          }
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        expiredSessionLink,
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
