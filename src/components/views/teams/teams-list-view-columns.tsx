import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user/user-menu";
import { getProjectLink, getTeamLink } from "@/lib/links";
import { getUserName } from "@/lib/user";
import type { Project } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { Image } from "lucide-react";
import Link from "next/link";
import { type TTeam } from "types";

export const teamsListViewColumns: ColumnDef<TTeam>[] = [
  {
    accessorKey: "id",
    // return icon as header
    header: () => {
      return <Image className="h-5 w-5 text-muted-foreground" />;
    },
    cell: ({ row: { original } }) => {
      const team = original;
      return (
        <p>
          <Avatar className="h-6 w-6 rounded-sm">
            <AvatarImage
              src={`https://avatar.vercel.sh/${team.name}.png`}
              alt={team.name}
            />
            <AvatarFallback className="h-6 w-6 rounded-sm bg-gradient-to-br from-primary to-primary/50"></AvatarFallback>
          </Avatar>
        </p>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "projects",
    header: "Projects",
    cell: ({ row: { original } }) => {
      const team = original;
      return (
        <span className="space-x-1">
          {team?.projects?.map((project: Project) => (
            <Link key={project.id} href={getProjectLink(team.id, project.id)}>
              <Badge
                color="blue"
                className="rounded"
                // title={project.name}
                // style={{ cursor: "pointer" }}
              >
                {project.name}
              </Badge>
            </Link>
          ))}
        </span>
      );
    },
  },
  {
    accessorKey: "users",
    header: "Members",
    cell: ({ row: { original } }) => {
      const team = original;
      return (
        <span className="inline-flex items-center space-x-1">
          {/* avatar */}
          {team?.users?.map((user) => {
            const userFullName = getUserName(user);

            return (
              <UserAvatar
                key={`teams-page-user-avatar-${user.id}`}
                user={user}
              />
            );
          })}
        </span>
      );
    },
  },
  // actions
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ row: { original } }) => {
      const team = original;
      return (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" asChild>
            <Link href={getTeamLink(team.id)}>View</Link>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link href={getTeamLink(team.id)}>View</Link>
          </Button>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Created At",
  //   cell: ({ row: { original } }) => {
  //     const team = original;
  //     return (
  //       <p>{formatShortDateWithYear(team?.createdAt as unknown as string)}</p>
  //     );
  //   },
  // },
];
