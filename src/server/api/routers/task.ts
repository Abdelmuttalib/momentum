/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

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
    .input(updateTaskSchema)
    .mutation(async ({ input, ctx }) => {
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

  getTask: protectedProcedure
    .input(z.object({ taskId: z.string(), companyId: z.string() }))
    .query(async ({ input, ctx }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
      });
      return task;
    }),

  getTasks: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: {
          companyId: input.companyId,
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
      const projectTasks: Task[] = await ctx.prisma.task.findMany({
        where: { projectId: input.projectId },
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
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.id },
      });
      return task;
    }),

  getRecentTasks: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ input, ctx }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: { companyId: input.companyId },
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
    .input(z.object({ companyId: z.string() }))
    .query(async ({ input, ctx }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: {
          companyId: input.companyId,
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
        throw new Error("You are not the author of this comment");
      }
      await ctx.prisma.comment.delete({
        where: { id: input.id },
      });
    }),
});
