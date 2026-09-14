/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { GetServerSideProps } from "next";
import { requireAuthPage } from "@/server/auth-guard";
import { Seo } from "@/components/seo";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Search,
  MoreHorizontal,
  Settings,
  UserPlus,
  FolderOpen,
  CheckCircle2,
  Clock,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppLayout } from "@/components/layout/app-layout";
import { CompactPageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { api } from "@/lib/api";
import { TaskStatus } from "@/lib/enums";
import { CreateTeam } from "@/components/views/teams/forms/create-team";
import { getTeamLink } from "@/lib/links";
import Link from "next/link";
import { TeamDetailLoader } from "@/components/views/teams/team-detail-loader";
import { getAvatarUrl } from "@/lib/avatar";
import { useTranslations } from "next-intl";

const teams = [
  {
    id: 1,
    name: "Engineering",
    description: "Core product development and infrastructure",
    members: [
      {
        name: "John Doe",
        avatar: getAvatarUrl(""),
        role: "Lead",
      },
      {
        name: "Jane Smith",
        avatar: getAvatarUrl(""),
        role: "Developer",
      },
      {
        name: "Mike Johnson",
        avatar: getAvatarUrl(""),
        role: "Developer",
      },
      {
        name: "Sarah Wilson",
        avatar: getAvatarUrl(""),
        role: "Developer",
      },
    ],
    projects: 4,
    activeIssues: 23,
    completedThisWeek: 12,
    color: "bg-blue-500",
    recentActivity: "2 hours ago",
  },
  {
    id: 2,
    name: "Design",
    description: "User experience and visual design",
    members: [
      {
        name: "Emily Chen",
        avatar: getAvatarUrl(""),
        role: "Lead",
      },
      {
        name: "Alex Rodriguez",
        avatar: getAvatarUrl(""),
        role: "Designer",
      },
      {
        name: "Lisa Park",
        avatar: getAvatarUrl(""),
        role: "Designer",
      },
    ],
    projects: 2,
    activeIssues: 8,
    completedThisWeek: 5,
    color: "bg-purple-500",
    recentActivity: "4 hours ago",
  },
  {
    id: 3,
    name: "Product",
    description: "Product strategy and roadmap planning",
    members: [
      {
        name: "David Kim",
        avatar: getAvatarUrl(""),
        role: "Lead",
      },
      {
        name: "Rachel Green",
        avatar: getAvatarUrl(""),
        role: "Manager",
      },
    ],
    projects: 3,
    activeIssues: 15,
    completedThisWeek: 8,
    color: "bg-green-500",
    recentActivity: "1 day ago",
  },
  {
    id: 4,
    name: "Marketing",
    description: "Growth, content, and brand marketing",
    members: [
      {
        name: "Tom Brown",
        avatar: getAvatarUrl(""),
        role: "Lead",
      },
      {
        name: "Anna Davis",
        avatar: getAvatarUrl(""),
        role: "Specialist",
      },
      {
        name: "Chris Lee",
        avatar: getAvatarUrl(""),
        role: "Specialist",
      },
    ],
    projects: 2,
    activeIssues: 6,
    completedThisWeek: 4,
    color: "bg-orange-500",
    recentActivity: "3 hours ago",
  },
];

const teamStats: {
  key: "totalTeams" | "totalMembers" | "activeProjects" | "issuesCompleted";
  value: string;
  change: string;
  trend: string;
  icon: typeof Users;
}[] = [
  {
    key: "totalTeams",
    value: "4",
    change: "+1",
    trend: "up",
    icon: Users,
  },
  {
    key: "totalMembers",
    value: "12",
    change: "+2",
    trend: "up",
    icon: UserPlus,
  },
  {
    key: "activeProjects",
    value: "11",
    change: "+3",
    trend: "up",
    icon: FolderOpen,
  },
  {
    key: "issuesCompleted",
    value: "29",
    change: "+15%",
    trend: "up",
    icon: CheckCircle2,
  },
];

export default function TeamsContent({ companyId }: { companyId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("teams");
  const tNav = useTranslations("navigation");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // const filteredTeams = teams.filter(
  //   (team) =>
  //     team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     team.description.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const {
    data: teams,
    isLoading: isLoadingTeams,
    error: teamsError,
  } = api.team.getAllTeamsByCompanyId.useQuery();

  const filteredTeams = teams || [];

  if (!isLoadingTeams && !teamsError && !teams) {
    return (
      <AppLayout>
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={<CreateTeam />}
        />
      </AppLayout>
    );
  }

  if (isLoadingTeams) {
    return (
      <AppLayout>
        <TeamDetailLoader />
      </AppLayout>
    );
  }

  return (
    <>
      <Seo title="Teams | Momentum" />

      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <CompactPageHeader
            title={tNav("teams")}
            description={t("description")}
            actions={<CreateTeam />}
          />

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {teamStats.map((stat) => (
              <Card key={stat.key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t(stat.key)}
                  </CardTitle>
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
                <TabsTrigger value="analytics">{t("analytics")}</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-8"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTeams &&
                  filteredTeams.map((team) => (
                    <Card
                      key={team.id}
                      className="cursor-pointer transition-shadow hover:shadow-md"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-md border bg-muted/40 p-2">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {team.name}
                              </CardTitle>
                              {/* <CardDescription>
                                {team.description}
                              </CardDescription> */}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Settings className="me-2 h-4 w-4" />
                                {t("teamSettings")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserPlus className="me-2 h-4 w-4" />
                                {t("addMember")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FolderOpen className="me-2 h-4 w-4" />
                                {t("viewProjects")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">{t("members")}</span>
                            <span className="text-sm text-muted-foreground">
                              {team.users.length}
                            </span>
                          </div>
                          <div className="flex -gap-2">
                            {team.users.map((member, index) => (
                              <Avatar
                                key={index}
                                className="h-8 w-8 border-2 border-background"
                              >
                                <AvatarImage
                                  src={`https://avatar.vercel.sh/${index}`}
                                />
                                {/* <AvatarFallback className="text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback> */}
                              </Avatar>
                            ))}

                            {team.users.length > 4 && (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted">
                                <span className="text-xs font-medium">
                                  +{team.users.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Team Stats */}
                        <div className="grid grid-cols-3 gap-4 border-t pt-2">
                          <div className="text-center">
                            <div className="text-lg font-semibold">
                              {team.projects.length}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("projects")}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold">
                              {
                                team.tasks.filter(
                                  (task) =>
                                    task.status === TaskStatus.IN_PROGRESS
                                ).length
                              }
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("activeIssues")}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold">
                              {
                                team.tasks.filter(
                                  (task) => task.status === TaskStatus.COMPLETED
                                ).length
                              }
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("completed")}
                            </div>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="flex items-center justify-between border-t pt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Activity className="me-1 h-3 w-3" />
                            {t("lastActivity")}
                            {/* {team.recentActivity} */}2
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            asChild
                          >
                            <Link href={getTeamLink(team.id)}>
                              {t("viewDetails")}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("performanceTitle")}</CardTitle>
                    <CardDescription>{t("performanceDescription")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {teams?.map((team) => (
                      <div key={team.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full`} />
                            <span className="text-sm font-medium">
                              {team.name}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {
                              team.tasks.filter(
                                (task) => task.status === TaskStatus.COMPLETED
                              ).length
                            }{" "}
                            {t("issues")}
                          </span>
                        </div>
                        <Progress
                          value={
                            ((team.tasks.filter(
                              (task) => task.status === TaskStatus.COMPLETED
                            ).length *
                              4) /
                              100) *
                            100
                          }
                          // value={((team.completedThisWeek * 4) / 100) * 100}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("workloadTitle")}</CardTitle>
                    <CardDescription>
                      {t("workloadDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teams?.map((team) => {
                        const activeTasks = team.tasks.filter(
                          (task) => task.status === TaskStatus.IN_PROGRESS
                        );

                        const totalTasks = team.tasks.length;

                        const percentage =
                          (activeTasks.length / totalTasks) * 100;

                        return (
                          <div key={team.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full`} />
                                <span className="text-sm font-medium">
                                  {team.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {/* {team.activeIssues} issues */}
                                  {
                                    team.tasks.filter(
                                      (task) =>
                                        task.status === TaskStatus.IN_PROGRESS
                                    ).length
                                  }{" "}
                                  {team.tasks.length > 1 ? t("tasks") : t("task")}
                                </span>
                                <span className="text-sm font-medium">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage();
