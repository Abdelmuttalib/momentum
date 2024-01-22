/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "@/server/api/trpc";
import {
  ProjectStatus,
  type Project,
  Role,
  InvitationStatus,
} from "@prisma/client";
import { createOrgWithAdminAccountFormSchema } from "@/components/auth/schema";
import { hashPassword } from "@/utils/bcrypt";

export const companyRouter = createTRPCRouter({
  createCompanyWithAdminAccount: publicProcedure
    .input(createOrgWithAdminAccountFormSchema)
    .mutation(async ({ input, ctx }) => {
      const newCompany = await ctx.prisma.company.create({
        data: {
          name: input.company,
        },
      });

      const hashedPassword = hashPassword(input.password);

      const newAdminUser = await ctx.prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: hashedPassword,
          company: {
            connect: {
              id: newCompany.id,
            },
          },
          role: Role.ADMIN,
          emailVerified: false,
        },
      });
      return { newCompany, newAdminUser };
    }),

  updateCompanyName: protectedAdminProcedure
    .input(
      z.object({
        companyId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedCompany = await ctx.prisma.company.update({
        where: { id: input.companyId },
        data: {
          name: input.name,
        },
      });
      return updatedCompany;
    }),

  getAllInvitations: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.session.user.company.id;
    const invitations = await ctx.prisma.invitation.findMany({
      where: {
        companyId,
      },
    });

    return invitations;
  }),

  inviteUserToCompany: protectedProcedure
    .input(
      z.object({
        email: z.string().email().nonempty(),
        role: z.nativeEnum(Role),
        companyId: z.string().nonempty(),
        invitedById: z.string().nonempty(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const existingInvite = await ctx.prisma.invitation.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingInvite) {
        throw new Error("User already invited");
      }

      const newInvite = await ctx.prisma.invitation.create({
        data: {
          ...input,
        },
      });

      return newInvite;
    }),

  registerInvitedUser: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const inviteData = await ctx.prisma.invitation.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!inviteData) {
        throw new Error("No invitation found");
      }

      if (inviteData && inviteData.status === InvitationStatus.INVITED) {
        const hashedPassword = hashPassword(input.password);

        const registeredUser = await ctx.prisma.user.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            password: hashedPassword,
            emailVerified: false,
            company: {
              connect: {
                id: inviteData.companyId,
              },
            },
            role: inviteData.role,
          },
        });

        if (registeredUser) {
          await ctx.prisma.invitation.update({
            where: {
              email: input.email,
            },
            data: {
              status: InvitationStatus.REGISTERED,
            },
          });

          return {
            success: true,
          };
        }
      }
    }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.project.delete({
        where: { id: input.id },
      });
    }),

  allProjects: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const projects: Project[] = await ctx.prisma.project.findMany({
        where: { teamId: input.teamId },
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
        status: z.nativeEnum(ProjectStatus).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedProject = await ctx.prisma.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          status: input.status,
        },
      });
      return updatedProject;
    }),

  getCompanyMembersNotInTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const companyMembers = await ctx.prisma.user.findMany({
        where: {
          companyId,
          teams: {
            none: {
              id: input.teamId,
            },
          },
        },
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

  getCompanyMembers: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.session.user.company.id;
    const companyMembers = await ctx.prisma.user.findMany({
      where: {
        companyId,
      },
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
