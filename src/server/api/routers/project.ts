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
import { type Project } from "@prisma/client";
import { projectFormSchema } from "@/schema";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(projectFormSchema)
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      if (!companyId) throw new Error("No company found");

      const newProject = await ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          companyId: companyId,
        },
      });
      return newProject;
    }),

  create: protectedProcedure
    .input(projectFormSchema)
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      if (!companyId) throw new Error("No company found");

      const newProject = await ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          companyId: companyId,
          teamId: null,
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

  getProjects: publicProcedure
    .input(
      z.object({
        companyId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      // const cId = ctx.session.user.company.id;
      const projects = await ctx.prisma.project.findMany({
        where: { companyId: input.companyId },
        include: {
          tasks: true, // include tasks in the project
        },
      });
      return projects;
    }),

  getProject: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
        include: {
          tasks: {
            include: {
              labels: true,
              assignee: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  image: true,
                },
              },
              comments: {
                select: {
                  id: true,
                  comment: true,
                  createdAt: true,
                  updatedAt: true,
                  author: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      role: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return project;
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedProject = await ctx.prisma.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      });
      return updatedProject;
    }),

  getProjectTasks: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const projectTasks = await ctx.prisma.task.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          labels: true,
          assignee: true,
          comments: true,
        },
      });
      return projectTasks;
    }),

  getProjectTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ input, ctx }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
      });
      return task;
    }),
});
