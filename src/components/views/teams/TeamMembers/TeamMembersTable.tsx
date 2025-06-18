import type { User } from "@prisma/client";
import { DataTable } from "./data-table";
// import { columns } from "./team-members";
import { teamMembersColumns } from "./team-members";

interface TeamMembersTableProps {
  teamMembers: User[];
}

export default function TeamMembersTable({
  teamMembers,
}: TeamMembersTableProps) {
  return (
    <div>
      <DataTable columns={teamMembersColumns} data={teamMembers} />
    </div>
  );
}
