import { TRPCError } from "@trpc/server";
import { type PrismaClient } from "@prisma/client";

/**
 * Throw FORBIDDEN unless a client-supplied company id matches the
 * session-derived company id. Use for procedures that (for backwards
 * compatibility) still accept a `companyId` input: the session, never the
 * input, is proof of scope.
 */
export function assertSameCompany(inputCompanyId: string | undefined, sessionCompanyId: string) {
  if (inputCompanyId !== undefined && inputCompanyId !== sessionCompanyId) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
}

/**
 * Load a team scoped to the caller's company. Throws NOT_FOUND when the
 * team does not exist or belongs to another company (NOT_FOUND, not
 * FORBIDDEN, avoids confirming cross-company resource existence).
 */
export async function requireTeamInCompany(
  db: PrismaClient,
  teamId: string,
  companyId: string
) {
  const team = await db.team.findFirst({
    where: { id: teamId, companyId },
    select: { id: true },
  });
  if (!team) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }
  return team;
}

/**
 * Load a user scoped to the caller's company. Throws NOT_FOUND otherwise.
 */
export async function requireUserInCompany(
  db: PrismaClient,
  userId: string,
  companyId: string
) {
  const user = await db.user.findFirst({
    where: { id: userId, companyId },
    select: { id: true },
  });
  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }
  return user;
}

/**
 * Load a project scoped to the caller's company. Throws NOT_FOUND otherwise.
 */
export async function requireProjectInCompany(
  db: PrismaClient,
  projectId: string,
  companyId: string
) {
  const project = await db.project.findFirst({
    where: { id: projectId, companyId },
    select: { id: true },
  });
  if (!project) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }
  return project;
}

/**
 * Load a label scoped to the caller's company. Throws NOT_FOUND otherwise.
 */
export async function requireLabelInCompany(
  db: PrismaClient,
  labelId: string,
  companyId: string
) {
  const label = await db.label.findFirst({
    where: { id: labelId, companyId },
    select: { id: true },
  });
  if (!label) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }
  return label;
}
