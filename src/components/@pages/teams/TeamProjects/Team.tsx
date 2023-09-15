// import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import type { TTeam } from "types";
import { UsersIcon } from "@heroicons/react/20/solid";
import { UserAvatar } from "@/components/user/UserMenu";
import { FollowLinkArrowIcon } from "./Project";

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
      className="hover:border-primary-100 hover:bg-primary-50 group relative flex flex-col justify-between rounded-lg border-2 border-gray-200 hover:border-gray-800 hover:bg-brand-100/20 dark:border-gray-800 dark:bg-gray-800/50 dark:bg-gray-900 dark:hover:border-brand-300"
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
    <div className="hover:border-primary-100 hover:bg-primary-50 flex flex-col justify-between rounded-lg border-2 border-gray-200 bg-white hover:border-gray-800 dark:border-gray-800 dark:bg-gray-900">
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
