import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DashboardPageContainer } from "../container";
import { useRouter } from "next/router";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname, asPath } = useRouter();

  const segments = asPath.split("?")[0].split("/").filter(Boolean);

  let path = "";

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/overview">Overview</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />

                {segments.map((segment, i) => {
                  path += `/${segment}`;

                  const isLast = i === segments.length - 1;

                  return (
                    <React.Fragment key={path}>
                      <BreadcrumbItem className="hidden capitalize md:block">
                        {isLast ? (
                          <BreadcrumbPage>{segment}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={path}>{segment}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>

                      {!isLast && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <DashboardPageContainer>{children}</DashboardPageContainer>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
