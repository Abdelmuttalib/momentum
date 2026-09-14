// Canonical semantic → badge-color mappings.
// Single source of truth for domain status colors. The base `Badge` stays
// semantic-only; these helpers feed the colored `CBadge`-based domain
// wrappers (TaskStatusBadge, TaskPriorityBadge, UserRoleBadge,
// InviteStatusBadge, LabelBadge).

import {
  type InvitationStatus,
  type Role,
  TaskStatus,
  type TaskPriority,
} from "@prisma/client";
import { Priority } from "./enums";
import { type CBadgeColor } from "types";

export const taskStatusColors: Record<TaskStatus, CBadgeColor> = {
  [TaskStatus.BACKLOG]: "gray",
  [TaskStatus.TO_DO]: "blue",
  [TaskStatus.IN_PROGRESS]: "yellow",
  [TaskStatus.COMPLETED]: "green",
  [TaskStatus.CANCELED]: "stone",
};

export function getTaskStatusColor(status: TaskStatus): CBadgeColor {
  return taskStatusColors[status] ?? "gray";
}

export const taskPriorityColors: Record<TaskPriority, CBadgeColor> = {
  [Priority.HIGH]: "red",
  [Priority.MEDIUM]: "amber",
  [Priority.LOW]: "teal",
};

export function getTaskPriorityColor(priority: TaskPriority): CBadgeColor {
  return taskPriorityColors[priority] ?? "gray";
}

export const userRoleColors: Record<Role, CBadgeColor> = {
  ADMIN: "blue",
  MEMBER: "yellow",
};

export function getUserRoleColor(role: Role): CBadgeColor {
  return userRoleColors[role] ?? "gray";
}

export const inviteStatusColors: Record<InvitationStatus, CBadgeColor> = {
  INVITED: "blue",
  REGISTERED: "green",
};

export function getInviteStatusColor(status: InvitationStatus): CBadgeColor {
  return inviteStatusColors[status] ?? "gray";
}
