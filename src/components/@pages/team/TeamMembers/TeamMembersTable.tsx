import type { User } from "@prisma/client";
import { DataTable } from "./data-table";
// import { columns } from "./team-members";
import CustomTableLayout, {
  CustomTableBody,
  CustomTableHead,
  CustomTableHeadItem,
  CustomTableRow,
  CustomTableRowItem,
} from "@/components/CustomTableLayout";
import { columns, teamMembersColumns } from "./team-members";
import Badge from "@/components/ui/badge";
import { getUserRoleBadgeColor } from "@/utils/getBadgeColor";

interface TeamMembersTableProps {
  teamMembers: User[];
}

export default function TeamMembersTable({
  teamMembers,
}: TeamMembersTableProps) {
  console.log("team mem: ", teamMembers);
  return (
    <div>
      <DataTable columns={teamMembersColumns} data={teamMembers} />
    </div>
  );
}
