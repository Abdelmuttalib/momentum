// import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import type { TTeam } from "types";
import { UserAvatar } from "@/components/user/user-menu";
import { FollowLinkArrowIcon } from "./Project";
import { Folder, FoldersIcon, UsersIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";

interface TeamProps {
  team: TTeam;
}

export default function Team({ team }: TeamProps) {
  const { id, name, users, projects } = team;
  const { asPath } = useRouter();
  const projectLink = `${asPath}/${id}`;
  return (
    <Link
      href={projectLink}
      className="dark:hover:border-brand-300 group relative flex flex-col justify-between rounded-lg border-2 border-gray-200 hover:border-gray-800 hover:border-primary-100 hover:bg-primary-100/20 hover:bg-primary-50 dark:border-gray-800 dark:bg-gray-800/50 dark:bg-gray-900"
    >
      <FollowLinkArrowIcon className="absolute -right-2 -top-2 mt-2 hidden bg-gray-900 text-gray-100 group-hover:mt-0 group-hover:block dark:bg-gray-200 dark:text-gray-900" />
      <div className="flex h-10 w-full items-center rounded-t-lg bg-gray-100 px-4 dark:bg-gray-800/30 dark:text-gray-200">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-5" />
          <h3 className="font-medium">{name}</h3>
        </div>
      </div>
      <div className="px-4 py-4">
        <div>
          <div className="flex w-full"></div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <p>{projects.length} Projects</p>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <p>{users.length} Members</p>
            <div className="flex -space-x-2">
              {users.map((user) => (
                <UserAvatar
                  key={user.id}
                  user={user}
                  triggerClassName="border border-gray-500"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TeamLoader() {
  return (
    <div className="flex flex-col justify-between rounded-lg border-2 border-gray-200 bg-layer hover:border-gray-800 hover:bg-primary-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-10 w-full items-center rounded-t-lg bg-gray-100 px-4 dark:bg-gray-800/30 dark:text-gray-200">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-5" />
          <Skeleton className="h-6 w-32 rounded" />
        </div>
      </div>
      <div className="w-full space-y-2 px-4 py-4">
        <div className="flex w-full flex-col gap-1 text-sm">
          <Skeleton className="h-5 w-24 rounded" />
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-5 w-24 rounded" />
            <div className="flex items-center -space-x-2">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-9 w-9 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <Skeleton className="mt-2 h-6 w-4 rounded" /> */}
    </div>
  );
}

export function TeamCard({ team }: TeamProps) {
  const { id, name, users, projects } = team;
  const { asPath } = useRouter();
  const projectLink = `${asPath}/${id}`;

  return (
    <Link href={projectLink}>
      <div className="card group relative flex cursor-pointer flex-col justify-center gap-y-6 rounded border-2">
        <div className="inline-flex items-center gap-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://avatar.vercel.sh/${name}.png`}
              alt={name}
            />
            <AvatarFallback className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-700 to-primary-500"></AvatarFallback>
          </Avatar>
          <Typography variant="xl/medium">{name}</Typography>
        </div>

        <div className="flex flex-col gap-y-3 justify-self-end px-1 text-foreground-light">
          <div className="flex items-center gap-x-6">
            <div className="inline-flex items-center gap-x-2 truncate rounded bg-accent-hover px-3 py-2 font-medium">
              <FoldersIcon className="h-5 w-5" />
              <Typography
                variant="sm/regular"
                className="truncate whitespace-nowrap text-foreground-light"
              >
                {projects?.length} Projects
              </Typography>
            </div>
            <div className="inline-flex items-center gap-x-2 truncate rounded bg-accent-hover px-3 py-2 font-medium">
              <UsersIcon className="h-5 w-5" />
              <Typography
                variant="sm/regular"
                className="truncate whitespace-nowrap text-foreground-light"
              >
                {users?.length} Members
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
