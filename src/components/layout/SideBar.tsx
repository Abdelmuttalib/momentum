import { XMarkIcon } from "@heroicons/react/20/solid";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import cn from "@/utils/cn";

import { IconButton } from "@/components/ui/icon-button";

type DashboardLinkT = {
  text: string;
  icon: React.ReactNode;
  href: string;
};

export const dashboardLinks: DashboardLinkT[] = [
  // {
  //   text: "Home",
  //   icon: <Squares2X2Icon className="mx-2 my-1.5 w-5 text-current" />,
  //   href: "/",
  // },
  {
    text: "Team Management",
    icon: <Squares2X2Icon className="mx-2 my-1.5 w-5 text-current" />,
    href: "/team-management",
  },
  // {
  //   text: "Project Management",
  //   icon: <Squares2X2Icon className="mx-2 my-1.5 w-5 text-current" />,
  //   href: "/project-management",
  // },

  // {
  //   text: "projects",
  //   icon: <Squares2X2Icon className="mx-2 my-1.5 w-5 text-current" />,
  //   href: "/dashboard/projects",
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

const SideBar = ({
  mode = "normal",
  setShowSidebarMenu,
}: {
  mode: "mobile" | "normal";
  setShowSidebarMenu?: (show: boolean) => void;
}) => {
  const { pathname } = useRouter();

  // className={cn('relative border-r bg-gray-900', {
  //   'hidden h-full min-h-screen w-full flex-col lg:flex lg:w-72':
  //     mode === 'normal',
  //   'fixed inset-0 z-50 flex h-[100svh] w-full flex-col  backdrop-blur-md backdrop-filter transition-colors duration-300 lg:hidden':
  //     mode === 'mobile',
  // })}

  return (
    <div
      className={cn("relative border-r bg-gray-900", {
        "hidden h-full min-h-screen w-full flex-col": mode === "normal",
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
        <div className="text-center text-gray-200">
          <h5 className="h5">
            InSpect
            {/* {t('app.name')} */}
            <span className="ml-0.5 text-3xl text-primary">.</span>
          </h5>
          <p className="label-sm block text-center text-gray-600">
            2.0
            {/* {t('app.description')} */}
          </p>
        </div>
        <ul className="mt-10 flex flex-col gap-1 md:mb-44">
          {dashboardLinks.map((link) => (
            <li key={link.text}>
              <Link
                href={link.href}
                className={cn(
                  "label-md group flex w-full items-center border-r-4 border-transparent py-3 pl-4 hover:border-transparent hover:bg-gray-900 focus:border-gray-900 focus:bg-gray-900/80 focus:text-primary-50 focus:outline-transparent xl:gap-3",
                  {
                    "border-r-primary-400 bg-gray-800/50 text-primary dark:bg-gray-800/40":
                      pathname === link.href,
                    "text-gray-100": pathname !== link.href,
                  }
                )}
              >
                {link.icon}
                <span className="ml-2 text-gray-100 first-letter:uppercase">
                  {/* {t(`pages.${link.text}.title`)} */}
                  {link.text}
                </span>
              </Link>
            </li>
          ))}
          {/* {user && user.admin && (
            <li>
              <Link
                href='/dashboard/user-management'
                className={cn(
                  'label-md group flex w-full items-center border-r-4 border-transparent py-3 pl-4 hover:border-transparent hover:bg-gray-900 focus:border-gray-900 focus:bg-gray-900/80 focus:text-primary-50 focus:outline-transparent xl:gap-3',
                  {
                    'border-r-primary-400 bg-gray-800/50 text-primary dark:bg-gray-800/40':
                      pathname === '/dashboard/user-management',
                    'text-gray-100': pathname !== '/dashboard/user-management',
                  }
                )}
              >
                <UsersIcon className='mx-2 my-1.5 w-5 text-current' />
                <span className='ml-2 text-gray-100 first-letter:uppercase'>
                  User Management
                </span>
              </Link>
            </li>
          )} */}
          {/* <Link
            href='/login'
            className={cn(
              'label-md group absolute bottom-5 flex w-full items-center border-r-4 border-transparent py-3 pl-4 hover:border-transparent hover:bg-gray-900 focus:border-gray-900 focus:bg-gray-900/80 focus:text-primary-50 focus:outline-transparent xl:gap-3'
            )}
          >
            <ArrowRightOnRectangleIcon className='w-7 text-gray-200' />
            <span className='ml-2 text-gray-100 first-letter:uppercase'>
              Sign in
            </span>
          </Link> */}
          {/* {isMounted && user && (
            <Button
              size='sm'
              variant='link'
              className='absolute bottom-5 mx-6 mt-auto flex w-full max-w-[83%] items-center no-underline hover:border-primary hover:bg-primary hover:no-underline focus:ring-offset-gray-900'
              onClick={() => {
                logOut();
                push('/login');
              }}
            >
              <ArrowLeftOnRectangleIcon className='w-7 text-gray-200' />
              <span className='ml-2 text-gray-100 first-letter:uppercase'>
                Sign out
              </span>
            </Button>
          )} */}
        </ul>
        <div className="mt-10 flex w-full justify-center gap-3 px-5 sm:hidden">
          {/* <IconLink
            href={
              pathname === '/notifications/[id]'
                ? `/notifications/${query.id}`
                : pathname
            }
            locale={locale === 'en' ? 'zh' : 'en'}
            variant='outline'
            size='lg'
          >
            {locale}
          </IconLink> */}

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
