import { useRouter } from "next/router";
import { type ReactNode, useState } from "react";

import { cn } from "@/utils/cn";

import { IconButton } from "@/components/ui/icon-button";

import SideBar from "./SideBar";

import { Bars3Icon } from "@heroicons/react/20/solid";
import UserAccountMenu from "../user/UserAccountMenu";

interface HeaderProps {
  pageTitle: string | ReactNode;
  actions: ReactNode;
}
// Header
function Header({ pageTitle, actions }: HeaderProps) {
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);
  const { pathname } = useRouter();

  return (
    <>
      {showSidebarMenu && (
        <SideBar mode="mobile" setShowSidebarMenu={setShowSidebarMenu} />
      )}
      <header className="sticky top-0 z-40 flex-none border-b bg-white/[0.3] py-3 backdrop-blur-md backdrop-filter transition-colors duration-300 print:hidden lg:pl-0">
        <div className="flex h-14 items-center justify-between overflow-y-hidden px-4 lg:px-8">
          <div className="flex w-full items-center justify-between gap-3 ">
            <div className="flex items-center gap-3">
              <IconButton
                className={cn("bg-white focus:border-2", {
                  block: pathname === "/",
                  "block xl:hidden": pathname !== "/",
                })}
                variant="secondary"
                size="sm"
                onClick={() => setShowSidebarMenu(true)}
              >
                <Bars3Icon className="w-6" />
              </IconButton>

              <div className="block print:hidden">
                <h1 className="h5 block capitalize sm:hidden">{pageTitle}</h1>
                <h1 className="h3 hidden capitalize sm:block">{pageTitle}</h1>
              </div>
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

            <div className="flex items-center gap-2">
              {/* <LanguageSwitcher /> */}
              <UserAccountMenu />
            </div>
          </div>

          <div className="flex gap-2">{actions}</div>
        </div>
      </header>
    </>
  );
}

// Footer
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t px-4 py-4 text-gray-700 lg:px-8">
      <div className="w-full text-center md:text-left">
        <h5 className="label-sm mb-1">
          InSpect
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
    <div className="fixed left-0 top-0 flex h-full min-h-[100svh] w-screen  antialiased transition-colors duration-300">
      <aside>
        <SideBar mode="normal" />
        {/* <MobileNav /> */}
      </aside>
      <div className="flex w-full flex-col overflow-auto">
        <Header pageTitle={pageTitle} actions={rightSideActions} />
        <main
          className={cn("w-full flex-grow px-4 pb-10 pt-6 lg:px-8", className)}
        >
          {children}
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
