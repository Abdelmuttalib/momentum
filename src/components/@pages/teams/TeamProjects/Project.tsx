import type { Project } from "@prisma/client";
import Link from "next/link";
import {
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Badge from "@/components/ui/badge";
import { getProjectStatusBadgeColor } from "@/utils/getBadgeColor";
import { formatFullDate } from "@/utils/formatFullDate";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";

export function FollowLinkArrowIcon({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-full p-1.5", className)}>
      <ArrowTopRightOnSquareIcon className="w-5" />
    </div>
  );
}

export default function Project({ id, name, status, createdAt }: Project) {
  const { asPath } = useRouter();
  const projectLink = `${asPath}/projects/${id}`;

  return (
    <Link
      href={projectLink}
      className="hover:border-primary-100 hover:bg-primary-50 group relative flex h-36 flex-col justify-between rounded-lg border-2 border-gray-200 bg-white px-6 py-4 transition-all duration-200 ease-in-out hover:border-gray-800 hover:bg-brand-100/20 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-300"
    >
      <FollowLinkArrowIcon className="absolute -right-2 -top-2 mt-2 hidden bg-gray-900 text-gray-100 group-hover:mt-0 group-hover:block dark:bg-gray-200 dark:text-gray-900" />
      <div className="truncate">
        <span className="truncate whitespace-nowrap text-sm text-gray-600">
          Created: {formatFullDate(createdAt)}
        </span>
      </div>
      <div className="flex w-full justify-between">
        <h3 className="label-lg">{name}</h3>
        <ChevronRightIcon className="w-7" />
      </div>
      <div>
        <Badge
          color={getProjectStatusBadgeColor(status)}
          className="capitalize"
        >
          {status.replace("_", " ").toLowerCase()}
        </Badge>
      </div>
    </Link>
  );
}

export function ProjectLoader() {
  return (
    <div className="flex h-36 flex-col justify-between rounded-lg border-2 border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="truncate">
        <Skeleton className="h-6 w-52" />
      </div>
      <div className="flex w-full justify-between">
        <Skeleton className="h-6 w-36" />

        <Skeleton className="h-6 w-6" />
      </div>
      <div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}
