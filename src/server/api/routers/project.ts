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
import { ProjectStatus, type Project } from "@prisma/client";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        status: z.nativeEnum(ProjectStatus),
        teamId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const newProject = await ctx.prisma.project.create({
        data: {
          name: input.name,
          status: input.status,
          teamId: input.teamId,
          companyId: companyId,
        },
      });
      return newProject;
    }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.project.delete({
        where: { id: input.id },
      });
    }),

  getAllProjectsByTeamId: protectedProcedure
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
