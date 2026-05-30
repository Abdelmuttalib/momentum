// colors.ts

import {
  type Role,
  TaskStatus,
  type TaskPriority,
  type InvitationStatus,
} from "@prisma/client";
import { Priority } from "./enums";
import { type CBadgeColor } from "types";

export const taskPriorityBadgeColor: Record<
  TaskPriority,
  { color: CBadgeColor }
> = {
  [Priority.HIGH]: { color: "red" },
  [Priority.MEDIUM]: { color: "amber" },
  [Priority.LOW]: { color: "teal" },
};

export function getTaskPriorityBadgeColor(priority: TaskPriority) {
  return (
    taskPriorityBadgeColor[priority] ?? {
      color: "gray",
    }
  );
}

export const taskStatusBadgeColor: Record<TaskStatus, { color: CBadgeColor }> =
  {
    [TaskStatus.BACKLOG]: { color: "gray" },
    [TaskStatus.TO_DO]: { color: "blue" },
    [TaskStatus.IN_PROGRESS]: { color: "yellow" },
    [TaskStatus.IN_REVIEW]: { color: "orange" },
    [TaskStatus.COMPLETED]: { color: "green" },
    [TaskStatus.CANCELED]: { color: "stone" },
  };

export function getTaskStatusBadgeColor(status: TaskStatus) {
  return (
    taskStatusBadgeColor[status] ?? {
      color: "gray",
    }
  );
}

export const userRoleBadgeColor: Record<Role, CBadgeColor> = {
  ADMIN: "blue",
  MEMBER: "yellow",
};

export function getUserRoleBadgeColor(role: Role) {
  return userRoleBadgeColor[role] ?? "gray";
}

export const inviteStatusBadgeColor: Record<InvitationStatus, CBadgeColor> = {
  INVITED: "blue",
  REGISTERED: "green",
};

export function getInviteStatusBadgeColor(status: InvitationStatus) {
  return inviteStatusBadgeColor[status] ?? "gray";
}
