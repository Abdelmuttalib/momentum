import type { GetServerSideProps } from "next";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  UserPlus,
  MoreHorizontal,
  FolderOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Mail,
  Crown,
  Shield,
  Edit,
  Trash2,
  ArrowLeft,
  Clock1,
} from "lucide-react";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";
import {
  DashboardPageDescription,
  DashboardPageSubTitle,
} from "@/components/common/dashboard-header";
import { getTeamProjectLink, getTeamsLink } from "@/utils/links";

import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import { Seo } from "@/components/seo";
import { AppLayout } from "@/components/layout/app-layout";
import { TeamDetailLoader } from "@/components/views/teams/team-detail-loader";
import { RichBadge } from "@/components/ui/rich-badge";
import {
  getInviteStatusBadgeColor,
  getUserRoleBadgeColor,
} from "@/utils/getBadgeColor";
import { CreateInvite } from "@/components/views/company/invitations/create-invite";
import { Role } from "@prisma/client";
import { CreateProject } from "@/components/views/projects/create-project";
import {
  formatFullDate,
  formatShortDate,
  formatShortDateWithYear,
} from "@/utils/date";
import { CreateLabel } from "@/components/views/project/tasks/forms/create-label";
import { getUserInitials } from "@/utils/user";

interface TeamPageProps {
  companyId: string;
  teamId: string;
}

