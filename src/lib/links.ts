import { siteConfig } from "@/config/site-config";

const TEAMS_PATH = siteConfig.pages.main.links.teams.href;
const PROJECTS_PATH = siteConfig.pages.main.links.projects.href;

export function getTeamsLink() {
  return `${TEAMS_PATH}`;
}

export function getProjectLink(teamId: string, projectId: string) {
  return `${TEAMS_PATH}/${teamId}/projects/${projectId}`;
}
export function getTeamLink(teamId: string) {
  return `${TEAMS_PATH}/${teamId}`;
}

export function getTeamProjectsLink(teamId: string) {
  return `${TEAMS_PATH}/${teamId}/projects`;
}

export function getTeamProjectLink(teamId: string, projectId: string) {
  return `${TEAMS_PATH}/${teamId}/projects/${projectId}`;
}

export function getTeamProjectTasksLink(teamId: string) {
  return `${TEAMS_PATH}/${teamId}/projects/${teamId}/tasks`;
}
