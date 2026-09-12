const DASHBOARD_PATH = "/overview";
const PROJECTS_PATH = "/projects";
const TEAMS_PATH = "/teams";
const TASKS_PATH = "/tasks";
const COMPANY_PATH = "/company";
const SETTINGS_PATH = "/settings";
const HELP_PATH = "/help";

export const routes = {
  dashboard: {
    index: () => `${DASHBOARD_PATH}`,
  },

  projects: {
    index: () => `${PROJECTS_PATH}`,

    new: () => `${PROJECTS_PATH}/new`,

    details: ({ projectId }: { projectId: string }) =>
      `${PROJECTS_PATH}/${projectId}`,

    edit: ({ projectId }: { projectId: string }) =>
      `${PROJECTS_PATH}/${projectId}/edit`,

    tasks: {
      index: ({ projectId }: { projectId: string }) =>
        `${PROJECTS_PATH}/${projectId}/tasks`,

      new: ({ projectId }: { projectId: string }) =>
        `${PROJECTS_PATH}/${projectId}/tasks/new`,

      details: ({ projectId, taskId }: { projectId: string; taskId: string }) =>
        `${PROJECTS_PATH}/${projectId}/tasks/${taskId}`,

      edit: ({ projectId, taskId }: { projectId: string; taskId: string }) =>
        `${PROJECTS_PATH}/${projectId}/tasks/${taskId}/edit`,
    },
  },

  teams: {
    index: () => `${TEAMS_PATH}`,

    new: () => `${TEAMS_PATH}/new`,

    details: ({ teamId }: { teamId: string }) => `${TEAMS_PATH}/${teamId}`,
  },

  tasks: {
    index: () => `${TASKS_PATH}`,
    // Global compat aliases. Canonical detail/edit are the nested
    // `projects.tasks` routes; these exist so `/tasks/:taskId` keeps working
    // until the redirect migration lands.
    details: ({ taskId }: { taskId: string }) => `${TASKS_PATH}/${taskId}`,
    edit: ({ taskId }: { taskId: string }) => `${TASKS_PATH}/${taskId}/edit`,
  },

  company: {
    index: () => `${COMPANY_PATH}`,
  },

  settings: {
    index: () => `${SETTINGS_PATH}/appearance`,
    general: () => `${SETTINGS_PATH}`,
    company: () => `${SETTINGS_PATH}/company`,
    appearance: () => `${SETTINGS_PATH}/appearance`,
    profile: () => `${SETTINGS_PATH}/profile`,
    members: () => `${COMPANY_PATH}`,
    account: () => `${SETTINGS_PATH}/account`,
    password: () => `${SETTINGS_PATH}/password`,
    email: () => `${SETTINGS_PATH}/email`,
    twoFactor: () => `${SETTINGS_PATH}/two-factor`,
  },

  help: {
    index: () => `${HELP_PATH}`,
  },
} as const;
