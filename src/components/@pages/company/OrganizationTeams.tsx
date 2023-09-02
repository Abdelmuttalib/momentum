/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Skeleton } from "@/components/ui/skeleton";
import type { TTeam } from "types";

function OrganizationTeamLoader() {
  return (
    <div className="rounded-b-primary grid w-full grid-cols-3 items-center justify-between bg-white px-4 py-5 lg:px-8">
      <h5>
        <Skeleton className="h-6 w-40" />
      </h5>
      <div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
    </div>
  );
}

function OrganizationTeam({ id, name, users }: TTeam) {
  return (
    <div
      key={id}
      className="rounded-b-primary grid w-full grid-cols-3 items-center justify-between bg-white px-4 py-5 lg:px-8"
    >
      <h5>{name}</h5>
      {/* <div className="">
        <Badge color="green">{status}</Badge>
      </div> */}
      <div>{users.length}</div>
    </div>
  );
}

interface OrganizationTeamsProps {
  teams: TTeam[] | undefined;
  isLoading: boolean;
}

export default function OrganizationTeams({
  teams,
  isLoading,
}: OrganizationTeamsProps) {
  return (
    <div>
      <div className="border-t-none label-sm rounded-t-primary grid w-full grid-cols-3 items-center justify-between border-2 bg-white px-4 py-5 lg:px-8">
        <h5>Team Name</h5>
        {/* <div>Projects</div> */}
        <div>Members</div>
      </div>
      {/* invited members */}
      <div className="rounded-b-primary border-2 border-t-0">
        {!isLoading &&
          teams?.map((team) => <OrganizationTeam key={team.id} {...team} />)}
        {!teams &&
          isLoading &&
          [1, 2, 3].map((n) => <OrganizationTeamLoader key={n} />)}
      </div>
    </div>
  );
}