export default function TeamPage({ teamId }: TeamPageProps) {
  const {
    data: team,
    isLoading: isLoadingTeamData,
    error: teamError,
  } = api.team.getTeam.useQuery({
    teamId: teamId,
  });

  const { data: invitations } = api.company.getAllInvitations.useQuery();

  console.log("team", team);
  console.log("invitations", invitations);

  if (!isLoadingTeamData && !team) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">Team not found</h2>
            <p className="mb-4 text-muted-foreground">
              The team you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href={getTeamsLink()}>
              <Button>Back to Teams</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (isLoadingTeamData) {
    return (
      <AppLayout>
        <TeamDetailLoader />
      </AppLayout>
    );
  }

  return (
    <>
      <Seo title="Projects" />

      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div>
                  <Typography as="h1" variant="2xl/semibold">
                    Team: {team.name}
                  </Typography>
                  <Typography
                    as={"p"}
                    variant={"base/normal"}
                    className="text-muted-foreground"
                  >
                    {team.description}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* <Dialog
                open={isInviteDialogOpen}
                onOpenChange={setIsInviteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join the {team.name} team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="colleague@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select defaultValue="user">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Member</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsInviteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setIsInviteDialogOpen(false)}>
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog> */}

              {/* <div className="flex w-full items-center justify-end"> */}
              <CreateProject teamId={teamId} />
              <CreateLabel />
              {/* </div> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Team
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Team Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Issues
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {/* {team.stats.totalIssues} */}6
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.projects.length}</div>
                <p className="text-xs text-muted-foreground">Active Projects</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">
                Members ({team.users.length})
              </TabsTrigger>
              <TabsTrigger value="projects">
                Projects ({team.projects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="flex flex-col gap-6">
                <div>
                  <DashboardPageSubTitle>Active Projects</DashboardPageSubTitle>
                  <DashboardPageDescription>
                    Current projects assigned to this team
                  </DashboardPageDescription>
                </div>
                <div className="space-y-6">
                  {team.projects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{project.name}</h3>
                          </div>
                          <div className="inline-flex items-center text-sm text-muted-foreground">
                            <Typography
                              as="span"
                              variant="xs/normal"
                              className="text-muted-foreground"
                            >
                              Created{" "}
                              {formatShortDateWithYear(project.createdAt)}
                            </Typography>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {project.description}
                        </p>
                        {/* <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div> */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>
                              {/* {project.}/{project.issues.total}{" "} */}
                              issues completed
                            </span>
                            <span>
                              {/* {project.issues.inProgress} */}
                              in progress
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={getTeamProjectLink(teamId, project.id)}>
                              View Project
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Team Members Preview */}
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <DashboardPageSubTitle>
                        Team Members
                      </DashboardPageSubTitle>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/teams/${teamId}?tab=members`}>
                          View All
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-4">
                    {team.users.map((user) => (
                      <Card key={user.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-x-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={`https://avatar.vercel.sh/${user.email}${user.id}`}
                              />
                              <AvatarFallback>
                                {getUserInitials(user)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium">
                                  {user.name}
                                </p>
                                <Badge variant="secondary">{user.role}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Projects Overview */}
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <DashboardPageSubTitle>
                        Team Members
                      </DashboardPageSubTitle>
                      <DashboardPageDescription>
                        Manage team members and their roles
                      </DashboardPageDescription>
                    </div>
                    <CreateInvite />
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite Member
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="space-y-4">
                    {team.users.map((user) => (
                      <Card
                        key={user.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${user.id}`}
                            />
                            <AvatarFallback>
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{user.name}</p>
                              {getUserRoleBadgeColor(user.role)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                            {/* <p className="text-xs text-muted-foreground">
                              {user.role} • Joined {user.joinedAt} • Last seen{" "}
                              {user.lastSeen}
                            </p> */}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Select defaultValue={user.role}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(Role).map((role) => (
                                <SelectItem
                                  key={role}
                                  value={role}
                                  className="capitalize"
                                >
                                  <RichBadge
                                    color={getUserRoleBadgeColor(role)}
                                    className="capitalize"
                                  >
                                    {role}
                                  </RichBadge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Member Settings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove from Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <DashboardPageSubTitle>Invitations</DashboardPageSubTitle>
                      <DashboardPageDescription>
                        invite new members to your company
                      </DashboardPageDescription>
                    </div>
                    <CreateInvite />
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                    {invitations.map((invitation) => (
                      <Card
                        key={invitation.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${invitation.email}${invitation.id}`}
                            />
                            <AvatarFallback>
                              {invitation.email?.[0]}
                              {/* {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")} */}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{invitation.email}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              invited •{" "}
                              {formatShortDateWithYear(invitation.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RichBadge
                            color={getUserRoleBadgeColor(invitation.role)}
                            className="capitalize"
                          >
                            {invitation.role}
                          </RichBadge>

                          <RichBadge
                            color={getInviteStatusBadgeColor(invitation.status)}
                            className="rounded-md capitalize"
                          >
                            {invitation.status}
                          </RichBadge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <DashboardPageSubTitle>Team Projects</DashboardPageSubTitle>
                  <DashboardPageDescription>
                    Projects assigned to the {team.name} team
                  </DashboardPageDescription>
                </div>
                <Button>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>
              <div className="space-y-6">
                {team.projects.map((project) => (
                  <div
                    key={project.id}
                    className="space-y-4 rounded-lg border p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium">{project.name}</h3>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Project Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Archive Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-muted-foreground">
                      {project.description}
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="rounded bg-muted/50 p-2 text-center">
                          <div className="font-medium text-green-600">
                            {/* {project.issues.completed} */}
                          </div>
                          <div className="text-muted-foreground">Completed</div>
                        </div>
                        <div className="rounded bg-muted/50 p-2 text-center">
                          <div className="font-medium text-blue-600">
                            {/* {project.issues.inProgress} */}
                          </div>
                          <div className="text-muted-foreground">
                            In Progress
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        Created {new Date(project.createdAt).toDateString()}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={getTeamProjectLink(
                            teamId,
                            project.id.toString()
                          )}
                        >
                          View Project
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Edit Team Dialog */}
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Team</DialogTitle>
                <DialogDescription>
                  Update team information and settings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input id="teamName" defaultValue={team.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamDescription">Description</Label>
                  <Input id="teamDescription" defaultValue={team.description} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamColor">Team Color</Label>
                  <Select defaultValue="blue">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  // onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                // onClick={() => setIsEditDialogOpen(false)}
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const teamId = params?.teamId as string;

  return {
    props: {
      teamId,
    },
  };
};
