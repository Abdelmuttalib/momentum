import { AppLayout } from "@/components/layout/app-layout";
import { getServerAuthSession } from "@/server/auth";
import type { GetServerSideProps } from "next";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  FolderOpen,
  Plus,
  LayoutList,
} from "lucide-react";
import { PageHeader } from "@/components/page-components";
import { ButtonLink } from "@/components/common/button-link";
import { routes } from "@/lib/routes";
import { CreateTask } from "@/components/views/project/tasks/forms/create-task";
import { useSession } from "next-auth/react";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { TaskStatus } from "@prisma/client";
import { useProjectTasks } from "@/features/projects/hooks/use-tasks";
import { useRecentTasks } from "@/features/tasks/hooks/use-recent-tasks";
import { TaskPriorityBadge } from "@/features/tasks/components/task-priority-badge";
import { shortId } from "@/lib/utils";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { UserAvatar } from "@/components/user/user-menu";
import Link from "next/link";
import { DataLoader } from "@/components/data-loader";
import { useActiveTasks } from "@/features/tasks/hooks/use-active-tasks";
import { CBadge } from "@/components/common/cbadge";
import { Typography } from "@/components/ui/typography";

const stats = [
  {
    title: "Active Issues",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: AlertCircle,
  },
  {
    title: "Completed This Week",
    value: "18",
    change: "+8%",
    trend: "up",
    icon: CheckCircle2,
  },
  {
    title: "Active Projects",
    value: "6",
    change: "0%",
    trend: "neutral",
    icon: FolderOpen,
  },
  {
    title: "Team Members",
    value: "12",
    change: "+2",
    trend: "up",
    icon: Users,
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const companyId = session?.user?.company.id;

  const { data: projects, isLoading: isLoadingProjects } =
    useProjects(companyId);

  const { data: recentTasks, isLoading: isLoadingRecentTasks } = useRecentTasks(
    {
      companyId: companyId,
    }
  );

  const { data: activeTasks, isLoading: isLoadingActiveTasks } = useActiveTasks(
    {
      companyId: companyId,
    }
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's what's happening with your projects."
          actions={
            <>
              {/* <ButtonLink
              href={routes.projects.tasks.new()}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </ButtonLink> */}
              {projects && <CreateTask projects={projects} />}
            </>
          }
        />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* active tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Tasks
              </CardTitle>
              <LayoutList className="h-4 w-4 text-muted-foreground" />
              {/* <stat.icon className="h-4 w-4 text-muted-foreground" /> */}
            </CardHeader>
            <CardContent>
              <Typography as="p" variant="2xl/bold">
                {activeTasks?.length}
              </Typography>
              <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <TaskStatusBadge status="TO_DO" size="sm" />
                <TaskStatusBadge status="IN_PROGRESS" size="sm" />
                {/* {stat.trend === "up" && (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                )} */}
                {/* <span
                  className={
                    stat.trend === "up"
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }
                >
                  {stat.change}
                </span> */}
                {/* {" from last week"} */}
              </p>
            </CardContent>
          </Card>
          {/* {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" && (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  )}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {stat.change}
                  </span>
                  {" from last week"}
                </p>
              </CardContent>
            </Card>
          ))} */}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Issues */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Tasks</CardTitle>
                  <CardDescription>
                    Latest updates on your team&apos;s work
                  </CardDescription>
                </div>
                <ButtonLink
                  href={routes.projects.index()}
                  variant="outline"
                  size="sm"
                >
                  View All
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </ButtonLink>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <DataLoader data={recentTasks} isLoading={isLoadingRecentTasks}>
                {(data) => (
                  <>
                    {data?.map((task) => (
                      <div
                        key={task.id}
                        className="group relative flex items-center space-x-4 rounded-lg border p-3 hover:bg-popover"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              {shortId(task.id)}
                            </span>

                            <TaskPriorityBadge
                              priority={task.priority}
                              size="sm"
                            />
                          </div>
                          <p className="text-sm font-medium">{task.title}</p>
                          {/* <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{task.project}</span>
                      <span>•</span>
                      <span>{task.updatedAt}</span>
                    </div> */}
                        </div>
                        <div className="flex items-center space-x-2">
                          <TaskStatusBadge status={task.status} size="sm" />

                          <UserAvatar user={task.assignee} size="sm" />

                          {/* <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={task.assignee.image || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-xs">
                        {task.assignee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar> */}
                        </div>

                        <ArrowUpRight className="hidden h-4 w-4 text-muted-foreground group-hover:absolute group-hover:right-1 group-hover:top-1 group-hover:block" />
                        <Link
                          href={routes.projects.tasks.details({
                            projectId: task.projectId,
                            taskId: task.id,
                          })}
                          className="absolute inset-0"
                        >
                          <span className="sr-only">view task</span>
                        </Link>
                      </div>
                    ))}
                  </>
                )}
              </DataLoader>
            </CardContent>
          </Card>

          {/* Project Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Progress</CardTitle>
                  <CardDescription>
                    Track your team&apos;s project milestones
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <DataLoader data={projects} isLoading={isLoadingProjects}>
                {(data) => (
                  <>
                    {data?.map((project) => {
                      const completedTasks = project.tasks.filter(
                        (task) => task.status === TaskStatus.COMPLETED
                      );

                      const totalTasks = project.tasks.length;

                      const completedPercentage =
                        (completedTasks.length / totalTasks) * 100;

                      const projectProgress = Math.round(completedPercentage);

                      // const dueDate = new Date(project.dueDate);

                      return (
                        <div key={project.name} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">
                                {project.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {completedTasks?.length}/{totalTasks} tasks
                                completed
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {projectProgress}%
                              </p>
                              {/* <p className="text-xs text-muted-foreground">
                          Due {project.dueDate}
                        </p> */}
                            </div>
                          </div>
                          <Progress value={projectProgress} className="h-2" />
                          <div className="flex items-center justify-end text-xs text-muted-foreground">
                            <Link
                              href={routes.projects.details({
                                projectId: project.id,
                              })}
                            >
                              <CBadge color="gray" size="sm">
                                View
                                <ArrowUpRight className="ml-1 h-3 w-3" />
                              </CBadge>
                            </Link>
                            {/* <span className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {project.team} members
                      </span> */}
                            {/* <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {project.dueDate}
                      </span> */}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </DataLoader>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const companyId = userSession.user.company.id;

  return {
    props: {
      companyId,
    },
  };
};
