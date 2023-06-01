import type { BadgeColor } from "@/components/ui/badge";
import {
  InvitationStatus,
  Priority,
  ProjectStatus,
  Role,
  TaskStatus,
} from "@prisma/client";

export function getInviteStatusBadgeColor(
  status: InvitationStatus
): BadgeColor {
  switch (status) {
    case InvitationStatus.INVITED:
      return "blue";

    case InvitationStatus.REGISTERED:
      return "green";

    default:
      return "gray";
  }
}

export function getUserRoleBadgeColor(status: Role): BadgeColor {
  switch (status) {
    case Role.ADMIN:
      return "blue";

    case Role.MEMBER:
      return "yellow";

    default:
      return "gray";
  }
}

export function getProjectStatusBadgeColor(status: ProjectStatus): BadgeColor {
  switch (status) {
    case ProjectStatus.PLANNED:
      return "blue";

    case ProjectStatus.IN_PROGRESS:
      return "yellow";

    case ProjectStatus.COMPLETED:
      return "green";

    default:
      return "gray";
  }
}

export function getTaskStatusBadgeColor(status: TaskStatus): BadgeColor {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "gray";

    case TaskStatus.TO_DO:
      return "blue";

    case TaskStatus.IN_PROGRESS:
      return "yellow";

    case TaskStatus.IN_REVIEW:
      return "blue";

    case TaskStatus.REVISION:
      return "red";

    case TaskStatus.COMPLETED:
      return "green";

    case TaskStatus.CANCELED:
      return "dark-gray";

    default:
      return "gray";
  }
}

export function getTaskPriorityBadgeColor(status: Priority): BadgeColor {
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
