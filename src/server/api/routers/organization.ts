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
import { ProjectStatus, type Project, Role } from "@prisma/client";
import { createOrgWithAdminAccountFormSchema } from "@/components/auth/schema";
import { hashPassword } from "@/utils/bcrypt";

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
