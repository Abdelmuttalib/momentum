import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { getServerAuthSession } from "@/server/auth";
import { getMessagesProps } from "@/lib/i18n";
import {
  defaultLocale,
  resolveLocale,
  type Locale,
} from "@/i18n/config";

/** Locale URL prefix: "" for default, "/ar" etc. otherwise. */
function localePrefix(locale: Locale | undefined) {
  return locale && locale !== defaultLocale ? `/${locale}` : "";
}

/** Prefixes an absolute path with the locale unless it is the default. */
export function localePath(locale: Locale | undefined, path: string) {
  return `${localePrefix(locale)}${path}`;
}

export { isSafeReturnTo, safeReturnTo } from "@/lib/return-to";

type RequireAuthPageOptions = {
  /** When true, non-ADMIN users are redirected to /overview. */
  admin?: boolean;
};

type GsspContext = Pick<
  GetServerSidePropsContext,
  "req" | "res" | "query" | "resolvedUrl" | "params" | "locale"
>;

/**
 * Inverse guard for public-only pages (sign-in, registration): authenticated
 * users are sent to `destination` (default /overview) instead.
 */
export function requireAnonymousPage(
  destination = "/overview"
): GetServerSideProps {
  return async (ctx) => {
    const session = await getServerAuthSession(ctx);
    if (session?.user) {
      return {
        redirect: {
          destination: localePath(resolveLocale(ctx.locale), destination),
          permanent: false,
        },
      };
    }
    return { props: { ...getMessagesProps(ctx.locale) } };
  };
}

/**
 * Reusable Pages-Router guard for functional pages.
 *
 * - Unauthenticated -> /sign-in?returnTo=<current path> (safe, relative only)
 * - ADMIN-only pages (options.admin) redirect non-admins to /overview
 * - Returns `{ props: { session } }` so pages keep working with
 *   `api.withTRPC` / `SessionProvider`.
 *
 * Wrap per-page data loading around it instead of duplicating
 * `if (!user) redirect("/login")` in every page.
 */
export function requireAuthPage(
  options: RequireAuthPageOptions = {},
  getRestProps?: (
    ctx: GsspContext,
    session: Session
  ) => Promise<
    | Record<string, unknown>
    | { notFound: true }
    | { redirect: { destination: string; permanent: boolean } }
  >
): GetServerSideProps {
  return async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (!session?.user) {
      const locale = resolveLocale(ctx.locale);
      // resolvedUrl excludes the locale prefix; re-attach it so the
      // post-login return lands on the same localized page.
      const rawReturnTo =
        ctx.resolvedUrl && ctx.resolvedUrl !== "/sign-in"
          ? ctx.resolvedUrl
          : "/overview";
      const returnTo = localePath(locale, rawReturnTo);
      return {
        redirect: {
          destination: `${localePath(locale, "/sign-in")}?returnTo=${encodeURIComponent(returnTo)}`,
          permanent: false,
        },
      };
    }

    if (options.admin && session.user.role !== "ADMIN") {
      return {
        redirect: {
          destination: localePath(resolveLocale(ctx.locale), "/overview"),
          permanent: false,
        },
      };
    }

    const rest = getRestProps ? await getRestProps(ctx, session) : {};

    if ("notFound" in rest && rest.notFound === true) {
      return { notFound: true };
    }
    if ("redirect" in rest && rest.redirect !== undefined) {
      return {
        redirect: rest.redirect as {
          destination: string;
          permanent: boolean;
        },
      };
    }

    return {
      props: {
        session: JSON.parse(JSON.stringify(session)) as unknown,
        ...getMessagesProps(ctx.locale),
        ...rest,
      },
    };
  };
}
