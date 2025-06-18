/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { prisma } from "@/server/db";
import type {
  GetServerSideProps,
  // InferGetServerSidePropsType
} from "next";

import { getServerAuthSession } from "@/server/auth";
import { CreateTask } from "@/components/views/project/tasks/forms/create-task";
import TaskBoard from "@/components/views/project/tasks/task-board";
import { Seo } from "@/components/seo";
import type { Project } from "@prisma/client";
import { AppLayout } from "@/components/layout/app-layout";

// type ProjectPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
type ProjectPageProps = {
  project: Project;
  projectId: string;
  teamId: string;
};

export default function ProjectPage({
  project,
  projectId,
  teamId,
}: // teamId
ProjectPageProps) {
  return (
    <>
      <Seo
        title={`${project?.name} | Momentum`}
        description={`${project?.name} tasks board | Momentum`}
      />
      <AppLayout>
        {/* pageTitle="Board" rightSideActions={<CreateTask />} */}

        <CreateTask teamId={teamId} projectId={projectId} />

        <div>{project?.id && <TaskBoard projectId={project.id} />}</div>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const teamId = params?.teamId as string;
  const projectId = params?.projectId as string;
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    return {
      notFound: true,
    };
  }

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      userSession: JSON.parse(JSON.stringify(userSession)),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      project: JSON.parse(JSON.stringify(project)),
      teamId,
      team,
      projectId: project.id,
    },
  };
};
