import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/cn";
import { localePath, requireAuthPage } from "@/server/auth-guard";
import { resolveLocale } from "@/i18n/config";
import { type GetServerSideProps } from "next";
import { AppLayout } from "@/components/layout/app-layout";
import { CompactPageHeader } from "@/components/common/page-header";
import { Heading } from "@/components/typography";
import { useTranslations } from "next-intl";

export const settingsPaths = [
  {
    key: "profile",
    href: "/settings/profile",
  },
  {
    key: "company",
    href: "/settings/company",
  },
  {
    key: "appearance",
    href: "/settings/appearance",
  },
];

export function SettingsContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useRouter();
  const t = useTranslations("settings");

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <CompactPageHeader
          title={t("title")}
          description={t("description")}
        />
        <div className="flex flex-col gap-6 lg:flex-row">
          <nav
            aria-label={t("title")}
            className="flex shrink-0 gap-1 overflow-x-auto lg:w-52 lg:flex-col"
          >
            {settingsPaths.map((path) => {
              const isActive = path.href === pathname;
              return (
                <Link
                  key={path.key}
                  href={path.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {t(path.key)}
                </Link>
              );
            })}
          </nav>
          <div className="min-w-0 flex-1">
            <div className="max-w-2xl">{children}</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export function SettingsSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <Heading level="section">{children}</Heading>
    </div>
  );
}

export default function SettingsIndexPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = requireAuthPage(
  {},
  (ctx) =>
    Promise.resolve({
      redirect: {
        destination: localePath(
          resolveLocale(ctx.locale),
          "/settings/profile"
        ),
        permanent: false,
      },
    })
);
