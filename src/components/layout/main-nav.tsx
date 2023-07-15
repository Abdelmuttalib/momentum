import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { dashboardLinks } from "./SideBar";

export function MainNav() {
  const { pathname } = useRouter();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image src="/favicon.ico" alt="app icon" width={32} height={32} />
        <span className="hidden font-bold sm:inline-block">Momentu</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {dashboardLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-2 transition-colors hover:text-foreground/80",
              pathname === "/docs" ? "text-foreground" : "text-foreground/60"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {/* <Link
          href="/examples"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/examples")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Examples
        </Link>
        <Link
          href={siteConfig.links.github}
          className={cn(
            "hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block"
          )}
        >
          GitHub
        </Link> */}
      </nav>
    </div>
  );
}
