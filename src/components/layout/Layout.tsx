import { useState, type ReactNode } from "react";

import { cn } from "@/utils/cn";
import { useRouter } from "next/router";
import SideBar from "./sidebar";
import { IconButton } from "../ui/icon-button";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Typography } from "@/components/ui/typography";

interface HeaderProps {
  pageTitle: string | ReactNode;
  actions: ReactNode;
}
// Header
function Header({ pageTitle, actions }: HeaderProps) {
  const { pathname } = useRouter();
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);

  return (
    <>
      {showSidebarMenu && (
        <SideBar mode="mobile" setShowSidebarMenu={setShowSidebarMenu} />
      )}
      <header className="z-40 w-full flex-none backdrop-blur-md lg:pl-0">
        <div className="px-4 pb-1.5 lg:px-6 lg:pl-3">
          <div className="flex h-16 items-center justify-between overflow-y-hidden">
            <div className="flex w-full items-center justify-between gap-3 ">
              <div className="flex items-center gap-3">
                <IconButton
                  className={cn("", {
                    flex: pathname === "/",
                    "flex xl:hidden": pathname !== "/",
                  })}
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowSidebarMenu((prev) => !prev)}
                >
                  <Bars3Icon className="w-6" />
                </IconButton>
                <div className="block dark:text-gray-200 print:hidden">
                  <Typography
                    as="h1"
                    variant="xl/semibold"
                    className="capitalize"
                  >
                    {pageTitle}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="mt-1.5 hidden items-center gap-2 sm:flex">
              {actions}
            </div>
          </div>
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
    <div className="fixed left-0 top-0 flex h-full min-h-[100svh] w-screen min-w-full overflow-auto antialiased">
      <aside>
        <SideBar mode="normal" />
        {/* <MobileNav /> */}
      </aside>
      <div className="flex h-full w-full flex-col overflow-auto">
        <Header pageTitle={pageTitle} actions={rightSideActions} />
        <main
          className={cn(
            "relative w-full flex-grow px-3 pb-10 pt-2 lg:px-6 ",
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
