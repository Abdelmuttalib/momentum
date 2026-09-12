import {
  FolderOpen,
  Home,
  Settings,
  Zap,
  Plus,
  Building,
  List,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserMenu } from "../common/user-menu";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useSession } from "next-auth/react";
import { CreateTask } from "../views/project/tasks/forms/create-task";
import { useRouter } from "next/router";
import { ButtonLink } from "../common/button-link";
import { routes } from "@/lib/routes";
import Image from "next/image";
import { getAvatarUrl } from "@/lib/avatar";
import { Avatar, AvatarImage } from "../ui/avatar";

export function AppSidebar() {
  const { asPath, query } = useRouter();
  const projectId = query.projectId as string;

  const { data: session } = useSession();

  const company = session?.user?.company;

  const companyId = company?.id;

  const { data: projects } = useProjects(companyId);

  const isActive = (url: string) =>
    url === "/"
      ? asPath === url
      : asPath === url || asPath.startsWith(`${url}/`);

  const visibleProjects = (projects ?? []).slice(0, 5);
  const hasMoreProjects = (projects ?? []).length > visibleProjects.length;

  const navigation = [
    {
      title: "Overview",
      url: routes.dashboard.index(),
      icon: Home,
    },
    {
      title: "Projects",
      url: routes.projects.index(),
      icon: FolderOpen,
      subItems: visibleProjects.map((project) => ({
        title: project.name,
        url: routes.projects.details({ projectId: project.id }),
      })),
    },
    {
      title: "Tasks",
      url: routes.tasks.index(),
      icon: List,
    },
    {
      title: "Company",
      url: routes.company.index(),
      icon: Building,
    },
    // {
    //   title: "Teams",
    //   url: "/teams",
    //   icon: Users,
    // },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[13px] font-semibold">Momentum</span>
            {company?.name && (
              <span className="truncate text-xs text-muted-foreground">
                {company.name}
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>

                  {/* ✅ Render sub items */}
                  {item.subItems && item.subItems.length > 0 && (
                    <SidebarMenuSub>
                      {item.subItems.map((sub) => (
                        <SidebarMenuSubItem key={sub.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={asPath === sub.url}
                          >
                            <Link href={sub.url}>
                              <Avatar className="me-0.5 h-5 w-5">
                                <AvatarImage
                                  src={getAvatarUrl(sub.title, {
                                    size: 20,
                                  })}
                                  alt={`${sub.title} project`}
                                  width={20}
                                  height={20}
                                />
                              </Avatar>
                              <span>{sub.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                      {item.title === "Projects" && hasMoreProjects && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href={routes.projects.index()}>
                              <span className="text-muted-foreground">
                                View all projects
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-1.5 px-2">
              <CreateTask
                triggerButton={
                  <Button size="sm" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                }
                projectId={projectId}
                type="project"
                projects={projects}
              />
              <ButtonLink
                href={routes.projects.new()}
                size="sm"
                variant="outline"
                className="w-full justify-start"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </ButtonLink>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive(routes.settings.index())}
              tooltip="Settings"
            >
              <Link href={routes.settings.index()}>
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <UserMenu />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
