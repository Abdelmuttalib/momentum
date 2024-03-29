import React from "react";
import Container from "./container";
import { ButtonLink } from "@/components/ui/button";

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
                {/* <div aria-hidden="true" className="flex space-x-1">
                  <div className="h-4 w-4 rounded-full bg-gray-900 dark:bg-white"></div>
                  <div className="h-6 w-2 bg-primary"></div>
                </div> */}
                <div className="flex h-7 w-7 items-center justify-center rounded bg-gray-900 font-semibold text-gray-100 dark:border">
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
                  className="relative  -mr-6 p-6"
                >
                  <div
                    aria-hidden="true"
                    id="line"
                    className="m-auto h-0.5 w-5 rounded bg-gray-900 transition duration-300 dark:bg-gray-300"
                  ></div>
                  <div
                    aria-hidden="true"
                    id="line2"
                    className="m-auto mt-2 h-0.5 w-5 rounded bg-gray-900 transition duration-300 dark:bg-gray-300"
                  ></div>
                </label>
              </div>
            </div>
            {/* overlay */}
            <div
              aria-hidden="true"
              className="fixed inset-0 z-10 h-screen w-screen origin-bottom scale-y-0 bg-gray-900/90 backdrop-blur-2xl transition duration-500 peer-checked:origin-top peer-checked:scale-y-100 dark:bg-gray-900/70 lg:hidden"
            ></div>
            <div
              className="invisible absolute left-0 top-full z-20 w-full origin-top translate-y-0 scale-95 flex-col flex-wrap justify-end gap-6 py-8 opacity-0 shadow-gray-600/10 transition-all duration-300 
                            peer-checked:visible peer-checked:scale-100 peer-checked:opacity-100 dark:shadow-none lg:visible lg:relative lg:flex lg:w-7/12 lg:translate-y-0 lg:scale-100 lg:flex-row lg:items-center
                            lg:gap-0 lg:border-none lg:bg-transparent lg:p-0 
                            lg:opacity-100 lg:shadow-none lg:peer-checked:translate-y-0"
            >
              <div className="w-full text-gray-500 dark:text-gray-300 lg:w-auto lg:pr-4 lg:pt-0">
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
                        className="block text-gray-600 transition hover:text-brand dark:hover:text-brand-400 md:px-4"
                      >
                        <span>{label}</span>
                      </a>
                    </li>
                  ))}

                  {/* <li>
                    <a
                      href="#testimonials"
                      className="block transition hover:text-brand dark:hover:text-brand-400 md:px-4"
                    >
                      <span>Testimonials</span>
                    </a>
                  </li> */}
                </ul>
              </div>

              {/* <div className="mr-2">
                <ThemeToggle />
              </div> */}

              <div className="mt-8 w-full sm:w-auto lg:mt-0">
                <ButtonLink
                  href="/sign-in"
                  variant="outline"
                  className="w-full lg:w-auto"
                >
                  Sign In
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
