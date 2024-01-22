import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/20/solid";
import { api } from "@/utils/api";
import UserMenu from "../user/UserMenu";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { cn } from "@/utils/cn";

import { IconButton } from "@/components/ui/icon-button";
import Image from "next/image";
import { TerminalIcon, TerminalSquareIcon, UsersIcon } from "lucide-react";

type DashboardLink = {
  label: string;
  icon: ReactNode;
  href: string;
};

export const dashboardLinks: DashboardLink[] = [
  {
    label: "Home",
    icon: <HomeIcon className="w-5 text-current" />,
    href: "/teams",
  },
  // {
  //   label: "Overview",
  //   icon: <RectangleGroupIcon className="w-6 text-current" />,
  //   href: "/overview",
  // },
  {
    label: "Teams",
    icon: <UsersIcon className="w-5 text-current" />,
    href: "/teams",
  },
  {
    label: "Projects",
    icon: <TerminalSquareIcon className="w-5 text-current" />,
    href: "/teams",
  },
  {
    label: "Company",
    icon: <BuildingOfficeIcon className="w-5 text-current" />,
    href: "/company",
  },
  {
    label: "Settings",
    icon: <Cog6ToothIcon className="w-5 text-current" />,
    href: "/settings",
  },

  // {
  //   text: "user-management",
  //   icon: <UsersIcon className="mx-2 my-1.5 w-5 text-current" />,
  //   href: "/user-management",
  // },
  // {
  //   text: "design-system",
  //   icon: <HashtagIcon className="mx-2 my-1.5 w-5 text-current" />,
  //   href: "/design-system",
  // },
];

type SideBarLink = DashboardLink & {
  isCurrentPath: boolean;
};

export function SideBarLink({ href, icon, label, isCurrentPath }: SideBarLink) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex w-full items-center rounded-md px-2.5 py-2 hover:bg-gray-800 hover:text-gray-400 focus:border-gray-900 focus:bg-gray-900/80 focus:outline-transparent xl:gap-3",
        {
          "text-gray-100 hover:text-gray-100": isCurrentPath,
          "text-gray-500": !isCurrentPath,
        }
      )}
    >
      {icon}
      <span className="ml-1 text-sm font-medium first-letter:uppercase">
        {/* {t(`pages.${text}.title`)} */}
        {label}
      </span>
    </Link>
  );
}
export function SideBarSubLink({ href, label, isCurrentPath }: SideBarLink) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex w-full items-center rounded-lg border-r-4 border-transparent px-3 py-2 text-sm font-medium hover:bg-gray-800 hover:text-gray-100 focus:outline-transparent xl:gap-3",
        {
          "rounded-r-none border-r-brand-400 bg-gray-800/50 text-gray-100":
            isCurrentPath,
          "text-gray-600": !isCurrentPath,
        }
      )}
    >
      {/* {icon} */}
      <span className="ml-1 first-letter:uppercase">
        {/* {t(`pages.${text}.title`)} */}
        {label}
      </span>
    </Link>
  );
}

interface SideBarProps {
  mode?: "mobile" | "normal";
  setShowSidebarMenu?: Dispatch<SetStateAction<boolean>>;
}

const SideBar = ({ mode = "normal", setShowSidebarMenu }: SideBarProps) => {
  const { pathname, asPath } = useRouter();

  const { data: teams } = api.team.getAllTeamsByCompanyId.useQuery();

  const { data: companyProjects } = api.company.getCompanyProjects.useQuery();

  console.log({ companyProjects });
  // /teams/994e6fb5-f2f2-401e-a90f-c21e31c4f594/projects/4ff90488-7bbd-4d83-b5e4-521d08fd49ed

  return (
    <div
      className={cn(
        "relative bg-gray-900 px-2.5 text-gray-100 dark:bg-gray-800/10",
        {
          "hidden h-full min-h-screen w-full flex-col xl:block xl:w-52":
            mode === "normal",
          "fixed inset-0 z-50 flex h-[100svh] w-full flex-col backdrop-blur-md backdrop-filter transition-colors duration-300":
            mode === "mobile",
        }
      )}
    >
      <div className="relative flex h-full flex-col overflow-y-auto py-4 lg:pl-0">
        {setShowSidebarMenu && (
          <IconButton
            className="absolute left-4 top-6 focus:border-2 focus:border-gray-800"
            variant="outline"
            size="sm"
            onClick={() => setShowSidebarMenu(false)}
          >
            <XMarkIcon className="w-6" aria-hidden="true" />
          </IconButton>
        )}
        <div className="flex items-center gap-2 text-center">
          <Image src="/favicon.ico" alt="app icon" width={28} height={28} />
          <h5 className="font-medium">Momentum</h5>
        </div>

        {/* links */}
        <ul className="mt-10 flex flex-col gap-1.5">
          {dashboardLinks.map((link) => (
            <li key={link.label}>
              <SideBarLink {...link} isCurrentPath={pathname === link.href} />
              {link.label === "Teams" &&
                teams?.map((team) => (
                  <li key={team.id} className="w-full">
                    <SideBarSubLink
                      {...link}
                      href={`/teams/${team.id}`}
                      label={team.name}
                      isCurrentPath={asPath === `/teams/${team.id}`}
                    />
                  </li>
                ))}
              {/* /teams/994e6fb5-f2f2-401e-a90f-c21e31c4f594/projects/4ff90488-7bbd-4d83-b5e4-521d08fd49ed */}
              {link.label === "Projects" &&
                companyProjects?.map((project) => {
                  const projectPath = `/teams/${project.teamId}/projects/${project.id}`;

                  return (
                    <li key={project.id} className="w-full">
                      <SideBarSubLink
                        {...link}
                        href={projectPath}
                        label={project.name}
                        isCurrentPath={asPath === projectPath}
                      />
                    </li>
                  );
                })}
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <UserMenu />
        </div>

        {/* <ul className="mt-10 flex flex-col gap-1 md:mb-44">
          {dashboardLinks.map((link) => (
            <li key={link.label}>
              <SideBarLink {...link} isCurrentPath={pathname === link.href} />
            </li>
          ))}
          <li>
            <AccordionDemo subLinks={teams} />
          </li>
        </ul>
        <div>
          <h4 className="text-sm font-medium">Your Teams</h4>
          <ul className="my-2">
            {teams?.map((team) => (
              <li key={team.id} className="w-full">
                <Link
                  href={`/team/${team.id}`}
                  className="h-full w-full rounded bg-gray-100 px-4 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                  {team.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex w-full justify-center gap-3 px-5 sm:hidden"></div> */}
      </div>
    </div>
  );
};

export default SideBar;
