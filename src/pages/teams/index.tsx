/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
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
import { api } from "@/utils/api";
import { TaskStatus } from "@/utils/enums";
import { CreateTeam } from "@/components/views/teams/forms/create-team";
import { getTeamLink } from "@/utils/links";
import Link from "next/link";
import { TeamDetailLoader } from "@/components/views/teams/team-detail-loader";

const teams = [
  {
    id: 1,
    name: "Engineering",
    description: "Core product development and infrastructure",
    members: [
      {
        name: "John Doe",
        avatar: "https://avatar.vercel.sh",
        role: "Lead",
      },
      {
        name: "Jane Smith",
        avatar: "https://avatar.vercel.sh",
        role: "Developer",
      },
      {
        name: "Mike Johnson",
        avatar: "https://avatar.vercel.sh",
        role: "Developer",
      },
      {
        name: "Sarah Wilson",
        avatar: "https://avatar.vercel.sh",
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
        avatar: "https://avatar.vercel.sh",
        role: "Lead",
      },
      {
        name: "Alex Rodriguez",
        avatar: "https://avatar.vercel.sh",
        role: "Designer",
      },
      {
        name: "Lisa Park",
        avatar: "https://avatar.vercel.sh",
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
        avatar: "https://avatar.vercel.sh",
        role: "Lead",
      },
      {
        name: "Rachel Green",
        avatar: "https://avatar.vercel.sh",
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
        avatar: "https://avatar.vercel.sh",
        role: "Lead",
      },
      {
        name: "Anna Davis",
        avatar: "https://avatar.vercel.sh",
        role: "Specialist",
      },
      {
        name: "Chris Lee",
        avatar: "https://avatar.vercel.sh",
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

const teamStats = [
  {
    title: "Total Teams",
    value: "4",
    change: "+1",
    trend: "up",
    icon: Users,
  },
  {
    title: "Total Members",
    value: "12",
    change: "+2",
    trend: "up",
    icon: UserPlus,
  },
  {
    title: "Active Projects",
    value: "11",
    change: "+3",
    trend: "up",
    icon: FolderOpen,
  },
  {
    title: "Issues Completed",
    value: "29",
    change: "+15%",
    trend: "up",
    icon: CheckCircle2,
  },
];

export default function TeamsContent({ companyId }: { companyId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
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
    return <div>no...</div>;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
              <p className="text-muted-foreground">
                Manage your teams, members, and collaboration.
              </p>
            </div>
            <CreateTeam />
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {teamStats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
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
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search teams..."
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
                          <div className="flex items-center space-x-3">
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
                                <Settings className="mr-2 h-4 w-4" />
                                Team Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Member
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FolderOpen className="mr-2 h-4 w-4" />
                                View Projects
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">Members</span>
                            <span className="text-sm text-muted-foreground">
                              {team.users.length}
                            </span>
                          </div>
                          <div className="flex -space-x-2">
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
                              Projects
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
                              Active Issues
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
                              Completed
                            </div>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="flex items-center justify-between border-t pt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Activity className="mr-1 h-3 w-3" />
                            Last activity
                            {/* {team.recentActivity} */}2
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            asChild
                          >
                            <Link href={getTeamLink(team.id)}>
                              View Details
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
                    <CardTitle>Team Performance</CardTitle>
                    <CardDescription>Issues completed by team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {teams?.map((team) => (
                      <div key={team.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
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
                            issues
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
                    <CardTitle>Team Workload Distribution</CardTitle>
                    <CardDescription>
                      Current active issues across teams
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
                              <div className="flex items-center space-x-2">
                                <div className={`h-2 w-2 rounded-full`} />
                                <span className="text-sm font-medium">
                                  {team.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">
                                  {/* {team.activeIssues} issues */}
                                  {
                                    team.tasks.filter(
                                      (task) =>
                                        task.status === TaskStatus.IN_PROGRESS
                                    ).length
                                  }{" "}
                                  {team.tasks.length > 1 ? "tasks" : "task"}
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

  return {
    props: {},
  };
};
