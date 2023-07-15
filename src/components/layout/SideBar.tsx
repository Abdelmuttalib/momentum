import {
  BuildingOfficeIcon,
  Cog6ToothIcon,
  RectangleGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { cn } from "@/utils/cn";

import { IconButton } from "@/components/ui/icon-button";
import Image from "next/image";
import LanguageSwitcher from "../language-switcher";
import { UsersIcon } from "lucide-react";

type DashboardLink = {
  label: string;
  icon: ReactNode;
  href: string;
};

export const dashboardLinks: DashboardLink[] = [
  // {
  //   text: "Home",
  //   icon: <Squares2X2Icon className="mx-2 my-1.5 w-5 text-current" />,
  //   href: "/",
  // },
  // {
  //   label: "Overview",
  //   icon: <RectangleGroupIcon className="w-6 text-current" />,
  //   href: "/dashboard/overview",
  // },
  // {
  //   label: "Organization",
  //   icon: <BuildingOfficeIcon className="w-6 text-current" />,
  //   href: "/dashboard/organization",
  // },
  // {
  //   label: "Settings",
  //   icon: <Cog6ToothIcon className="w-6 text-current" />,
  //   href: "/dashboard/settings",
  // },
  // {
  //   label: "Teams",
  //   icon: <UsersIcon className="w-6 text-current" />,
  //   href: "/team",
  // },
  // {
  //   text: 'user-management',
  //   icon: <UsersIcon className='mx-2 my-1.5 w-5 text-current' />,
  //   href: '/dashboard/user-management',
  // },
  // {
  //   text: 'design-system',
  //   icon: <HashtagIcon className='mx-2 my-1.5 w-5 text-current' />,
  //   href: '/dashboard/design-system',
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
        "label-sm focus:text-primary-50 group flex w-full items-center border-r-4 border-transparent py-4 pl-4 hover:border-transparent hover:bg-gray-100 focus:border-gray-900 focus:bg-gray-900/80 focus:outline-transparent xl:gap-3",
        {
          "border-r-primary-400 bg-gray-800/50 text-primary dark:bg-gray-800/40":
            isCurrentPath,
          "text-gray-800": !isCurrentPath,
        }
      )}
    >
      {icon}
      <span className="ml-1 font-medium text-gray-800 first-letter:uppercase">
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
        "text-md focus:text-primary-50 group flex w-full items-center rounded-lg border-l-4 border-transparent py-2.5 pl-4 font-semibold hover:bg-gray-900 hover:text-gray-100 focus:outline-transparent xl:gap-3",
        {
          "rounded-l-sm border-l-primary-blue-400 bg-gray-800 text-gray-100":
            isCurrentPath,
          "text-gray-700": !isCurrentPath,
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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Team } from "@prisma/client";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";

export function AccordionDemo({ subLinks }: { subLinks: Team[] | undefined }) {
  const { asPath } = useRouter();
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger
          className={cn(
            "label-sm focus:text-primary-50 group flex w-full items-center border-r-4 border-transparent px-4 py-4 text-gray-800 hover:border-transparent hover:bg-primary-blue-50 hover:no-underline focus:outline-transparent xl:gap-3"
          )}
        >
          <span className="flex items-center gap-4">
            {/* <Squares2X2Icon className="w-6 text-current" /> */}
            <UsersIcon className="w-6 text-current" />
            <span className="">Teams</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="no-scrollbar overflow-y-auto">
          <div className="flex h-full flex-col gap-1 px-4 pt-1 text-gray-800">
            {subLinks &&
              [...subLinks].map((team) => (
                <SideBarSubLink
                  key={team.id}
                  href={`/dashboard/team/${team.id}`}
                  label={team.name}
                  icon={<UsersIcon className="w-6 text-current" />}
                  isCurrentPath={asPath === `/team/${team.id}`}
                />
              ))}
          </div>
          {/* <SideBarSubLink
            href=""
            label="Projects"
            icon={<Squares2X2Icon className="w-6 text-current" />}
            isCurrentPath
          /> */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

interface SideBarProps {
  mode?: "mobile" | "normal";
  setShowSidebarMenu?: Dispatch<SetStateAction<boolean>>;
}

const SideBar = ({ mode = "normal", setShowSidebarMenu }: SideBarProps) => {
  const { pathname } = useRouter();
  const { data: session } = useSession();
  const companyId = session?.user?.companyId as string;

  const { data: teams } = api.team.admin.getAllTeamsByCompanyId.useQuery(
    {
      companyId: companyId,
    },

    {
      enabled: !!companyId,
    }
  );

  // className={cn('relative border-r bg-gray-900', {
  //   'hidden h-full min-h-screen w-full flex-col lg:flex lg:w-72':
  //     mode === 'normal',
  //   'fixed inset-0 z-50 flex h-[100svh] w-full flex-col  backdrop-blur-md backdrop-filter transition-colors duration-300 lg:hidden':
  //     mode === 'mobile',
  // })}

  return (
    <div
      className={cn("relative bg-white/[0.2] text-gray-900", {
        "hidden h-full min-h-screen w-full flex-col xl:block xl:w-64":
          mode === "normal",
        "fixed inset-0 z-50 flex h-[100svh] w-full flex-col border-r-0 backdrop-blur-md backdrop-filter transition-colors duration-300 lg:w-80":
          mode === "mobile",
      })}
    >
      <div className="relative flex-1 overflow-y-auto py-4 lg:pl-0">
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
        <div className="flex items-center justify-center text-center">
          <Image
            src="/favicon.ico"
            alt="app icon"
            width={24}
            height={24}
            className="flex-none"
          />
          <h5 className="h4">Momentu.</h5>
          {/* <p className="label-sm block text-center font-medium text-gray-600">
            2.0
          </p> */}
        </div>

        <ul className="mt-10 flex flex-col gap-1 md:mb-44">
          {dashboardLinks.map((link) => (
            <li key={link.label}>
              <SideBarLink {...link} isCurrentPath={pathname === link.href} />
            </li>
          ))}
          <li>
            <AccordionDemo subLinks={teams} />
          </li>
        </ul>
        <div className="mt-10 flex w-full justify-center gap-3 px-5 sm:hidden">
          {/* <LanguageSwitcher /> */}

          {/* Theme Toggle */}
          {/* <IconButton
            type='button'
            variant='outline'
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? (
              <SunIcon className='w-7' />
            ) : (
              <MoonIcon className='w-7 p-0.5' />
            )}
          </IconButton> */}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
