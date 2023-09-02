/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TaskStatus, type Task, type Label } from "@prisma/client";
import { Priority } from "@/utils/enums";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        status: z.nativeEnum(TaskStatus),
        priority: z.nativeEnum(Priority),
        dueDate: z.date().optional(),
        projectId: z.string(),
        teamId: z.string(),
        assigneeId: z.string().optional(),
        // labels: z.array(z.string()).optional(),
        labels: z.string(),
        // orderIndex: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const tasksByStatus = await ctx.prisma.task.findMany({
        where: {
          companyId: companyId,
          projectId: input.projectId,
          teamId: input.teamId,
          status: input.status,
        },
      });
      const orderIndex = tasksByStatus.length;

      const newTask = await ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.description || null,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate || null,
          projectId: input.projectId,
          teamId: input.teamId,
          companyId: companyId,
          assigneeId: input.assigneeId,
          orderIndex: orderIndex,

          labels: {
            connect: [
              ...input.labels.split(",").map((label) => ({ id: label })),
            ],
          },
          // company: {
          //   connect: { id: companyId },
          // },
        },
      });
      return newTask;
    }),

  update: protectedProcedure
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

  updateTaskStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        status: z.nativeEnum(TaskStatus),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedTask = await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          status: input.status,
        },
      });
      return updatedTask;
    }),

  updateTasksStatuses: protectedProcedure
    .input(
      z.array(
        z.object({
          taskId: z.string(),
          status: z.nativeEnum(TaskStatus),
          orderIndex: z.number(),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      const updatedTasks = await Promise.all(
        input.map(async ({ taskId, status, orderIndex }) => {
          const updatedTask = await ctx.prisma.task.update({
            where: { id: taskId },
            data: {
              status: status,
              orderIndex: orderIndex,
            },
          });
          return updatedTask;
        })
      );
      return updatedTasks;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.task.delete({
        where: { id: input.id },
      });
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.session.user.company.id;
    const tasks: Task[] = await ctx.prisma.task.findMany({
      where: { companyId: companyId },
    });
    return tasks;
  }),

  getAllProjectTasks: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input, ctx }) => {
      const projectTasks: Task[] = await ctx.prisma.task.findMany({
        where: { projectId: input.projectId },
        include: {
          labels: true,
          assignee: true,
        },
        orderBy: {
          orderIndex: "asc",
        },
      });
      return projectTasks;
    }),

  getTaskById: protectedProcedure
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

  // updateAllTasks: protectedProcedure
  //   .input(
  //     z.object({
  //       tasks: z
  //         .object({
  //           id: z.string(),
  //           title: z.string(),
  //           description: z.string(),
  //           status: z.string(),
  //           priority: z.string(),
  //           createdAt: z.coerce().date(),
  //           updatedAt: z.coerce().date(),
  //           dueDate: z.null(),
  //           assigneeId: z.null(),
  //           projectId: z.string(),
  //           teamId: z.string(),
  //           companyId: z.string(),
  //           orderIndex: z.number(),
  //           labels: z
  //             .object({
  //               id: z.string(),
  //               name: z.string(),
  //               color: z.string(),
  //             })
  //             .array(),
  //         })
  //         .array(),
  //       //
  //       projectId: z.string(),
  //       teamId: z.string(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const companyId = ctx.session.user.company.id;
  //     const updatedTasks = await ctx.prisma.task.updateMany({
  //       where: {
  //         companyId,
  //         projectId: input.projectId,
  //         teamId: input.teamId,
  //       },
  //       data: input.tasks,
  //     });

  //     return updatedTasks;
  //   }),

  // label/task label

  createLabel: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        color: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const newLabel: Label = await ctx.prisma.label.create({
        data: {
          name: input.name,
          color: input.color,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return newLabel;
    }),

  getLabels: protectedProcedure.query(async ({ ctx }) => {
    const labels: Label[] = await ctx.prisma.label.findMany();
    return labels;
  }),
});
