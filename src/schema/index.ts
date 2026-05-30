import { Priority } from "@/lib/enums";
import { Role, TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

export const createTeamFormSchema = z.object({
  name: z.string().min(1, "team name is required"),
  description: z.string().optional(),
});

export type CreateTeamSchemaType = z.infer<typeof createTeamFormSchema>;

export const inviteUserFormSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role),
});

export type InviteUserSchemaType = z.infer<typeof inviteUserFormSchema>;

export const projectFormSchema = z.object({
  name: z.string().min(2, "Please enter a team name"),
  description: z.string().optional(),
});

export type CreateProjectSchemaType = z.infer<typeof projectFormSchema>;
export type ProjectFormSchemaType = z.infer<typeof projectFormSchema>;

export const createCompanyFormSchema = z.object({
  name: z.string().min(3, { message: "company name is too short" }),
});

export type CreateCompanySchemaType = z.infer<typeof createCompanyFormSchema>;

export const createAdminAccountFormSchema = z
  .object({
    name: z.string().min(2, { message: "name is too short" }).max(15),
    email: z.string().min(4).email("kindly enter a valid email."),
    company: z.string().min(4, { message: "Company name is too short" }),
    password: z
      .string()
      .min(8, { message: "password must be at least 8 characters" })
      .max(50),
    confirmPassword: z
      .string()
      .min(8, { message: "password must be at least 8 characters" })
      .max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwords do not match",
  });

export type CreateAdminAccountSchemaType = z.infer<
  typeof createAdminAccountFormSchema
>;

export const createCompanyWithAdminAccountFormSchema = z.object({
  name: z.string().min(2).max(15),
  company: z.string().min(3),
  email: z.string().min(4).email(),
  password: z.string().min(8),
});

export const taskFormSchema = z.object({
  title: z.string().min(1, "Please enter a team name"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.date().nullable().optional(),
  assigneeId: z.string().optional(),
  labels: z.string().optional(),
  projectId: z.string().optional(),
});

export const updateTaskSchema = taskFormSchema.extend({
  id: z.string(),
  projectId: z.string(),
});

export type CreateTaskSchemaType = z.infer<typeof taskFormSchema>;

export type TaskFormSchemaType = z.infer<typeof taskFormSchema>;

export type UpdateTaskSchemaType = z.infer<typeof updateTaskSchema>;

export const registerUserFormSchema = z
  .object({
    name: z.string().min(2, "first name must be at least 2 characters"),
    email: z
      .string()
      .min(4, "email must be at least 4 characters")
      .email("invalid email format")
      .nonempty("email cannot be empty"),
    password: z.string().min(8, "password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwords do not match",
  });

export type RegisterUserSchemaType = z.infer<typeof registerUserFormSchema>;

export const createLabelFormSchema = z.object({
  name: z.string().min(2, "name must be at least 3 characters"),
  color: z.string(), // You might need to adjust the color validation here
});

export type CreateLabelSchemaType = z.infer<typeof createLabelFormSchema>;
