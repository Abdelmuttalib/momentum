// colors.ts — compatibility re-exports. Canonical mappings live in
// `@/lib/status-colors`. New code should import from there directly.

import {
  type Role,
  TaskStatus,
  type TaskPriority,
  type InvitationStatus,
} from "@prisma/client";
import { Priority } from "./enums";
import { type CBadgeColor } from "types";
import {
  getInviteStatusColor,
  getTaskPriorityColor,
  getTaskStatusColor,
  getUserRoleColor,
  inviteStatusColors,
  taskPriorityColors,
  taskStatusColors,
  userRoleColors,
} from "./status-colors";

export const taskPriorityBadgeColor: Record<
  TaskPriority,
  { color: CBadgeColor }
> = {
  [Priority.HIGH]: { color: taskPriorityColors[Priority.HIGH] },
  [Priority.MEDIUM]: { color: taskPriorityColors[Priority.MEDIUM] },
  [Priority.LOW]: { color: taskPriorityColors[Priority.LOW] },
};

export function getTaskPriorityBadgeColor(priority: TaskPriority) {
  return {
    color: getTaskPriorityColor(priority),
  };
}

export const taskStatusBadgeColor: Record<TaskStatus, { color: CBadgeColor }> =
  {
    [TaskStatus.BACKLOG]: { color: taskStatusColors[TaskStatus.BACKLOG] },
    [TaskStatus.TO_DO]: { color: taskStatusColors[TaskStatus.TO_DO] },
    [TaskStatus.IN_PROGRESS]: {
      color: taskStatusColors[TaskStatus.IN_PROGRESS],
    },
    [TaskStatus.COMPLETED]: { color: taskStatusColors[TaskStatus.COMPLETED] },
    [TaskStatus.CANCELED]: { color: taskStatusColors[TaskStatus.CANCELED] },
  };

export function getTaskStatusBadgeColor(status: TaskStatus) {
  return {
    color: getTaskStatusColor(status),
  };
}

export const userRoleBadgeColor: Record<Role, CBadgeColor> = {
  ...userRoleColors,
};

export function getUserRoleBadgeColor(role: Role) {
  return getUserRoleColor(role);
}

export const inviteStatusBadgeColor: Record<InvitationStatus, CBadgeColor> = {
  ...inviteStatusColors,
};

export function getInviteStatusBadgeColor(status: InvitationStatus) {
  return getInviteStatusColor(status);
}
