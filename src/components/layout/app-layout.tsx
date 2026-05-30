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
import { PageStack } from "../page-components";
import Link from "next/link";
import { isUuid, shortId } from "@/lib/utils";
import { routes } from "@/lib/routes";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { asPath } = useRouter();

  const segments = asPath.split("?")[0].split("/").filter(Boolean);

  let path = "";

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/[0.3] px-4 backdrop-blur-xl">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href={routes.dashboard.index()}>Overview</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />

                {segments.map((segment, i) => {
                  path += `/${segment}`;

                  const isLast = i === segments.length - 1;

                  const label = isUuid(segment)
                    ? shortId(segment)
                    : segment.replace(/-/g, " ");

                  return (
                    <React.Fragment key={path}>
                      <BreadcrumbItem className="hidden capitalize md:block">
                        {isLast ? (
                          <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={path}>{label}</Link>
                          </BreadcrumbLink>
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

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-20 sm:pb-56">
            <DashboardPageContainer
              size="full"
              className="flex flex-1 flex-col"
            >
              {/* <div className="pt-4">
                <Breadcrumbs />
              </div> */}
              <PageStack className="py-2 lg:py-4">{children}</PageStack>
            </DashboardPageContainer>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
