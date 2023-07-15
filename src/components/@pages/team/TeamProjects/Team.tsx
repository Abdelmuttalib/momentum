import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Team } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { type TTeam } from "../../organization/organization-teams";

export default function Team({ id, name, users, projects }: TTeam) {
  const { asPath } = useRouter();
  const projectLink = `${asPath}/${id}`;
  return (
    <Link
      href={projectLink}
      className="hover:border-primary-100 hover:bg-primary-50 flex h-24 justify-between rounded-lg border-2 border-gray-200 bg-white px-6 py-6 hover:border-gray-800"
    >
      <div>
        <div className="flex w-full">
          <h3 className="h5">{name}</h3>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <p>Members: {users.length}</p>
          <p>Projects: {projects.length}</p>
        </div>
      </div>
      <ChevronRightIcon className="w-7" />
    </Link>
  );
}
