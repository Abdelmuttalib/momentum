/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TTeam } from "types";
import { DataTable } from "../TeamMembers/data-table";
import { teamProjectsColumns } from "./team-projects";

interface TeamProjectsTableProps {
  teamProjects: TTeam["projects"];
}

export default function TeamProjectsTable({
  teamProjects,
}: TeamProjectsTableProps) {
  return (
    <div>
      {teamProjects && (
        <DataTable columns={teamProjectsColumns} data={teamProjects} />
      )}
    </div>
  );
}
