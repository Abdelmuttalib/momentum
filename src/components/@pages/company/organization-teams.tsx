/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Team, User } from "@prisma/client";
import { api } from "@/utils/api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type FC, useState, useEffect, ReactNode } from "react";
// import { PlusIcon } from "lucide-react";
// import { IconLink } from "@/components/ui/icon-button";
import Link from "next/link";
import { UserAvatar } from "@/components/user/UserMenu";
import {
  UserPlusIcon,
  // UsersIcon
} from "@heroicons/react/20/solid";
import { cn } from "@/utils/cn";
import type { TTeam } from "types";
import { UsersIcon } from "lucide-react";

export const AddUserDialog: FC<{ team: TTeam; triggerButton?: ReactNode }> = ({
  team,
  triggerButton = (
    <Button
      type="button"
      variant="outline"
      className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm"
    >
      <UsersIcon className="w-[1.125rem]" />
      Manage Team Members
    </Button>
  ),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const apiContext = api.useContext();
  const { data: users } = api.team.getAllUsers.useQuery();

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton}
        {/* <Button
          type="button"
          variant="outline"
          className="inline-flex items-center gap-1 whitespace-nowrap text-sm"
        >
          <UsersIcon className="w-[1.125rem]" />
          Manage Team Members
        </Button> */}
      </DialogTrigger>
      {isOpen && (
        <DialogContent className=" bg-white sm:max-w-2xl">
          <DialogHeader className="mb-6 space-y-0">
            <DialogTitle>
              <h2 className="h5 inline">Add a new Member to the Team</h2>
            </DialogTitle>
            {/* <DialogDescription className="body-sm inline">
              <p>Enter the email address of the user to invite.</p>
            </DialogDescription> */}
          </DialogHeader>
          <div>
            <h2 className="pb-2 font-medium">All Company Members</h2>
            <div className="grid gap-4">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-2 rounded-lg border-2 border-gray-200 p-4 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{user.email}</h4>
                      <div className="body-sm flex items-center text-gray-600">
                        <span>{user.firstName}</span>,<span>{user.email}</span>
                      </div>
                    </div>
                    <div>
                      {checkIfUserIsInTeam(user.id) ? (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline-destructive"
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
                          className="inline-flex items-center gap-1 whitespace-nowrap"
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
          {/* <InviteUserForm
            onSuccess={() => setIsOpen(false)}
            onCancel={() => setIsOpen(false)}
          /> */}
        </DialogContent>
      )}
    </Dialog>
  );
};

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
      //   console.log("her; ", teamId);
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
            variant="outline-destructive"
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
