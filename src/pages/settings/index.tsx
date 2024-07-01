/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout";
import Container from "@/components/@pages/landing-page/container";
import { useForm } from "react-hook-form";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import { api } from "@/utils/api";
import { z } from "zod";
import { toast } from "sonner";
import { formatFullDate } from "@/utils/date";
import { companyInvitationsColumns } from "@/components/@pages/company/invites/company-invitations-columns";
import { DataTable } from "@/components/@pages/teams/TeamMembers/data-table";
import NewInvite from "@/components/@pages/company/NewInvite";
import { teamMembersColumns } from "@/components/@pages/teams/TeamMembers/team-members";
import { ProfileSettings } from "./profile";
import { companyTeamsColumns } from "@/components/@pages/company/organization-teams";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { FormLabel } from "@/components/ui/form-label";
import { Typography } from "@/components/ui/typography";
import { useRouter } from "next/router";
import Link from "next/link";
import { cn } from "@/utils/cn";

export function SettingsLayoutContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-2 sm:px-4 md:px-6 w-full max-w-3xl mx-auto", className)}>{children}</div>
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
      <div>
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
                        isActive ? "text-foreground" : "text-foreground-lighter"
                      } mb-2 block rounded-md px-3.5 py-2.5 hover:bg-accent-hover/70`}
                    >
                      {path.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </SettingsLayoutContainer>
          <SettingsLayoutContainer>
            <div className="flex w-full items-end justify-between py-8">
              <div className="space-y-0.5">
                <Typography as="h3" variant="xl/medium">
                  {title}
                </Typography>
                <Typography
                  as="p"
                  variant="sm/regular"
                  className="text-foreground-lighter"
                >
                  {title}
                </Typography>
              </div>
              <div>
                {actions ?? <Button variant="primary">Save Changes</Button>}
              </div>
            </div>
          </SettingsLayoutContainer>
        </div>
        {/* <Container>{children}</Container> */}
        <SettingsLayoutContainer className="">{children}</SettingsLayoutContainer>
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

      <TabsContent value="company" className="">
        <CompanySettings />
      </TabsContent>
      <TabsContent value="profile" className="">
        <ProfileSettings />
      </TabsContent>
    </Tabs>
  );
}

const companyInfoFormSchema = z.object({
  name: z.string(),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoFormSchema>;

export const settingsPaths = [
  {
    label: "General",
    href: "/settings/general",
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

export default function SettingsPage() {
  const { pathname } = useRouter();

  return (
    <Layout pageTitle="Settings">
      {/* <Container> */}
      <div className="h-full w-full bg-red-300">
        <div className="w-full">
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
                      isActive ? "text-foreground" : "text-foreground-lighter"
                    } mb-2 block rounded-md px-3.5 py-2.5 hover:bg-accent-hover/70`}
                  >
                    {path.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <CompanySettings />
      <ProfileSettings />
      {/* </Container> */}
    </Layout>
  );
}

