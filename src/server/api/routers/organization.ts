/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import {
  ProjectStatus,
  type Project,
  Role,
  InvitationStatus,
} from "@prisma/client";
import { createOrgWithAdminAccountFormSchema } from "@/components/auth/schema";
import { hashPassword } from "@/utils/bcrypt";
import { inviteUserToOrganizationFormSchema } from "@/pages/organization";

export const organizationRouter = createTRPCRouter({
  createOrganizationWithAdminAccount: publicProcedure
    .input(createOrgWithAdminAccountFormSchema)
    .mutation(async ({ input, ctx }) => {
      const newOrganization = await ctx.prisma.organization.create({
        data: {
          name: input.organization,
        },
      });

      const hashedPassword = hashPassword(input.password);

      const newAdminUser = await ctx.prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          password: hashedPassword,
          organization: {
            connect: {
              id: newOrganization.id,
            },
          },
          role: Role.ADMIN,
        },
      });
      return { newOrganization, newAdminUser };
    }),

  getAllInvitations: protectedProcedure
    .input(
      z.object({
        organizationId: z.string().nonempty(),
      })
    )
    .query(async ({ input, ctx }) => {
      const invitations = await ctx.prisma.invitation.findMany({
        where: {
          organizationId: input.organizationId,
        },
      });

      return invitations;
    }),

  inviteUserToOrganization: protectedProcedure
    .input(
      z.object({
        phoneNumber: z
          .string()
          .regex(/^1[3-9]\d{9}$/)
          .nonempty(),
        role: z.nativeEnum(Role),
        organizationId: z.string().nonempty(),
        invitedById: z.string().nonempty(),
      })
    )
    .mutation(async ({ input, ctx }) => {
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
        phoneNumber: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const inviteData = await ctx.prisma.invitation.findUnique({
        where: {
          phoneNumber: input.phoneNumber,
        },
      });

      if (inviteData && inviteData.status === InvitationStatus.INVITED) {
        const hashedPassword = hashPassword(input.password);

        const registeredUser = await ctx.prisma.user.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phoneNumber: input.phoneNumber,
            password: hashedPassword,
            organization: {
              connect: {
                id: inviteData.organizationId,
              },
            },
            role: inviteData.role,
          },
        });

        if (registeredUser) {
          await ctx.prisma.invitation.update({
            where: {
              phoneNumber: input.phoneNumber,
            },
            data: {
              status: InvitationStatus.REGISTERED,
            },
          });

          return registeredUser;
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
});
