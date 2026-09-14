/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import {
  generateInviteCode,
  inviteExpiryDate,
  INVITE_MAX_ATTEMPTS,
  verifyInviteCode,
} from "@/server/invitations";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "@/server/api/trpc";
import {
  type Project,
  Role,
  InvitationStatus,
  type Invitation,
} from "@prisma/client";
import { hashPassword } from "@/lib/bcrypt";
import { safeUserSelect } from "@/server/db/selects";
import { requireTeamInCompany } from "@/server/authz";
import {
  createCompanyWithAdminAccountFormSchema,
  inviteUserFormSchema,
} from "@/schema";

export const companyRouter = createTRPCRouter({
  createCompanyWithAdminAccount: publicProcedure
    .input(createCompanyWithAdminAccountFormSchema)
    .mutation(async ({ input, ctx }) => {
      const newCompany = await ctx.prisma.company.create({
        data: {
          name: input.company,
        },
      });

      const hashedPassword = hashPassword(input.password);

      const newAdminUser = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          company: {
            connect: {
              id: newCompany.id,
            },
          },
          role: Role.ADMIN,
          emailVerified: false,
          image: `https://avatar.vercel.sh/${input.email}${newCompany.id}`,
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          role: true,
          companyId: true,
          company: true,
        },
      });
      return { newCompany, newAdminUser };
    }),

  updateCompanyName: protectedAdminProcedure
    .input(
      z.object({
        companyId: z.string(),
        name: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.companyId !== ctx.session.user.company.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const updatedCompany = await ctx.prisma.company.update({
        where: { id: input.companyId },
        data: {
          name: input.name,
        },
      });
      return updatedCompany;
    }),

  getAllInvitations: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const companyId = ctx.session.user.company.id || input.companyId;
      const invitations = await ctx.prisma.invitation.findMany({
        where: {
          companyId,
        },
      });

      return invitations;
    }),

  inviteUserToCompany: protectedProcedure
    .input(inviteUserFormSchema)
    .mutation(async ({ input, ctx }) => {
      const currentUser = ctx.session.user;

      if (!currentUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to invite users",
        });
      }

      if (currentUser.role !== Role.ADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to invite users",
        });
      }

      if (currentUser.email === input.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot invite yourself",
        });
      }

      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.email.toLowerCase(),
        },
        select: { id: true },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const existingInvite = await ctx.prisma.invitation.findUnique({
        where: {
          email: input.email.toLowerCase(),
        },
        select: { id: true },
      });

      if (existingInvite) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already invited",
        });
      }

      const newInvite = await ctx.prisma.invitation.create({
        data: {
          email: input.email.toLowerCase(),
          role: input.role,
          companyId: currentUser.company.id,
          invitedById: currentUser.id,
          token: randomBytes(32).toString("hex"),
          inviteCode: generateInviteCode(),
          expiresAt: inviteExpiryDate(),
        },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          expiresAt: true,
          token: true,
          inviteCode: true,
        },
      });

      return newInvite;
    }),

  registerInvitedUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        password: z.string().min(8).max(50),
        token: z.string().min(1),
        inviteCode: z.string().min(1).max(16),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const inviteData = await ctx.prisma.invitation.findUnique({
        where: {
          token: input.token,
        },
      });

      if (!inviteData || inviteData.status !== InvitationStatus.INVITED) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found or already used",
        });
      }

      if (inviteData.expiresAt && inviteData.expiresAt < new Date()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This invitation has expired",
        });
      }

      if (inviteData.failedAttempts >= INVITE_MAX_ATTEMPTS) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Too many incorrect attempts. Ask your admin for a new invitation",
        });
      }

      if (inviteData.email.toLowerCase() !== input.email.toLowerCase()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This invitation was issued for a different email address",
        });
      }

      const company = await ctx.prisma.company.findUnique({
        where: { id: inviteData.companyId },
        select: { id: true, name: true },
      });
      if (!company) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This invitation is no longer valid",
        });
      }

      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
        select: { id: true },
      });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists",
        });
      }

      // Legacy rows created before invite codes have NULL inviteCode and
      // require admin regeneration before redemption.
      if (!inviteData.inviteCode) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This invitation needs to be regenerated by your admin",
        });
      }

      if (!verifyInviteCode(input.inviteCode, inviteData.inviteCode)) {
        // Persist the attempt atomically without consuming the invitation.
        await ctx.prisma.invitation.updateMany({
          where: { id: inviteData.id, status: InvitationStatus.INVITED },
          data: { failedAttempts: { increment: 1 } },
        });
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Incorrect invite code",
        });
      }

      const hashedPassword = hashPassword(input.password);

      try {
        await ctx.prisma.$transaction(async (tx) => {
          await tx.user.create({
            data: {
              name: input.name,
              email: input.email.toLowerCase(),
              password: hashedPassword,
              emailVerified: false,
              company: {
                connect: {
                  id: inviteData.companyId,
                },
              },
              role: inviteData.role,
            },
            select: { id: true },
          });

          // Conditional consume: exactly one row must flip INVITED ->
          // REGISTERED, otherwise a concurrent request won the race.
          const consumed = await tx.invitation.updateMany({
            where: {
              id: inviteData.id,
              status: InvitationStatus.INVITED,
            },
            data: {
              status: InvitationStatus.REGISTERED,
              token: null,
              inviteCode: null,
            },
          });
          if (consumed.count !== 1) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "This invitation was already used",
            });
          }
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error registering invited user:", error);

        throw new TRPCError({
          code: "CONFLICT",
          message: "Could not complete registration",
        });
      }

      return {
        success: true,
      };
    }),

  /**
   * Public UX-only lookup: lets the registration page display company/email
   * context and validity state before submit. Returns no secrets.
   * Registration itself re-validates everything server-side.
   */
  getInvitationByToken: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const invite = await ctx.prisma.invitation.findUnique({
        where: { token: input.token },
        select: {
          email: true,
          role: true,
          status: true,
          expiresAt: true,
          failedAttempts: true,
          inviteCode: true,
          company: { select: { name: true } },
        },
      });
      if (!invite) {
        return { state: "INVALID" as const };
      }
      if (invite.status !== InvitationStatus.INVITED) {
        return { state: "USED" as const };
      }
      if (invite.expiresAt && invite.expiresAt < new Date()) {
        return { state: "EXPIRED" as const };
      }
      if (invite.failedAttempts >= INVITE_MAX_ATTEMPTS) {
        return { state: "LOCKED" as const };
      }
      if (!invite.inviteCode) {
        return { state: "NEEDS_REGENERATION" as const };
      }
      return {
        state: "VALID" as const,
        email: invite.email,
        role: invite.role,
        companyName: invite.company.name,
      };
    }),

  regenerateInvitation: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const currentUser = ctx.session.user;
      if (currentUser.role !== Role.ADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to manage invitations",
        });
      }
      const existing = await ctx.prisma.invitation.findFirst({
        where: { id: input.id, companyId: currentUser.company.id },
        select: { id: true, status: true },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (existing.status !== InvitationStatus.INVITED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only pending invitations can be regenerated",
        });
      }
      const updated = await ctx.prisma.invitation.update({
        where: { id: input.id },
        data: {
          token: randomBytes(32).toString("hex"),
          inviteCode: generateInviteCode(),
          expiresAt: inviteExpiryDate(),
          failedAttempts: 0,
          status: InvitationStatus.INVITED,
        },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          expiresAt: true,
          token: true,
          inviteCode: true,
        },
      });
      return updated;
    }),

  revokeInvitation: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const currentUser = ctx.session.user;
      if (currentUser.role !== Role.ADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to manage invitations",
        });
      }
      const existing = await ctx.prisma.invitation.findFirst({
        where: { id: input.id, companyId: currentUser.company.id },
        select: { id: true, status: true },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (existing.status !== InvitationStatus.INVITED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only pending invitations can be revoked",
        });
      }
      await ctx.prisma.invitation.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const existing = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        select: { companyId: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await ctx.prisma.project.delete({
        where: { id: input.id },
      });
    }),

  getAllCompanyProjects: protectedProcedure.query(async ({ ctx }) => {
    const cId = ctx.session.user.company.id;
    const projects: Project[] = await ctx.prisma.project.findMany({
      where: {
        companyId: cId,
      },
      include: {
        tasks: true, // include tasks in the project
      },
    });
    return projects;
  }),

  updateProject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const existing = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        select: { companyId: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const updatedProject = await ctx.prisma.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      });
      return updatedProject;
    }),

  getCompanyUsersNotInTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      await requireTeamInCompany(ctx.prisma, input.teamId, companyId);
      const companyMembers = await ctx.prisma.user.findMany({
        where: {
          companyId,
          teams: {
            none: {
              id: input.teamId,
            },
          },
        },
        select: safeUserSelect,
      });
      return companyMembers;
    }),

  getCompany: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.session.user.company.id;
    const company = await ctx.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });
    return company;
  }),

  getCompanyUsers: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.session.user.company.id;
    const companyMembers = await ctx.prisma.user.findMany({
      where: {
        companyId,
      },
      select: { ...safeUserSelect, teams: true },
    });
    return companyMembers;
  }),

  getCompanyProjects: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.session.user.company.id;
    const companyProjects = await ctx.prisma.project.findMany({
      where: {
        companyId,
      },
    });
    return companyProjects;
  }),
});
