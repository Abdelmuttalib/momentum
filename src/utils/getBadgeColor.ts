import { InvitationStatus, Role, TaskStatus } from "@prisma/client";
import { Priority } from "@/utils/enums";
import { type RichBadgeColor } from "types";

export function getInviteStatusBadgeColor(
  status: InvitationStatus
): RichBadgeColor {
  switch (status) {
    case InvitationStatus.INVITED:
      return "blue";

    case InvitationStatus.REGISTERED:
      return "green";

    default:
      return "gray";
  }
}

export function getUserRoleBadgeColor(status: Role): RichBadgeColor {
  switch (status) {
    case Role.ADMIN:
      return "blue";

    case Role.MEMBER:
      return "yellow";

    default:
      return "gray";
  }
}

export function getTaskStatusBadgeColor(status: TaskStatus): RichBadgeColor {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "gray";

    case TaskStatus.TO_DO:
      return "blue";

    case TaskStatus.IN_PROGRESS:
      return "yellow";

    case TaskStatus.IN_REVIEW:
      return "blue";

    case TaskStatus.COMPLETED:
      return "green";

    case TaskStatus.CANCELED:
      return "dark-gray";

    default:
      return "gray";
  }
}

export function getTaskPriorityBadgeColor(status: Priority): RichBadgeColor {
  switch (status) {
    case Priority.HIGH:
      return "red";

    case Priority.MEDIUM:
      return "yellow";

    case Priority.LOW:
      return "green";

    default:
      return "green";
  }
}
