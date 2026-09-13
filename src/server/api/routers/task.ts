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
import { safeUserSelect, safeUserSummarySelect } from "@/server/db/selects";
import { applyTaskStatusLifecycle } from "@/server/tasks/lifecycle";
import {
  requireLabelInCompany,
  requireProjectInCompany,
  requireUserInCompany,
} from "@/server/authz";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(taskFormSchema)
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      if (!input.projectId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "projectId is required",
        });
      }
      // Server-derived scope: never trust client-supplied ids as proof of
      // authorization.
      await requireProjectInCompany(ctx.prisma, input.projectId, companyId);
      if (input.assigneeId) {
        await requireUserInCompany(ctx.prisma, input.assigneeId, companyId);
      }
      const labelIds = (input.labels ?? "")
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean);
      for (const labelId of labelIds) {
        await requireLabelInCompany(ctx.prisma, labelId, companyId);
      }
      const tasksByStatus = await ctx.prisma.task.findMany({
        where: {
          companyId: companyId,
          projectId: input.projectId,
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
          effortPoints: input.effortPoints ?? null,
          dueDate: input.dueDate || null,
          projectId: input.projectId,
          companyId: companyId,
          assigneeId: input.assigneeId,
          orderIndex: orderIndex,
          ...applyTaskStatusLifecycle(null, input.status),

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
        select: { companyId: true, status: true, startedAt: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (input.assigneeId) {
        await requireUserInCompany(ctx.prisma, input.assigneeId, companyId);
      }
      const updatedTask = await ctx.prisma.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          ...(input.effortPoints !== undefined
            ? { effortPoints: input.effortPoints }
            : {}),
          dueDate: input.dueDate,
          assigneeId: input.assigneeId,
          ...applyTaskStatusLifecycle(existing, input.status),
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
        select: { companyId: true, status: true, startedAt: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const updatedTask = await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          status: input.status,
          ...applyTaskStatusLifecycle(existing, input.status),
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
      // One read for all previous states (no N+1); patches computed in memory.
      const previous = await ctx.prisma.task.findMany({
        where: { id: { in: taskIds }, companyId },
        select: { id: true, status: true, startedAt: true },
      });
      const prevById = new Map(previous.map((t) => [t.id, t]));
      const updatedTasks = await Promise.all(
        input.map(async ({ taskId, status, orderIndex }) => {
          const prev = prevById.get(taskId) ?? null;
          const updatedTask = await ctx.prisma.task.update({
            where: { id: taskId },
            data: {
              status: status,
              orderIndex: orderIndex,
              ...(prev
                ? applyTaskStatusLifecycle(prev, status)
                : {}),
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
          assignee: { select: safeUserSelect },
          comments: {
            select: {
              id: true,
              comment: true,
              createdAt: true,
              updatedAt: true,
              authorId: true,
              taskId: true,
              author: { select: safeUserSummarySelect },
            },
          },
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
          assignee: { select: safeUserSelect },
          comments: {
            select: {
              id: true,
              comment: true,
              createdAt: true,
              updatedAt: true,
              authorId: true,
              taskId: true,
              author: { select: safeUserSummarySelect },
            },
          },
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
        select: { companyId: true, status: true, startedAt: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const task = await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          status: TaskStatus.COMPLETED,
          ...applyTaskStatusLifecycle(existing, TaskStatus.COMPLETED),
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
        select: { companyId: true, status: true, startedAt: true },
      });
      if (!existing || existing.companyId !== companyId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const task = await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: {
          status: TaskStatus.BACKLOG,
          ...applyTaskStatusLifecycle(existing, TaskStatus.BACKLOG),
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
        name: z.string().min(1).max(100),
        color: z.string().min(1).max(32),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const newLabel: Label = await ctx.prisma.label.create({
        data: {
          name: input.name,
          color: input.color,
          companyId,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return newLabel;
    }),

  getLabels: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.session.user.company.id;
    const labels: Label[] = await ctx.prisma.label.findMany({
      where: { companyId },
    });
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
        select: {
          id: true,
          comment: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
          taskId: true,
          author: { select: safeUserSummarySelect },
        },
      });
      return comments;
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        comment: z.string().min(1).max(2000),
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
          // Author is always the authenticated user; the input id above is
          // only accepted when it matches the session.
          authorId: ctx.session.user.id,
          taskId: input.taskId,
        },
      });
      return newComment;
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Ownership is proven by the stored authorId, never by client input.
      const existing = await ctx.prisma.comment.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          authorId: true,
          task: { select: { companyId: true } },
        },
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
      const isAuthor = existing.authorId === ctx.session.user.id;
      if (!isAuthor) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await ctx.prisma.comment.delete({
        where: { id: input.id },
      });
    }),
});
