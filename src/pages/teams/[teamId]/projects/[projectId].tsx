/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Layout } from "@/components/layout";
import { prisma } from "@/server/db";
import type {
  GetServerSideProps,
  // InferGetServerSidePropsType
} from "next";

import { getServerAuthSession } from "@/server/auth";
import CreateTask from "@/components/@pages/project/tasks/forms/create-task";
import TaskBoard from "@/components/@pages/project/tasks/task-board";
import Seo from "@/components/Seo";
import type { Project } from "@prisma/client";

// type ProjectPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
type ProjectPageProps = {
  project: Project;
};

const ProjectPage = ({
  project,
}: // teamId
ProjectPageProps) => {
  return (
    <>
      <Seo
        title={`${project?.name} | Momentum`}
        description={`${project?.name} tasks board | Momentum`}
      />
      <Layout pageTitle="Board" rightSideActions={<CreateTask />}>
        <div className="bg-gray-200 dark:bg-background md:px-4">
          {project?.id && <TaskBoard projectId={project.id} />}
        </div>
      </Layout>
    </>
  );
};

export default ProjectPage;

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
    },
  };
};
