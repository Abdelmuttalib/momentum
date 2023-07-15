import { z } from "zod";

export const createOrgWithAdminAccountFormSchema = z.object({
  firstName: z.string().min(2).max(15).nonempty(),
  lastName: z.string().min(2).max(15).nonempty(),
  company: z.string().min(3),
  email: z.string().min(4).email().nonempty(),
  password: z.string().min(8).nonempty(),
});
