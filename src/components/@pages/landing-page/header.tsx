import React from "react";
import Container from "./container";
import { ButtonLink } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import ThemeSwitcher from "@/components/theme-select";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-transparent text-slate-800 backdrop-blur backdrop-filter transition-colors duration-300">
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
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-900 font-semibold text-gray-100 dark:border">
                  M
                </div>
                <span className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
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
              {/* <div className="w-full text-gray-500 dark:text-gray-300 lg:w-auto lg:pr-4 lg:pt-0">
                <ul className="flex flex-col gap-2 font-medium tracking-normal lg:flex-row lg:gap-0 ">
                  {[
                    {
                      label: "Features",
                      href: "#features",
                    },
                  ].map(({ label, href }) => (
                    <li
                      key={label + href}
                      className="px-3 py-3 hover:bg-gray-100 sm:px-0 sm:py-0 sm:hover:bg-transparent"
                    >
                      <a
                        href={href}
                        className="hover:text-brand dark:hover:text-brand-400 block text-foreground-light transition md:px-4"
                      >
                        <span>{label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div> */}

              <div className="mt-8 flex w-full flex-col justify-start sm:w-auto lg:mt-0 lg:flex-row">
                <ButtonLink
                  href="/sign-in"
                  variant="ghost"
                  className="w-full flex-none lg:w-auto"
                  leftIcon={<LogIn className="w-4" />}
                >
                  Sign In
                </ButtonLink>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
