import React from "react";
import Container from "./container";
import { Button, ButtonLink } from "@/components/ui/button";
import { Github, LogIn } from "lucide-react";
import ThemeSwitcher from "@/components/theme-select";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { siteConfig } from "@/config/site-config";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-transparent backdrop-blur backdrop-filter">
      <nav className="w-full">
        <Container>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 md:gap-0">
            <input
              aria-hidden="true"
              type="checkbox"
              name="toggle_nav"
              id="toggle_nav"
              className="peer hidden"
            />
            <div className="relative z-20 flex w-full justify-between md:px-0 lg:w-max">
              <a
                href="#home"
                aria-label="logo"
                className="flex items-center space-x-1.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded bg-background text-xl font-medium text-foreground dark:border">
                  M
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  Momentum
                </span>
              </a>

              <div className="relative flex max-h-10 items-center lg:hidden">
                <label
                  role="button"
                  htmlFor="toggle_nav"
                  aria-label="humburger"
                  id="hamburger"
                  className="peer relative -mr-6 p-6"
                >
                  <div
                    aria-hidden="true"
                    id="line"
                    className="m-auto h-0.5 w-5 rounded bg-foreground"
                  ></div>
                  <div
                    aria-hidden="true"
                    id="line2"
                    className="m-auto mt-2 h-0.5 w-5 rounded bg-foreground"
                  ></div>
                </label>
              </div>
            </div>
            {/* overlay */}
            <div
              aria-hidden="true"
              className="fixed inset-0 z-10 h-screen w-screen origin-bottom scale-y-0 bg-background/95 backdrop-blur-2xl transition duration-500 peer-checked:origin-top peer-checked:scale-y-100 lg:hidden"
            ></div>
            <div
              className="invisible absolute left-0 top-full z-20 w-full origin-top translate-y-0 scale-95 flex-col flex-wrap justify-end gap-6 py-8 opacity-0 shadow-gray-600/10 transition-all duration-300
                            peer-checked:visible peer-checked:scale-100 peer-checked:opacity-100 dark:shadow-none lg:visible lg:relative lg:flex lg:w-7/12 lg:translate-y-0 lg:scale-100 lg:flex-row lg:items-center
                            lg:gap-0 lg:border-none lg:bg-transparent lg:p-0
                            lg:opacity-100 lg:shadow-none lg:peer-checked:translate-y-0"
            >
              <div className="mt-8 flex w-full flex-col justify-start sm:w-auto lg:mt-0 lg:flex-row lg:gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="https://github.com/yourusername/issuetracker"
                    target="_blank"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
                <HeaderCTA />
                <ThemeSwitcher size={"icon-sm"} />
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}

function HeaderCTA() {
  const { data: session } = useSession();
  const user = session?.user;

  if (user) {
    return (
      <ButtonLink
        href={siteConfig.pages.main.links.overview.href}
        className="w-full flex-none lg:w-auto"
        size={"sm"}
      >
        Dashboard
      </ButtonLink>
    );
  }

  return (
    <ButtonLink
      href={siteConfig.pages.main.links.signIn.href}
      className="w-full flex-none lg:w-auto"
      size={"sm"}
    >
      <LogIn className="w-4" />
      Sign In
    </ButtonLink>
  );
}
