import {
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import UserMenu from "../user/user-menu";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { cn } from "@/utils/cn";

import { IconButton } from "@/components/ui/icon-button";
import { UsersIcon } from "lucide-react";

type DashboardLink = {
  label: string;
  icon: ReactNode;
  href: string;
};

export const dashboardLinks: DashboardLink[] = [
  {
    label: "Home",
    icon: <HomeIcon className="w-5 text-current" />,
    href: "/overview",
  },
  
  {
    label: "Teams",
    icon: <UsersIcon className="w-5 text-current" />,
    href: "/teams",
  },
  // {
  //   label: "Projects",
  //   icon: <TerminalSquareIcon className="w-5 text-current" />,
  //   href: "/teams",
  // },
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
];

type SideBarLink = DashboardLink & {
  isCurrentPath: boolean;
};

export function SideBarLink({ href, icon, label, isCurrentPath }: SideBarLink) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex w-full items-center rounded px-4 py-2.5 hover:bg-accent-hover focus:border-gray-900 focus:outline-transparent xl:gap-3",
        {
          "bg-accent-hover text-foreground": isCurrentPath,
          "text-foreground-lighter": !isCurrentPath,
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
          "border-r-brand-400 rounded-r-none bg-gray-800/50 text-gray-100":
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

export default function SideBar({
  mode = "normal",
  setShowSidebarMenu,
}: SideBarProps) {
  const { pathname, asPath } = useRouter();

  return (
    <div
      className={cn("relative bg-foreground dark:bg-background px-4", {
        "hidden h-full min-h-screen w-full flex-col xl:block xl:w-60":
          mode === "normal",
        "fixed inset-0 z-50 flex h-[100svh] w-full flex-col transition-colors duration-300":
          mode === "mobile",
      })}
    >
      <div className="relative flex h-full flex-col overflow-y-auto py-4 lg:pl-0">
        {setShowSidebarMenu && (
          <IconButton
            className="absolute left-2 top-2 focus:border-2 focus:border-gray-800"
            variant="outline"
            size="sm"
            onClick={() => setShowSidebarMenu(false)}
          >
            <XMarkIcon className="w-6" aria-hidden="true" />
          </IconButton>
        )}
        <div className="hidden w-fit xl:flex">
          <h5 className="font-medium text-white text-xl">Momentum</h5>
        </div>

        {/* links */}
        <ul className="mt-10 flex flex-col">
          {dashboardLinks.map((link) => (
            <li key={link.label}>
              <SideBarLink {...link} isCurrentPath={pathname === link.href} />
              {/* {link.label === "Teams" &&
                teams?.map((team) => (
                  <li key={team.id} className="w-full">
                    <SideBarSubLink
                      {...link}
                      href={`/teams/${team.id}`}
                      label={team.name}
                      isCurrentPath={asPath === `/teams/${team.id}`}
                    />
                  </li>
                ))} */}
              {/* /teams/994e6fb5-f2f2-401e-a90f-c21e31c4f594/projects/4ff90488-7bbd-4d83-b5e4-521d08fd49ed */}
              {/* {link.label === "Projects" &&
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
                })} */}
            </li>
          ))}
        </ul>

        <div className="mt-auto max-w-full">
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
