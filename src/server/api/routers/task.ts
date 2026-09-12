/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TaskStatus, type Task, type Label } from "@prisma/client";
import { taskFormSchema, updateTaskSchema } from "@/schema";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(taskFormSchema)
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const tasksByStatus = await ctx.prisma.task.findMany({
        where: {
          companyId: companyId,
          projectId: input.projectId,
          status: input.status,
        },
      });

      const orderIndex = tasksByStatus.length;

      const labelIds = (input.labels ?? "")
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean);

      const newTask = await ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.description || null,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate || null,
          projectId: input.projectId,
          companyId: companyId,
          assigneeId: input.assigneeId,
          orderIndex: orderIndex,

          ...(labelIds.length
            ? {
                labels: {
                  connect: labelIds.map((id) => ({ id })),
                },
              }
            : {}),
          // company: {
          //   connect: { id: companyId },
          // },
        },
      });
      return newTask;
    }),

  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const existing = await ctx.prisma.task.findUnique({
        where: { id: input.id },
        select: { companyId: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const updatedTask = await ctx.prisma.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
          assigneeId: input.assigneeId,
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
      const companyId = ctx.session.user.company.id;
      const existing = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        select: { companyId: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
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
      const companyId = ctx.session.user.company.id;
      const taskIds = input.map((t) => t.taskId);
      const ownedCount = await ctx.prisma.task.count({
        where: { id: { in: taskIds }, companyId },
      });
      if (ownedCount !== taskIds.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
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
      const companyId = ctx.session.user.company.id;
      const existing = await ctx.prisma.task.findUnique({
        where: { id: input.id },
        select: { companyId: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
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

  getTask: protectedProcedure
    .input(z.object({ taskId: z.string(), companyId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const task = await ctx.prisma.task.findFirst({
        where: { id: input.taskId, companyId },
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
        },
      });
      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return task;
    }),

  getTasks: protectedProcedure
    .input(z.object({ companyId: z.string().optional() }))
    .query(async ({ ctx }) => {
      const companyId = ctx.session.user.company.id;
      const tasks = await ctx.prisma.task.findMany({
        where: {
          companyId,
        },
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

        orderBy: {
          updatedAt: "desc",
        },
      });
      return tasks;
    }),

  getAllProjectTasks: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, companyId },
        select: { id: true },
      });
      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const projectTasks: Task[] = await ctx.prisma.task.findMany({
        where: { projectId: input.projectId, companyId },
        include: {
          labels: true,
          assignee: true,
          comments: true,
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
      const companyId = ctx.session.user.company.id;
      const task = await ctx.prisma.task.findFirst({
        where: { id: input.id, companyId },
      });
      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return task;
    }),

  getRecentTasks: protectedProcedure
    .input(z.object({ companyId: z.string().optional() }))
    .query(async ({ ctx }) => {
      const companyId = ctx.session.user.company.id;
      const tasks = await ctx.prisma.task.findMany({
        where: { companyId },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          labels: true,
          assignee: true,
          comments: true,
        },
      });
      return tasks;
    }),

  getActiveTasks: protectedProcedure
    .input(z.object({ companyId: z.string().optional() }))
    .query(async ({ ctx }) => {
      const companyId = ctx.session.user.company.id;
      const tasks = await ctx.prisma.task.findMany({
        where: {
          companyId,
          status: {
            in: [TaskStatus.TO_DO, TaskStatus.IN_PROGRESS],
          },
        },
      });
      return tasks;
    }),

  assignUser: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const existing = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        select: { companyId: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const assignee = await ctx.prisma.user.findFirst({
        where: { id: input.userId, companyId },
        select: { id: true },
      });
      if (!assignee) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
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

  markAsDone: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const existing = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        select: { companyId: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const task = await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          status: TaskStatus.COMPLETED,
        },
      });
      return task;
    }),

  moveToBacklog: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const existing = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        select: { companyId: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const task = await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          status: TaskStatus.BACKLOG,
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

  // model Comment {
  //   id        String   @id @default(uuid())
  //   content   String
  //   createdAt DateTime @default(now())
  //   updatedAt DateTime @updatedAt
  //   authorId  String
  //   author    User     @relation(fields: [authorId], references: [id])
  //   taskId    String?
  //   task      Task?    @relation(fields: [taskId], references: [id])
  // }

  getTaskComments: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const task = await ctx.prisma.task.findFirst({
        where: { id: input.taskId, companyId },
        select: { id: true },
      });
      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const comments = await ctx.prisma.comment.findMany({
        where: { taskId: input.taskId },
        include: {
          author: true,
        },
      });
      return comments;
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        comment: z.string(),
        authorId: z.string(),
        taskId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      if (input.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const task = await ctx.prisma.task.findFirst({
        where: { id: input.taskId, companyId },
        select: { id: true },
      });
      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const newComment = await ctx.prisma.comment.create({
        data: {
          comment: input.comment,
          authorId: input.authorId,
          taskId: input.taskId,
        },
      });
      return newComment;
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.string(), authorId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const existing = await ctx.prisma.comment.findUnique({
        where: { id: input.id },
        include: { task: { select: { companyId: true } } },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (
        existing.task &&
        existing.task.companyId !== ctx.session.user.company.id
      ) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await ctx.prisma.comment.delete({
        where: { id: input.id },
      });
    }),
});
