/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import { ProfileSettings } from "./profile";
import { useRouter } from "next/router";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsLayoutContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full px-2 sm:px-4 md:px-6", className)}>
      {children}
    </div>
  );
}

export function SettingsContentLayout({
  children,
  actions,
  title,
  description,
}: {
  children: React.ReactNode;
  actions: React.ReactNode;
  title: string;
  description: string;
}) {
  const { pathname } = useRouter();

  return (
    <Layout pageTitle="Settings">
      <div className="space-y-8">
        <div className="flex flex-col">
          <SettingsLayoutContainer className="w-full">
            <ul className="relative flex w-full border-b text-sm">
              {settingsPaths.map((path) => {
                const isActive = path.href === pathname;
                return (
                  <li
                    key={path.label}
                    className={`${isActive ? "border-b-2 border-primary" : ""}`}
                  >
                    <Link
                      href={path.href}
                      className={`${
                        isActive
                          ? "bg-accent/70 text-foreground"
                          : "text-muted-foreground"
                      } mb-2 block rounded-md px-3.5 py-2.5 hover:bg-accent/70`}
                    >
                      {path.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </SettingsLayoutContainer>
          {/* <SettingsLayoutContainer>
            <div className="flex w-full items-end justify-between py-8">
              <div className="space-y-0.5">
                <Typography as="h3" variant="xl/medium">
                  {title}
                </Typography>
                <Typography
                  as="p"
                  variant="sm/normal"
                  className="text-muted-foreground"
                >
                  {title}
                </Typography>
              </div>
              <div>
                {actions ?? <Button variant="default">Save Changes</Button>}
              </div>
            </div>
          </SettingsLayoutContainer> */}
        </div>
        <SettingsLayoutContainer>{children}</SettingsLayoutContainer>
      </div>
    </Layout>
  );
}

export function SettingsPageTabs() {
  return (
    <Tabs defaultValue="company" className="w-full px-0">
      <TabsList className="ml-auto grid h-12 w-full max-w-[15rem] grid-cols-2 rounded-b-none bg-gray-100 p-0 dark:bg-gray-800/50">
        <TabsTrigger
          value="company"
          className="data-[state=active]:border-b-brand-500 h-full rounded-none border-b-2 border-transparent font-semibold data-[state=active]:shadow-none"
        >
          Company
        </TabsTrigger>
        <TabsTrigger
          value="profile"
          className="data-[state=active]:border-b-brand-500 h-full rounded-none border-b-2 border-transparent font-semibold data-[state=active]:shadow-none"
        >
          Profile
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="">
        <ProfileSettings />
      </TabsContent>
    </Tabs>
  );
}

export const settingsPaths = [
  {
    label: "General",
    href: "/settings",
  },
  // { label: "Account", href: "/dashboard/settings/account" },
  {
    label: "Company",
    href: "/settings/company",
  },
  {
    label: "Appearance",
    href: "/settings/appearance",
  },
];

export default function SettingsIndexPage() {
  return (
    <SettingsContentLayout
      title="General Settings"
      description="dd"
      actions={
        <>
          <Button>Save Changes</Button>
        </>
      }
    >
      {/* record */}
      <div className="border-b py-6 text-sm lg:flex lg:items-start">
        <div className="space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
          <h3 className="text-foreground">
            Store name <span className="text-destructive">*</span>
          </h3>
          <p className="max-w-[420px] text-muted-foreground">
            Appears on receipts, invoices, and more{" "}
          </p>
        </div>
        <div className="lg:flex-grow">
          <Input
            id="input_name"
            type="text"
            className=""
            placeholder="store name"
          />
        </div>
      </div>

      {/* record */}
      <div className="border-b py-6 text-sm lg:flex lg:items-start">
        <div className="mb-1 space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
          <h3 className="text-foreground">
            Email <span className="text-destructive">*</span>
          </h3>
          <p className="max-w-[420px] text-muted-foreground">
            Contact email address
          </p>
        </div>
        <div className="lg:flex-grow">
          <Input
            id="input_name"
            type="text"
            className=""
            placeholder="store name"
          />
        </div>
      </div>
      {/* record */}
      <div className="border-b py-6 text-sm lg:flex lg:items-start">
        <div className="mb-1 space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
          <h3 className="text-foreground">
            Contact number <span className="text-destructive">*</span>
          </h3>
          <p className="max-w-[420px] text-muted-foreground">
            {/* description for contact number field */}
            Contact number for your store
          </p>
        </div>
        <div className="lg:flex-grow">
          <Input
            id="input_name"
            type="text"
            className=""
            placeholder="store name"
          />
        </div>
      </div>
      {/* record */}
      <div className="border-b py-6 text-sm lg:flex lg:items-start">
        <div className="mb-1 space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
          <h3 className="text-foreground">
            Address <span className="text-destructive">*</span>
          </h3>
          <p className="max-w-[420px] text-muted-foreground">
            {/* description for contact number field */}
            Address for your store
          </p>
        </div>
        <div className="flex gap-x-4 lg:flex-grow">
          <Input
            id="input_address"
            type="text"
            className=""
            placeholder="address"
          />

          <Input id="input_city" type="text" className="" placeholder="city" />
        </div>
      </div>
    </SettingsContentLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const company = userSession?.user?.company;

  return {
    props: {
      company: JSON.parse(JSON.stringify(company)),
    },
  };
};
