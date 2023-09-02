/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Layout } from "@/components/layout";
import { prisma } from "@/server/db";
import { TaskStatus } from "@prisma/client";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { getServerAuthSession } from "@/server/auth";
import ProjectSwitcher from "@/components/project-switcher";
import TeamSwitcher from "@/components/team-switcher";
import CreateTask from "@/components/@pages/project/tasks/forms/create-task";
import TaskBoard from "@/components/@pages/project/tasks/task-board";

type ProjectPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ProjectPage = ({ project, teamId }: ProjectPageProps) => {
  return (
    <Layout
      // pageTitle={
      //   <div className="flex items-center">
      //     <div className="flex items-center gap-3 text-xl">
      //       Team <TeamSwitcher />
      //     </div>
      //     <span className="mx-2 font-light text-gray-300">/</span>
      //     <div className="flex items-center gap-3 text-xl">
      //       Project <ProjectSwitcher currentProject={project} teamId={teamId} />
      //     </div>
      //   </div>
      // }
      pageTitle=""
    >
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="h4 dark:text-gray-200">Tasks</h1>
          <CreateTask />
        </div>

        <div>{project?.id && <TaskBoard projectId={project.id} />}</div>
      </div>
    </Layout>
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
