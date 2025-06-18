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
                <BreadcrumbItem className="hidden capitalize md:block">
                  <BreadcrumbLink href={`/overview`}>Overview</BreadcrumbLink>
                </BreadcrumbItem>
                {asPath.split("/").map((p, i) => (
                  <>
                    <BreadcrumbItem
                      key={`/${p}`}
                      className="hidden capitalize md:block"
                    >
                      <BreadcrumbLink href={`/${p}`}>{p}</BreadcrumbLink>
                    </BreadcrumbItem>
                    {i < asPath.split("/").length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <DashboardPageContainer>{children}</DashboardPageContainer>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
