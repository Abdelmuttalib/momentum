import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import { type FC, useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { IconLink } from "@/components/ui/icon-button";

type TTeam = Team & {
  users: User[];
};

export const AddUserDialog: FC<{ team: TTeam }> = ({ team }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [render, toggleRender] = useState(1);
  const apiContext = api.useContext();
  console.log("team here: ", team);
  const { data: users, refetch: refetchUsers } =
    api.team.admin.getAllUsers.useQuery();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const [teamUserIds, setTeamUserIds] = useState(
    new Set(team.users.map((user: User) => user.id))
  );

  // const teamUserIds = new Set(team.users.map((user: User) => user.id));

  useEffect(() => {
    const teamUserIds = new Set(team.users.map((user: User) => user.id));
    setTeamUserIds(teamUserIds);
  }, [users, team.users]);

  const addUserToTeamMutation = api.team.admin.addUserToTeam.useMutation({
    onSuccess: async () => {
      // await apiContext.team.admin.getAllUsers.invalidate();
      await apiContext.team.admin.getAllTeamsByOrganization.invalidate();
      await refetchUsers();
      toggleRender(render + 1);
      toast.success("User added to team successfully");
    },
    onError: () => {
      toast.error("Failed to add user to team");
    },
  });

  const removeUserFromTeam = api.team.admin.removeUserFromTeam.useMutation({
    onSuccess: async () => {
      // await apiContext.team.admin.getAllUsers.invalidate();
      await apiContext.team.admin.getAllTeamsByOrganization.invalidate();
      toast.success("User removed from team successfully");
    },
    onError: () => {
      toast.error("Failed to remove user from team");
    },
  });

  const checkIfUserIsInTeam = (userId: User["id"]) => {
    return teamUserIds.has(userId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="default"
          className="inline-flex h-10 gap-1 whitespace-nowrap"
        >
          <PlusIcon className="w-5" /> Add Members
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="mt-10 bg-white sm:max-w-2xl">
          <DialogHeader className="mb-6 space-y-0">
            <DialogTitle>
              <h2 className="h4 inline">Add a new Member to the Team</h2>
            </DialogTitle>
            <DialogDescription className="body-sm inline">
              <p>Enter the phone number of the user to invite.</p>
            </DialogDescription>
          </DialogHeader>
          <div>
            <h2 className="h6">All Users</h2>
            <div className="grid gap-4">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{user.phoneNumber}</h4>
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
                          <Button size="sm" variant="secondary" disabled>
                            Added
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="default"
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={async () => {
                            await addUserToTeamMutation.mutateAsync({
                              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                              teamId: team.id,
                              userId: user.id,
                            });
                          }}
                          disabled={addUserToTeamMutation.isLoading}
                          isLoading={addUserToTeamMutation.isLoading}
                        >
                          <PlusIcon className="w-5" />
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

export const cols: ColumnDef<Team>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "users",
    header: "members",
    cell: ({ row: { original } }) => {
      console.log("row: ", original);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const teamRow: TTeam = original as TTeam;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return teamRow.users.map((user: User) => (
        <p key={user.id}>{user.email},</p>
      ));
    },
  },
  {
    accessorKey: "actions",
    header: "actions",
    cell: ({ row: { original } }) => {
      const deleteTeamMutation = api.team.admin.deleteTeam.useMutation({
        onSuccess: () => {
          toast.success("Team deleted");
          // api.team.allTeams.refetch(); // if you have getTeams query
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
      async function onDeleteClick() {
        await deleteTeamMutation.mutateAsync({ id: original.id });
      }

      return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <div className="flex gap-3">
          <IconLink
            href={`/team/${original.id}`}
            variant="outline"
            className="h-full py-3"
          >
            View
          </IconLink>
          <AddUserDialog team={original as TTeam} />
          <Button
            type="button"
            size="sm"
            variant="outline"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={onDeleteClick}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