export function CompanySettings() {
  const { data: session } = useSession();
  const companyId = session?.user?.company?.id;
  const { data: companyData, isLoading: isLoadingCompanyData } =
    api.company.getCompany.useQuery();

  const {
    data: invitationsData,
    // isLoading: isLoadingInvitations
  } = api.company.getAllInvitations.useQuery();

  const {
    data: companyMembersData,
    // isLoading: isLoadingCompanyMembers
  } = api.company.getCompanyMembers.useQuery();
  const {
    data: companyTeams,
    // isLoading
  } = api.team.getAllTeamsByCompanyId.useQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyInfoFormValues>();

  const apiContext = api.useContext();

  const updateCompanyNameMutation = api.company.updateCompanyName.useMutation({
    onSuccess: async () => {
      await apiContext.company.getCompany.invalidate();
      toast.success("Company name updated successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  async function onSubmit(data: CompanyInfoFormValues) {
    const { name } = data;

    await updateCompanyNameMutation.mutateAsync({
      companyId: (companyData?.id as string) || (companyId as string),
      name,
    });
  }

  return (
    <>
      {/* <form>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-foreground">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-foreground-light">
              This information will be displayed publicly so be careful what you
              share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <FormLabel htmlFor="about">About</FormLabel>
                <div>
                  <Textarea id="about" name="about" rows={3}></Textarea>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground-light">
                  Write a few sentences about yourself.
                </p>
              </div>

              <div className="col-span-full">
                <FormLabel htmlFor="photo">Photo</FormLabel>
                <div className="mt-2 flex items-center gap-x-3">
                  <svg
                    className="h-12 w-12 text-gray-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <Button type="button" variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>

              <div className="col-span-full">
                <FormLabel htmlFor="cover-photo">Cover photo</FormLabel>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm leading-6 text-foreground-light">
                      <FormLabel
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <Input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </FormLabel>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-foreground-light">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-foreground">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-foreground-light">
              Use a permanent address where you can receive mail.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <FormLabel htmlFor="first-name">First name</FormLabel>
                <Input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                />
              </div>

              <div className="sm:col-span-3">
                <FormLabel htmlFor="last-name">Last name</FormLabel>
                <Input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                />
              </div>

              <div className="sm:col-span-4">
                <FormLabel htmlFor="email">Email address</FormLabel>
                <div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <FormLabel htmlFor="country">Country</FormLabel>
                <div>
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    className={cn(
                      "block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6",
                      inputVariants({
                        variant: "default",
                      })
                    )}
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
              </div>

              <div className="col-span-full">
                <FormLabel htmlFor="street-address">Street address</FormLabel>
                <div>
                  <Input
                    type="text"
                    name="street-address"
                    id="street-address"
                    autoComplete="street-address"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <FormLabel htmlFor="city">City</FormLabel>
                <div>
                  <Input
                    type="text"
                    name="city"
                    id="city"
                    autoComplete="address-level2"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <FormLabel htmlFor="region">State / Province</FormLabel>
                <div>
                  <Input
                    type="text"
                    name="region"
                    id="region"
                    autoComplete="address-level1"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <FormLabel htmlFor="postal-code">ZIP / Postal code</FormLabel>
                <div>
                  <Input
                    type="text"
                    name="postal-code"
                    id="postal-code"
                    autoComplete="postal-code"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-foreground">
              Notifications
            </h2>
            <p className="mt-1 text-sm leading-6 text-foreground-light">
              We&apos;ll always let you know about important changes, but you
              pick what else you want to hear about.
            </p>

            <div className="mt-10 space-y-10">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-foreground">
                  By Email
                </legend>
                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="comments"
                        name="comments"
                        type="checkbox"
                        className="dark:bg-ring-layer-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <FormLabel
                        htmlFor="comments"
                        className="font-medium text-foreground"
                      >
                        Comments
                      </FormLabel>
                      <p className="">
                        Get notified when someones posts a comment on a posting.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="candidates"
                        name="candidates"
                        type="checkbox"
                        className="dark:bg-ring-layer-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <FormLabel
                        htmlFor="candidates"
                        className="font-medium text-foreground"
                      >
                        Candidates
                      </FormLabel>
                      <p className="">
                        Get notified when a candidate applies htmlFor a job.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="offers"
                        name="offers"
                        type="checkbox"
                        className="dark:bg-ring-layer-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <FormLabel
                        htmlFor="offers"
                        className="font-medium text-foreground"
                      >
                        Offers
                      </FormLabel>
                      <p className="">
                        Get notified when a candidate accepts or rejects an
                        offer.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-foreground">
                  Push Notifications
                </legend>
                <p className="mt-1 text-sm leading-6 text-foreground-light">
                  These are delivered via SMS to your mobile phone.
                </p>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-everything"
                      name="push-notifications"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <FormLabel htmlFor="push-everything">Everything</FormLabel>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-email"
                      name="push-notifications"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <FormLabel htmlFor="push-email">Same as email</FormLabel>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-nothing"
                      name="push-notifications"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <FormLabel htmlFor="push-nothing">
                      No push notifications
                    </FormLabel>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form> */}
      <div className="flex flex-col gap-7 rounded-lg py-7">
        <div className="w-full">
          <Typography as="p" variant="lg/medium">
            Company Settings
          </Typography>
        </div>
        <div className="flex flex-col gap-7 divide-y-2">
          <div className="w-full">
            <div className="flex flex-col gap-2 pb-8">
              <div className="py-2">
                <form
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-5 divide-y-2"
                >
                  <div className="flex w-fit items-end gap-3 space-y-4">
                    <div className="relative">
                      <FormLabel htmlFor="companyName">Company Name</FormLabel>
                      <Input
                        id="companyName"
                        inputMode="text"
                        type="text"
                        placeholder="company"
                        {...register("name", {
                          required: true,
                        })}
                        defaultValue={companyData?.name}
                        disabled={
                          isLoadingCompanyData ||
                          updateCompanyNameMutation.isLoading
                        }
                        error={errors?.name}
                      />
                      {companyData?.createdAt && (
                        <Typography
                          variant="xs/regular"
                          className="absolute -bottom-5"
                        >
                          Date Created: {formatFullDate(companyData.createdAt)}
                        </Typography>
                      )}
                    </div>
                    <Button
                      type="submit"
                      isLoading={updateCompanyNameMutation.isLoading}
                      disabled={
                        isLoadingCompanyData ||
                        updateCompanyNameMutation.isLoading
                      }
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* company members */}
          <div className="w-full pt-6">
            <div className="flex flex-col gap-6 pb-8">
              <div className="flex items-center justify-between">
                <h2 className="FormLabel-md">Company Teams</h2>
              </div>
              <div className="">
                {companyTeams && (
                  <DataTable
                    columns={companyTeamsColumns}
                    data={companyTeams}
                  />
                )}
              </div>
            </div>
          </div>

          {/* company members */}
          <div className="w-full pt-6">
            <div className="flex flex-col gap-6 pb-8">
              <div className="flex items-center justify-between">
                <h2 className="FormLabel-md">Company Members</h2>
              </div>
              <div className="">
                {companyMembersData && (
                  <DataTable
                    columns={teamMembersColumns}
                    data={companyMembersData}
                  />
                )}
              </div>
            </div>
          </div>
          {/* company invites */}
          <div className="w-full pt-6">
            <div className="flex flex-col gap-2 pb-8">
              <div className="flex items-center justify-between">
                <h2 className="FormLabel-md">Company Invitations</h2>
                <NewInvite
                  triggerButton={
                    <Button
                      className="ml-2 inline-flex gap-1 whitespace-nowrap"
                      size="sm"
                    >
                      <PlusIcon className="w-5" /> New Invite
                    </Button>
                  }
                />
              </div>
              <div>
                {invitationsData && (
                  <DataTable
                    columns={companyInvitationsColumns}
                    data={invitationsData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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
