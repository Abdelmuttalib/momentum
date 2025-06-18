import { type User } from "@prisma/client";
import { type Session } from "next-auth";

export function getUserName(user: User | null | Session["user"]) {
  if (!user) return "";
  return `${user.name}`;
}

export function getUserInitials(user: User) {
  if (!user) return "";
  if (!user.name) return "";

  return `${user.name?.[0]}`;
}

export function getUserImageAvatarSrc(user: User | null | Session["user"]) {
  const randomString = Math.random().toString(36).substring(2, 15);
  if (!user) return `https://avatar.vercel.sh/${randomString}`;
  return `https://avatar.vercel.sh/${user?.email}${user?.id}`;
}
