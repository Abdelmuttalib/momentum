import { useProjectTasks } from "@/features/projects/hooks/use-tasks";
import { DataLoader } from "@/components/data-loader";
import { AppLayout } from "@/components/layout/app-layout";
import TaskBoard from "@/components/views/project/tasks/task-board";
import { BoardHeader } from "@/components/views/project/tasks/board-header";
import { useBoardDensity } from "@/features/tasks/hooks/use-board-density";
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
  const { data: tasks, isLoading, error } = useProjectTasks(projectId);
  const [density, setDensity] = useBoardDensity();

  return (
    <>
      <AppLayout>
        <DataLoader data={tasks} isLoading={isLoading} error={error}>
          {(data) => (
            <div className="flex flex-col gap-3">
              <BoardHeader
                projectId={projectId}
                projectName={project.name}
                projectDescription={project.description}
                taskCount={data.length}
                density={density}
                onDensityChange={setDensity}
              />
              <TaskBoard
                projectId={projectId}
                tasks={data}
                density={density}
              />
            </div>
          )}
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
  const companyId = userSession?.user?.company?.id;

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

  if (companyId !== project.companyId) {
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
