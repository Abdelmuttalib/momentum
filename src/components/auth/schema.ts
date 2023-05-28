import { z } from "zod";

export const createOrgWithAdminAccountFormSchema = z.object({
  firstName: z.string().min(2).max(15).nonempty(),
  lastName: z.string().min(2).max(15).nonempty(),
  organization: z.string().min(3),
  email: z.string().min(4).email().nonempty(),
  phoneNumber: z
    .string()
    .regex(/^1[3-9]\d{9}$/)
    .nonempty(),
  password: z.string().min(8).nonempty(),
});
