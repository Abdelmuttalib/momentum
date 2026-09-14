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
  Users,
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
import { Heading, Text } from "@/components/typography";
import { EmptyState } from "@/components/common/empty-state";
import {
  DashboardPageDescription,
  DashboardPageSubTitle,
} from "@/components/common/dashboard";
import { getTeamProjectLink, getTeamsLink } from "@/lib/links";

import { requireAuthPage } from "@/server/auth-guard";
import { api } from "@/lib/api";
import { Seo } from "@/components/seo";
import { AppLayout } from "@/components/layout/app-layout";
import { TeamDetailLoader } from "@/components/views/teams/team-detail-loader";
import { RichBadge } from "@/components/ui/rich-badge";
import {
  getInviteStatusBadgeColor,
  getUserRoleBadgeColor,
} from "@/lib/getBadgeColor";
import { CreateInvite } from "@/components/views/company/invitations/create-invite";
import { Role } from "@prisma/client";
import { CreateProject } from "@/components/views/projects/create-project";
import {
  formatFullDate,
  formatShortDate,
  formatShortDateWithYear,
} from "@/lib/date";
import { CreateLabel } from "@/components/views/project/tasks/forms/create-label";
import { getUserInitials } from "@/lib/user";
import { useTranslations } from "next-intl";

interface TeamPageProps {
  companyId: string;
  teamId: string;
}

