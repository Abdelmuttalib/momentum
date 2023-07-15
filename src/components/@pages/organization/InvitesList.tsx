/* eslint-disable @typescript-eslint/no-unsafe-argument */
import CustomTableLayout, {
  CustomTableBody,
  CustomTableHead,
  CustomTableHeadItem,
  CustomTableRow,
  CustomTableRowItem,
} from "@/components/CustomTableLayout";
import Badge from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserRoleBadgeColor } from "@/utils/getBadgeColor";
import type { Invitation } from "@prisma/client";

function InviteLoader() {
  return (
    <CustomTableRow className="grid-cols-3">
      <CustomTableRowItem>
        <Skeleton className="h-6 w-40" />
      </CustomTableRowItem>
      <CustomTableRowItem>
        <Skeleton className="h-7 w-20 rounded-full" />
      </CustomTableRowItem>
      <CustomTableRowItem>
        <Skeleton className="h-7 w-20 rounded-full" />
      </CustomTableRowItem>
    </CustomTableRow>
  );
}

function Invite({ id, email, status, role }: Invitation) {
  return (
    <CustomTableRow key={id} className="grid-cols-3">
      <CustomTableRowItem>{email}</CustomTableRowItem>
      <CustomTableRowItem>
        <Badge color="green">{status}</Badge>
      </CustomTableRowItem>
      <CustomTableRowItem>
        <Badge color={getUserRoleBadgeColor(role)}>{role}</Badge>
      </CustomTableRowItem>
    </CustomTableRow>
  );
}

interface InvitesListProps {
  invitations: Invitation[] | undefined;
  isLoading: boolean;
}

export default function InvitesList({
  invitations,
  isLoading,
}: InvitesListProps) {
  return (
    <CustomTableLayout>
      <CustomTableHead className="grid-cols-3">
        <CustomTableHeadItem>Email</CustomTableHeadItem>
        <CustomTableHeadItem>Invite Status</CustomTableHeadItem>
        <CustomTableHeadItem>Role</CustomTableHeadItem>
      </CustomTableHead>
      <CustomTableBody className="w-full">
        {!isLoading &&
          invitations?.map((invitation) => (
            <Invite key={invitation.id} {...invitation} />
          ))}
        {!invitations &&
          isLoading &&
          [1, 2, 3].map((n) => <InviteLoader key={n} />)}
      </CustomTableBody>
    </CustomTableLayout>
  );
}
