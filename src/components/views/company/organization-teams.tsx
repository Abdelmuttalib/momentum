/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Team, User } from "@prisma/client";
import { api } from "@/utils/api";
import { toast } from "sonner";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserAvatar } from "@/components/user/user-menu";
import { UserPlusIcon } from "@heroicons/react/20/solid";
import { cn } from "@/utils/cn";
import type { TTeam } from "types";
import { PlusIcon, UsersIcon } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { DialogForm } from "@/components/common/dialog-form";

export function AddUserDialog({ team }: { team: TTeam }) {
  const apiContext = api.useContext();
  const { data: users } = api.team.getAllUsers.useQuery();

  const { data: companyMembers } = api.company.getCompanyMembers.useQuery();

  const [teamUserIds, setTeamUserIds] = useState(
    team.users.map((user: User) => user.id)
  );

  useEffect(() => {
    const teamUserIds = team?.users.map((user: User) => user.id);
    setTeamUserIds(teamUserIds);
  }, [team]);

  const addUserToTeamMutation = api.team.addUserToTeam.useMutation({
    onSuccess: async () => {
      // await apiContext.team.admin.getAllUsers.invalidate();
      await apiContext.team.getAllTeamsByCompanyId.invalidate();
      await apiContext.team.getAllUsers.invalidate();
      await apiContext.company.getCompanyMembersNotInTeam.invalidate();
      await apiContext.team.getTeam.invalidate();
      toast.success("User added to team successfully");
    },
    onError: () => {
      toast.error("Failed to add user to team");
    },
  });

  const removeUserFromTeam = api.team.removeUserFromTeam.useMutation({
    onSuccess: async () => {
      // await apiContext.team.admin.getAllUsers.invalidate();
      await apiContext.team.getAllTeamsByCompanyId.invalidate();
      toast.success("User removed from team successfully");
    },
    onError: () => {
      toast.error("Failed to remove user from team");
    },
  });

  const checkIfUserIsInTeam = (userId: User["id"]) => {
    return teamUserIds.includes(userId);
  };

  return (
    <>
      <DialogForm
        title="Add a new Member to the Team"
        description=" manage team members and access to each team"
        triggerButton={
          <Button
            type="button"
            className="ml-2 inline-flex gap-1 whitespace-nowrap"
          >
            <UsersIcon className="w-[1.125rem]" />
            Manage Team Members
          </Button>
        }
        dialogContentClassName="sm:max-w-lg"
      >
        {({ onClose }) => (
          <div>
            <div className="flex flex-col gap-y-3">
              {companyMembers?.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-2 rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-x-2">
                      <div className="flex items-center gap-x-0.5 -space-x-2">
                        <UserAvatar key={user.id} user={user} size="lg" />
                      </div>
                      <div>
                        <Typography as="p" variant="base/medium">
                          {user.name}
                        </Typography>
                        <Typography
                          as="p"
                          variant="sm/normal"
                          className="text-muted-foreground"
                        >
                          {user.email}
                        </Typography>
                      </div>
                    </div>
                    <div>
                      {checkIfUserIsInTeam(user.id) ? (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive-outline"
                            disabled={removeUserFromTeam.isLoading}
                            isLoading={removeUserFromTeam.isLoading}
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onClick={async () => {
                              await removeUserFromTeam.mutateAsync({
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                                teamId: team.id,
                                userId: user.id,
                              });
                            }}
                          >
                            Remove
                          </Button>
                          <Button size="sm" disabled>
                            Added
                          </Button>
                        </div>
                      ) : (
                        <Button
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={async () => {
                            await addUserToTeamMutation.mutateAsync({
                              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                              teamId: team.id,
                              userId: user.id,
                            });
                          }}
                          className="whitespace-nowrap"
                          size="sm"
                          disabled={addUserToTeamMutation.isLoading}
                          isLoading={addUserToTeamMutation.isLoading}
                        >
                          <UserPlusIcon className="w-4" />
                          Add to Team
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogForm>
    </>
  );
}

// const deleteTeamMutation = api.team.deleteTeam.useMutation({
//   onSuccess: async () => {
//     toast.success("Team deleted");
//     await apiContext.team.admin.getAllTeamsByCompanyId.invalidate();
//     // api.team.allTeams.refetch(); // if you have getTeams query
//   },
//   onError: (error) => {
//     toast.error(error.message);
//   },
// });
// async function onDeleteClick(teamId: string) {
//   await deleteTeamMutation.mutateAsync({ id: teamId });
// }

export const companyTeamsColumns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: "Team Name",
  },
  {
    accessorKey: "id",
    header: "Projects",
    cell: ({ row: { original } }) => {
      const team = original as TTeam;
      const teamProjects = team?.projects;
      return (
        <div className="flex items-center gap-x-2">
          {teamProjects.map((project) => (
            <Link
              key={project.id}
              href={`/teams/${project.teamId}/projects/${project.id}`}
              className="link"
            >
              {project.name},
            </Link>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "users",
    header: "Team Members",
    cell: ({ row: { original } }) => {
      const team = original as TTeam;
      const teamUsers = team.users;
      return (
        <div className="flex items-center gap-x-0.5 -space-x-2">
          {teamUsers.map((user) => (
            <UserAvatar key={user.id} user={user} size="lg" />
            // <p key={user.id}>{user.email},</p>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row: { original } }) => {
      // const apiContext = api.useContext();
      // const deleteTeamMutation = api.team.deleteTeam.useMutation({
      //   onSuccess: async () => {
      //     await apiContext.team.admin.getAllTeamsByCompanyId.invalidate();
      //     toast.success("Team deleted");
      //     // api.team.allTeams.refetch(); // if you have getTeams query
      //   },
      //   onError: (error) => {
      //     toast.error(error.message);
      //   },
      // });
      // async function onDeleteClick(teamId: string) {
      //   await deleteTeamMutation.mutateAsync({ id: teamId });
      // }
      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/teams/${original.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "h-full px-3 py-2 text-sm"
            )}
          >
            View
          </Link>
          <AddUserDialog team={original as TTeam} />
          {/* <Button
            type="button"
            size="sm"
            variant="destructive-outline"
            className="h-9"
            disabled={deleteTeamMutation.isLoading}
            isLoading={deleteTeamMutation.isLoading}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => onDeleteClick(original.id)}
          >
            {deleteTeamMutation.isLoading ? "Deleting team" : "Delete team"}
          </Button> */}
        </div>
      );
    },
  },
];
