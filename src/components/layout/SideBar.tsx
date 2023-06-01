import { BuildingOfficeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import cn from "@/utils/cn";

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
  {
    label: "Organization",
    icon: <BuildingOfficeIcon className="w-6 text-current" />,
    href: "/organization",
  },
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
        "label-sm group flex w-full items-center border-r-4 border-transparent py-4 pl-4 hover:border-transparent hover:bg-gray-900 focus:border-gray-900 focus:bg-gray-900/80 focus:text-primary-50 focus:outline-transparent xl:gap-3",
        {
          "border-r-primary-400 bg-gray-800/50 text-primary dark:bg-gray-800/40":
            isCurrentPath,
          "text-gray-100": !isCurrentPath,
        }
      )}
    >
      {icon}
      <span className="ml-1 text-gray-100 first-letter:uppercase">
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
        "text-md group flex w-full items-center rounded-lg border-l-4 border-transparent py-2.5 pl-4 font-semibold hover:bg-gray-900 focus:border-gray-900 focus:bg-gray-900/80 focus:text-primary-50 focus:outline-transparent xl:gap-3",
        {
          "rounded-l-sm border-l-primary-400 bg-gray-800/50 text-primary dark:bg-gray-800/40":
            isCurrentPath,
          "text-gray-100": !isCurrentPath,
        }
      )}
    >
      {/* {icon} */}
      <span className="ml-1 text-gray-100 first-letter:uppercase">
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
            "label-sm group flex w-full items-center border-r-4 border-transparent px-4 py-4 text-gray-100 hover:border-transparent hover:bg-gray-900 hover:no-underline focus:border-gray-900 focus:bg-gray-900/80 focus:text-primary-50 focus:outline-transparent xl:gap-3"
          )}
        >
          <span className="flex items-center gap-4">
            {/* <Squares2X2Icon className="w-6 text-current" /> */}
            <UsersIcon className="w-6 text-current" />
            <span className="">Teams</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="no-scrollbar overflow-y-auto">
          <div className="flex h-full flex-col gap-1 px-4 pt-1 text-gray-100">
            {subLinks &&
              [...subLinks].map((team) => (
                <SideBarSubLink
                  key={team.id}
                  href={`/team/${team.id}`}
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
  const organizationId = session?.user?.organizationId as string;

  const { data: teams } = api.team.admin.getAllTeamsByOrganization.useQuery(
    {
      organizationId: organizationId,
    },

    {
      enabled: !!organizationId,
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
      className={cn("relative bg-gray-900", {
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
        <div className="flex justify-center text-center text-gray-200">
          <Image
            src="/images/invix-logo.png"
            alt="invix logo"
            width="60"
            height="60"
            // objectFit="contain"
          />
          {/* <h5 className="h5">
            InSpect
            <span className="ml-0.5 text-3xl text-primary">.</span>
          </h5>
          <p className="label-sm block text-center text-gray-600">2.0</p> */}
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
          <LanguageSwitcher />

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
