import Image from "next/image";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { type ReactNode, useState } from "react";

import cn from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { IconButton, IconLink } from "@/components/ui/icon-button";

import SideBar from "./SideBar";
import useTranslation from "next-translate/useTranslation";

import { LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Bars3Icon } from "@heroicons/react/20/solid";

export function UserAccountMenu() {
  const { t } = useTranslation("common");
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="body-lg flex h-14 w-14 items-center justify-center gap-2 rounded-full border-gray-100 p-0 text-2xl text-primary-700 hover:border-gray-200"
        >
          <User className="h-7 w-7 text-gray-800" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-lg bg-white p-0 py-3">
        <div className="flex w-full items-center gap-3 bg-slate-100 px-3 py-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
            <div className="block rounded-full text-2xl">A</div>
          </div>
          <div className="inline-flex flex-col">
            <h6 className="inline-block font-semibold">
              {/* {session?.user.phoneNumber} */}
              {session?.user.email}
            </h6>
            <p className="inline-block text-gray-600">{session?.user.name}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="px-3 py-3 font-medium hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
          onClick={() => void signOut()}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <p className="body-sm">{t("buttons.signOut")}</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Header
const Header = ({
  pageTitle,
  actions,
}: {
  pageTitle: string;
  actions: ReactNode;
}) => {
  const { locale, asPath } = useRouter();
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);

  return (
    <>
      {showSidebarMenu && (
        <SideBar mode="mobile" setShowSidebarMenu={setShowSidebarMenu} />
      )}
      <header className="sticky top-0 z-40 flex-none border-b bg-white/[0.7] py-3 backdrop-blur-md backdrop-filter transition-colors duration-300 print:hidden lg:pl-0">
        <div className="flex h-14 items-center justify-between overflow-y-hidden px-4 lg:px-8">
          <div className="flex w-full items-center justify-between gap-3 ">
            <IconButton
              className="bg-white focus:border-2"
              variant="secondary"
              size="sm"
              onClick={() => setShowSidebarMenu(true)}
            >
              <Bars3Icon className="w-6" />
            </IconButton>
            <div className="hidden print:hidden">
              <h1 className="h5 block capitalize sm:hidden">{pageTitle}</h1>
              <h1 className="h3 hidden capitalize sm:block">{pageTitle}</h1>
            </div>

            <Image
              src="/images/invix-logo-full.png"
              alt="invix logo"
              width="220"
              height="220"
              className="bg-transparent"
              objectFit="contain"
            />

            <div className="flex items-center gap-2">
              {/* {links.map(({ label, href }) => (
                <Link key={`${label}${href}`} href={href}>
                  {label}
                </Link>
              ))} */}
              <IconLink
                variant="secondary"
                href={asPath}
                locale={locale === "en" ? "zh" : "en"}
                size="lg"
              >
                {locale === "en" ? "zh" : "en"}
              </IconLink>
              <UserAccountMenu />
            </div>
          </div>

          <div className="flex gap-2">
            {actions}
            {/* <IconLink
              href={
                pathname === '/notifications/[id]'
                  ? `/notifications/${query.id}`
                  : pathname === '/devices/[id]'
                  ? `/devices/${query.id}`
                  : pathname
              }
              locale={locale === 'en' ? 'zh' : 'en'}
              variant='outline'
              size='lg'
              className='hidden sm:block'
            >
              {locale}
            </IconLink> */}

            {/* Theme Toggle */}
            {/* <IconButton
              type='button'
              variant='outline'
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className='hidden sm:block'
            >
              {theme === 'light' ? (
                <SunIcon className='w-7' />
              ) : (
                <MoonIcon className='w-7 p-0.5' />
              )}
            </IconButton> */}
          </div>
        </div>
      </header>
    </>
  );
};

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
  pageTitle: string;
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
      <aside>{/* <SideBar mode='mobile' /> */}</aside>
      <div className="flex w-full flex-col overflow-auto">
        <Header pageTitle={pageTitle} actions={rightSideActions} />
        <main className={cn("w-full px-4 pb-10 pt-6 lg:px-8", className)}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
