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
  type Project,
  Role,
  InvitationStatus,
  type Invitation,
} from "@prisma/client";
import { hashPassword } from "@/utils/bcrypt";
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
    .input(inviteUserFormSchema)
    .mutation(async ({ input, ctx }) => {
      const currentUser = ctx.session.user;

      if (!currentUser) {
        throw new Error("You must be logged in to invite users");
      }

      if (currentUser.role !== Role.ADMIN) {
        throw new Error("You are not authorized to invite users");
      }

      if (currentUser.email === input.email) {
        throw new Error("You cannot invite yourself");
      }

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

      const userCompanyId = currentUser.company.id;

      const newInvite = await ctx.prisma.invitation.create({
        data: {
          ...(input as {
            email: string;
            role: Role;
          }),
          companyId: currentUser.company.id,
          invitedById: currentUser.id,
        },
      });

      return newInvite;
    }),

  registerInvitedUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
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
            name: input.name,
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

  getAllCompanyProjects: publicProcedure.query(async ({ input, ctx }) => {
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
      const updatedProject = await ctx.prisma.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
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
    const currentUserId = ctx.session.user.id;
    const companyId = ctx.session.user.company.id;
    const companyMembers = await ctx.prisma.user.findMany({
      where: {
        companyId,
        id: {
          not: currentUserId,
        },
      },
      include: { teams: true },
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
