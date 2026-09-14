import { Role } from "@prisma/client";

export const isAdmin = (role?: Role | null): boolean => {
  return role === Role.ADMIN;
};

export const isMember = (role?: Role | null): boolean => {
  return role === Role.MEMBER;
};
