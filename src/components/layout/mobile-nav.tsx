import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { ViewVerticalIcon } from "@radix-ui/react-icons";

import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { dashboardLinks } from "./sidebar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Image from "next/image";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <ViewVerticalIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <MobileLink
          href="/"
          className="flex items-center gap-1 bg-red-300 bg-transparent px-0"
          onOpenChange={setOpen}
        >
          <Image src="/favicon.ico" alt="app icon" width={32} height={32} />
          {/* <Icons.logo className="mr-2 h-4 w-4" /> */}
          <span className="h3 font-bold">Momentum</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100svh)] pb-10">
          {/* <div className="flex flex-col space-y-3">
            {dashboardLinks.map((item, index) => (
              <div key={index} className="flex flex-col space-y-3 pt-6">
                <MobileLink
                  href={item.href}
                  onOpenChange={setOpen}
                  className="text-muted-foreground"
                >
                  {item.label}
                </MobileLink>
              </div>
            ))} */}
          {/* {docsConfig.mainNav?.map(
              (item) =>
                item.href && (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    onOpenChange={setOpen}
                  >
                    {item.title}
                  </MobileLink>
                )
            )} */}
          {/* </div> */}
          <nav className="flex flex-col space-y-2">
            {dashboardLinks.map((item) => (
              <MobileLink
                key={item.href}
                href={item.href}
                onOpenChange={setOpen}
                className="inline-flex items-center gap-2 rounded-md font-medium text-slate-500"
              >
                {item.icon}
                {item.label}
              </MobileLink>
            ))}
            {/* <h4 className="font-medium">{item.title}</h4>
                {item?.items?.length &&
                  item.items.map((item) => (
                    <React.Fragment key={item.href}>
                      {!item.disabled &&
                        (item.href ? (
                          <MobileLink
                            href={item.href}
                            onOpenChange={setOpen}
                            className="text-muted-foreground"
                          >
                            {item.title}
                          </MobileLink>
                        ) : (
                          item.title
                        ))}
                    </React.Fragment>
                  ))} */}

            {/* {docsConfig.sidebarNav.map((item, index) => (
              <div key={index} className="flex flex-col space-y-3 pt-6">
                <h4 className="font-medium">{item.title}</h4>
                {item?.items?.length &&
                  item.items.map((item) => (
                    <React.Fragment key={item.href}>
                      {!item.disabled &&
                        (item.href ? (
                          <MobileLink
                            href={item.href}
                            onOpenChange={setOpen}
                            className="text-muted-foreground"
                          >
                            {item.title}
                          </MobileLink>
                        ) : (
                          item.title
                        ))}
                    </React.Fragment>
                  ))}
              </div>
            ))} */}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("bg-slate-100 px-4 py-3", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
