/**
 * Allow-listed Prisma selections for user data.
 *
 * INVARIANT: password hashes must never leave the server through
 * application responses. Every query that returns User records (directly or
 * via `include: { users/assignee/author }`) must use one of these selections
 * instead of `true` / bare `findMany`.
 *
 * The secure path is the default path: reach for these first.
 */
export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  companyId: true,
} as const;

/** Lighter variant for nested author/assignee displays. */
export const safeUserSummarySelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  image: true,
} as const;
