import type { Project } from "@prisma/client";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Badge from "@/components/ui/badge";
import { getProjectStatusBadgeColor } from "@/utils/getBadgeColor";
import { formatFullDate } from "@/utils/formatFullDate";

export default function Project({ id, name, status, createdAt }: Project) {
  const { asPath } = useRouter();
  const projectLink = `${asPath}/projects/${id}`;

  return (
    <Link
      href={projectLink}
      className="flex h-36 flex-col justify-between rounded-lg border-2 border-gray-200 bg-white px-6 py-4 hover:border-primary-100 hover:bg-primary-50"
    >
      <div className="truncate">
        <span className="truncate whitespace-nowrap text-sm text-gray-600">
          Created: {formatFullDate(createdAt)}
        </span>
      </div>
      <div className="flex w-full justify-between">
        <h3 className="h5">{name}</h3>
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
