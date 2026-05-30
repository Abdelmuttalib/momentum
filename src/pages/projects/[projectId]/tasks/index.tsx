// app/projects/[id]/page.tsx

import { useProjectTasks } from "@/features/projects/hooks/use-tasks";
import { useRouter } from "next/router";
import { DataLoader } from "@/components/data-loader";
import { AppLayout } from "@/components/layout/app-layout";
import TaskBoard from "@/components/views/project/tasks/task-board";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import { prisma } from "@/server/db";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "BACKLOG" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
};

type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
};

type ProjectPageProps = {
  project: Project;
  projectId: string;
};

export default function ProjectPage({
  project,
  projectId,
}: // teamId
ProjectPageProps) {
  const { query } = useRouter();

  const { data: tasks, isLoading, error } = useProjectTasks(projectId);

  return (
    <>
      <AppLayout>
        <DataLoader data={tasks} isLoading={isLoading} error={null}>
          {(data) => <TaskBoard projectId={projectId} tasks={data} />}
        </DataLoader>
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

  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      userSession: JSON.parse(JSON.stringify(userSession)),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      project: JSON.parse(JSON.stringify(project)),
      projectId: project.id,
    },
  };
};
