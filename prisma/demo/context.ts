import { PrismaClient } from "@prisma/client";

export type DemoUser = { id: string; name: string };
export type DemoTeam = { id: string; name: string };
export type DemoProject = {
  id: string;
  name: string;
  teamId: string | null;
  existingTaskCount: number;
};
export type DemoLabel = { id: string; name: string };

export type CompanyContext = {
  companyId: string;
  companyName: string;
  users: DemoUser[];
  teams: DemoTeam[];
  projects: DemoProject[];
  labels: DemoLabel[];
};

/**
 * Loads and validates the target company. Fails clearly before any write
 * when the company is missing or lacks the users/projects tasks require.
 * Never creates Company/User/Team/Project/Label records.
 */
export async function loadCompanyContext(
  prisma: PrismaClient,
  companyId: string
): Promise<CompanyContext> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true, name: true },
  });
  if (!company) {
    throw new Error(
      `COMPANY_ID "${companyId}" does not match an existing company. Aborting before any write.`
    );
  }

  const [users, teams, projects, labels] = await Promise.all([
    prisma.user.findMany({
      where: { companyId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.team.findMany({
      where: { companyId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.project.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        teamId: true,
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.label.findMany({
      where: { companyId },
      select: { id: true, name: true },
    }),
  ]);

  // All queries above are filtered by companyId, so every loaded record
  // belongs to the target company by construction. Generators additionally
  // assert this per record before insertion (see seed.ts validation).

  if (projects.length === 0) {
    throw new Error(
      `Company "${company.name}" has no projects. Tasks require a projectId — create at least one project first, then rerun.`
    );
  }
  if (users.length === 0) {
    throw new Error(
      `Company "${company.name}" has no users. Aborting rather than generating an entirely unassigned dataset.`
    );
  }

  return {
    companyId: company.id,
    companyName: company.name,
    users,
    teams,
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      teamId: p.teamId,
      existingTaskCount: p._count.tasks,
    })),
    labels,
  };
}