export default function TeamPage({ teamId }: TeamPageProps) {
  const t = useTranslations("teams");
  const tCommon = useTranslations("common");
  const {
    data: team,
    isLoading: isLoadingTeamData,
    error: teamError,
  } = api.team.getTeam.useQuery({
    teamId: teamId,
  });

  const { data: invitations } = api.company.getAllInvitations.useQuery();

  if (!isLoadingTeamData && !team) {
    return (
      <AppLayout>
        <EmptyState
          title={t("notFoundTitle")}
          description={t("notFoundDescription")}
          action={
            <Link href={getTeamsLink()}>
              <Button>{t("backToTeams")}</Button>
            </Link>
          }
        />
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <Heading level="page">{t("teamTitle", { name: team.name })}</Heading>
                  <Text size="sm" tone="muted">
                    {team.description}
                  </Text>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* <Dialog
                open={isInviteDialogOpen}
                onOpenChange={setIsInviteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="me-2 h-4 w-4" />
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
                  <div className="mt-6 flex justify-end gap-2">
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
                    <Edit className="me-2 h-4 w-4" />
                    {t("editTeam")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="me-2 h-4 w-4" />
                    {t("teamSettings")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="me-2 h-4 w-4" />
                    {t("deleteTeam")}
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
                  {t("activeProjects")}
                </CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.projects.length}</div>
                <p className="text-xs text-muted-foreground">{t("activeProjectsHint")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("members")}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.users.length}</div>
                <p className="text-xs text-muted-foreground">{t("teamMembersHint")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
              <TabsTrigger value="members">
                {t("membersTab", { count: team.users.length })}
              </TabsTrigger>
              <TabsTrigger value="projects">
                {t("projectsTab", { count: team.projects.length })}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="flex flex-col gap-6">
                <div>
                  <DashboardPageSubTitle>{t("activeProjects")}</DashboardPageSubTitle>
                  <DashboardPageDescription>
                    {t("overviewDescription")}
                  </DashboardPageDescription>
                </div>
                <div className="space-y-6">
                  {team.projects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{project.name}</h3>
                          </div>
                          <div className="inline-flex items-center text-sm text-muted-foreground">
                            <Typography
                              as="span"
                              variant="xs/normal"
                              className="text-muted-foreground"
                            >
                              {t("createdLabel", {
                                date: formatShortDateWithYear(project.createdAt),
                              })}
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
                          <div className="flex items-center gap-4">
                            <span>
                              {/* {project.}/{project.issues.total}{" "} */}
                              {t("issuesCompletedLabel")}
                            </span>
                            <span>
                              {/* {project.issues.inProgress} */}
                              {t("inProgressLabel")}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={getTeamProjectLink(teamId, project.id)}>
                              {t("viewProject")}
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
                        {t("teamMembers")}
                      </DashboardPageSubTitle>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/teams/${teamId}?tab=members`}>
                          {t("viewAll")}
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
                              <div className="flex items-center gap-2">
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
                        {t("teamMembers")}
                      </DashboardPageSubTitle>
                      <DashboardPageDescription>
                        {t("manageMembersDescription")}
                      </DashboardPageDescription>
                    </div>
                    <CreateInvite />
                    <Button>
                      <UserPlus className="me-2 h-4 w-4" />
                      {t("inviteMember")}
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
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${user.id}`}
                            />
                            <AvatarFallback>
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2">
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
                                <Mail className="me-2 h-4 w-4" />
                                {t("sendMessage")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="me-2 h-4 w-4" />
                                {t("memberSettings")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="me-2 h-4 w-4" />
                                {t("removeFromTeam")}
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
                      <DashboardPageSubTitle>{t("invitations")}</DashboardPageSubTitle>
                      <DashboardPageDescription>
                        {t("invitationsDescription")}
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
                        <div className="flex items-center gap-4">
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
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{invitation.email}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {t("invitedLabel", {
                                date: formatShortDateWithYear(invitation.createdAt),
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
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
                  <DashboardPageSubTitle>{t("teamProjects")}</DashboardPageSubTitle>
                  <DashboardPageDescription>
                    {t("teamProjectsDescription", { name: team.name })}
                  </DashboardPageDescription>
                </div>
                <Button>
                  <FolderOpen className="me-2 h-4 w-4" />
                  {t("newProject")}
                </Button>
              </div>
              <div className="space-y-6">
                {team.projects.map((project) => (
                  <div
                    key={project.id}
                    className="space-y-4 rounded-lg border p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
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
                            <Edit className="me-2 h-4 w-4" />
                            {t("editProject")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="me-2 h-4 w-4" />
                            {t("projectSettings")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="me-2 h-4 w-4" />
                            {t("archiveProject")}
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
                          <div className="text-muted-foreground">{t("completed")}</div>
                        </div>
                        <div className="rounded bg-muted/50 p-2 text-center">
                          <div className="font-medium text-blue-600">
                            {/* {project.issues.inProgress} */}
                          </div>
                          <div className="text-muted-foreground">
                            {t("inProgress")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="me-1 h-4 w-4" />
                        {t("createdLabel", {
                          date: new Date(project.createdAt).toDateString(),
                        })}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={getTeamProjectLink(
                            teamId,
                            project.id.toString()
                          )}
                        >
                          {t("viewProject")}
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
                <DialogTitle>{t("editTeam")}</DialogTitle>
                <DialogDescription>
                  {t("editTeamDescription")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">{t("teamName")}</Label>
                  <Input id="teamName" defaultValue={team.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamDescription">{t("descriptionLabel")}</Label>
                  <Input id="teamDescription" defaultValue={team.description} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamColor">{t("teamColor")}</Label>
                  <Select defaultValue="blue">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">{t("colorBlue")}</SelectItem>
                      <SelectItem value="purple">{t("colorPurple")}</SelectItem>
                      <SelectItem value="green">{t("colorGreen")}</SelectItem>
                      <SelectItem value="orange">{t("colorOrange")}</SelectItem>
                      <SelectItem value="red">{t("colorRed")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  // onClick={() => setIsEditDialogOpen(false)}
                >
                  {tCommon("cancel")}
                </Button>
                <Button
                // onClick={() => setIsEditDialogOpen(false)}
                >
                  {tCommon("saveChanges")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage(
  {},
  (ctx) => Promise.resolve({ teamId: ctx.params?.teamId as string })
);
