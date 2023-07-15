import { Layout } from "@/components/layout";
import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import type { Team } from "@prisma/client";
import type { GetServerSideProps } from "next";
import Link from "next/link";

interface DashboardPageProps {
  teams: Team[];
}

export default function DashboardPage({ teams }: DashboardPageProps) {
  return (
    <Layout pageTitle="Dashboard">
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {teams &&
          teams.map((team) => (
            <Link
              key={team.id}
              href={`/dashboard/team/${team.id}`}
              className="dark:text-primary-100 dark:hover:text-primary-300 flex h-36 items-center justify-between rounded-lg border-2 border-gray-200 bg-white/[0.3] px-6 hover:border-gray-800 dark:border-2 dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="h5">{team.name}</h3>
              <ChevronRightIcon className="w-7" />
            </Link>
          ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const companyId = session.user.companyId;

  const teams = await prisma.team.findMany({
    where: {
      companyId,
    },
  });

  return {
    props: {
      teams,
    },
  };
};
