import type { Project } from "@prisma/client";
import Link from "next/link";
import {
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { formatFullDate } from "@/utils/date";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/ui/typography";

export function FollowLinkArrowIcon({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-full p-1.5", className)}>
      <ArrowTopRightOnSquareIcon className="w-5" />
    </div>
  );
}

export default function Project({ id, name, createdAt, teamId }: Project) {
  const projectLink = `/teams/${teamId}/projects/${id}`;

  return (
    <Link
      href={projectLink}
      className="card group relative flex h-36 flex-col justify-between rounded border border-border text-foreground"
    >
      <div className="truncate">
        <Typography
          variant="sm/normal"
          className="truncate whitespace-nowrap text-muted-foreground"
        >
          Created: {formatFullDate(createdAt)}
        </Typography>
      </div>
      <div className="flex w-full items-center justify-between">
        <Typography variant="lg/medium">{name}</Typography>
        <ChevronRightIcon className="w-7" />
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
