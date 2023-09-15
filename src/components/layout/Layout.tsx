import { type ReactNode } from "react";

import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import ThemeToggle from "../theme-toggle";
import MainSwitcher from "../Switcher";
import Link from "next/link";
import { useRouter } from "next/router";

interface HeaderProps {
  pageTitle: string | ReactNode;
  actions: ReactNode;
}
// Header
function Header({ pageTitle, actions }: HeaderProps) {
  const { query, asPath } = useRouter();
  const { teamId, projectId } = query as { teamId: string; projectId: string };

  const companyPathNavLinks = [
    {
      label: "Teams",
      href: `/teams`,
      current: asPath === `/teams`,
    },
    {
      label: "Settings",
      href: `/settings`,
      current: asPath === `/settings` || asPath === `/settings/profile`,
    },
  ];

  const teamPathNavLinks = [
    {
      label: "Overview",
      href: `/teams/${teamId}`,
      current: asPath === `/teams/${teamId}`,
    },
    {
      label: "Settings",
      href: `/teams/${teamId}/settings`,
      current: asPath === `/teams/${teamId}/settings`,
    },
  ];

  const projectPathNavLinks = [
    {
      label: "Board",
      href: `/teams/${teamId}/projects/${projectId}`,
      current: asPath === `/teams/${teamId}/projects/${projectId}`,
    },
  ];

  return (
    <>
      {/* {showSidebarMenu && (
        <SideBar mode="mobile" setShowSidebarMenu={setShowSidebarMenu} />
      )} */}
      <header className="sticky top-0 z-50 w-full flex-none border-b bg-white/[0.3] backdrop-blur-md backdrop-filter transition-colors duration-300 dark:bg-gray-900 dark:backdrop-blur-none dark:backdrop-filter-none print:hidden lg:pl-0">
        <div className="px-4 pb-1.5 lg:px-6 lg:pl-3">
          <div className="flex h-14 items-center justify-between overflow-y-hidden">
            <div className="flex w-full items-center justify-between gap-3 ">
              <div className="flex items-center gap-3">
                {/* <IconButton
                className={cn("bg-white focus:border-2", {
                  block: pathname === "/",
                  "block xl:hidden": pathname !== "/",
                })}
                variant="secondary"
                size="sm"
                onClick={() => setShowSidebarMenu(true)}
              >
                <Bars3Icon className="w-6" />
              </IconButton> */}
                <div className="block dark:text-gray-200 print:hidden">
                  <h1 className="h6-light block capitalize sm:hidden">
                    {pageTitle}
                  </h1>
                  <h1 className="h5-light hidden capitalize sm:block">
                    {pageTitle}
                  </h1>
                </div>{" "}
                <MainSwitcher />
              </div>

              {/* full logo */}
              {/* <Image
              src="/images/invix-logo-full.png"
              alt="invix logo"
              width="220"
              height="220"
              className="bg-transparent"
              objectFit="contain"
            /> */}

              {/* <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => void signOut()}>
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </div> */}
            </div>

            <div className="mt-1.5 hidden items-center gap-2 sm:flex">
              <ThemeToggle />
              {/* <UserAccountMenu /> */}
              <Button
                variant="secondary"
                className="flex items-center gap-2 whitespace-nowrap pl-3.5"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => signOut()}
              >
                <LogOut className="mr-1 h-5 w-5" />
                Sign Out
              </Button>

              {actions}
            </div>
          </div>
          {/* company nav */}
          {!teamId && (
            <div className="flex">
              {companyPathNavLinks.map(({ label, href, current }) => (
                <nav key={href}>
                  <ul>
                    <li
                      className={cn(
                        "relative border-b-2 border-b-transparent",
                        {
                          // "border-brand-500 dark:border-brand-400": current,
                        }
                      )}
                    >
                      <Link
                        href={href}
                        className={cn(
                          "mb-2 block rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                          {
                            "text-gray-900 dark:text-gray-200 ": current,
                          }
                        )}
                      >
                        {label}
                      </Link>
                      {current && (
                        <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[3px] w-12 bg-brand-500 dark:bg-brand-400"></span>
                      )}
                    </li>
                  </ul>
                </nav>
              ))}
            </div>
          )}
          {/* team nav */}
          {teamId && !projectId && (
            <div className="flex">
              {teamPathNavLinks.map(({ label, href, current }) => (
                <nav key={href}>
                  <ul>
                    <li
                      className={cn(
                        "relative border-b-2 border-b-transparent",
                        {
                          // "border-brand-500 dark:border-brand-400": current,
                        }
                      )}
                    >
                      <Link
                        href={href}
                        className={cn(
                          "mb-2 block rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                          {
                            "text-gray-900 dark:text-gray-200 ": current,
                          }
                        )}
                      >
                        {label}
                      </Link>
                      {current && (
                        <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[3px] w-12 bg-brand-500 dark:bg-brand-400"></span>
                      )}
                    </li>
                  </ul>
                </nav>
              ))}
            </div>
          )}
          {projectId && (
            <div className="flex">
              {projectPathNavLinks.map(({ label, href, current }) => (
                <nav key={href}>
                  <ul>
                    <li
                      className={cn(
                        "relative border-b-2 border-b-transparent",
                        {
                          // "border-brand-500 dark:border-brand-400": current,
                        }
                      )}
                    >
                      <Link
                        href={href}
                        className={cn(
                          "mb-2 block rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                          {
                            "text-gray-900 dark:text-gray-200 ": current,
                          }
                        )}
                      >
                        {label}
                      </Link>
                      {current && (
                        <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[3px] w-12 bg-brand-500 dark:bg-brand-400"></span>
                      )}
                    </li>
                  </ul>
                </nav>
              ))}
            </div>
          )}
        </div>
      </header>
    </>
  );
}

// Footer
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t px-4 py-4 text-gray-700 lg:px-6">
      <div className="w-full text-center md:text-left">
        <h5 className="label-sm mb-1">
          Momentum
          {/* {{ app.name }} */}
        </h5>
        <p className="text-xs text-gray-600">
          Copyright © {new Date().getFullYear()} invix. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

interface LayoutProps {
  pageTitle: string | ReactNode;
  children: ReactNode;
  rightSideActions?: ReactNode;
  className?: string;
}

export default function Layout({
  pageTitle,
  children,
  rightSideActions,
  className,
}: LayoutProps) {
  return (
    <div className="fixed left-0 top-0 flex h-full min-h-[100svh] w-screen min-w-full overflow-auto antialiased dark:bg-gray-800/10">
      {/* <aside> */}
      {/* <SideBar mode="normal" /> */}
      {/* <MobileNav /> */}
      {/* </aside> */}
      <div className="flex h-full min-w-full flex-col overflow-auto">
        <Header pageTitle={pageTitle} actions={rightSideActions} />
        <main
          className={cn(
            "relative w-full flex-grow px-2 pb-10 pt-6 lg:px-6",
            className
          )}
        >
          {children}
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
