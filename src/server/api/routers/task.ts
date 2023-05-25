import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { Priority, TaskStatus, type Task } from "@prisma/client";

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        status: z.nativeEnum(TaskStatus),
        priority: z.nativeEnum(Priority),
        dueDate: z.date().optional(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newTask = await ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.description || null,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate || null,
          projectId: input.projectId,
        },
      });
      return newTask;
    }),

  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        priority: z.nativeEnum(Priority).optional(),
        dueDate: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedTask = await ctx.prisma.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
        },
      });
      return updatedTask;
    }),

  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.task.delete({
        where: { id: input.id },
      });
    }),

  allTasks: publicProcedure.query(async ({ ctx }) => {
    const tasks: Task[] = await ctx.prisma.task.findMany();
    return tasks;
  }),

  allProjectTasks: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const tasks: Task[] = await ctx.prisma.task.findMany({
        where: { projectId: input.id },
      });
      return tasks;
    }),

  getTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.id },
      });
      return task;
    }),

  assignUser: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const task = await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          assignee: {
            connect: { id: input.userId },
          },
        },
      });
      return task;
    }),
});
