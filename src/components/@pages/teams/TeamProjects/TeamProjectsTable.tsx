import type { TTeam } from "../../organization/organization-teams";
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
