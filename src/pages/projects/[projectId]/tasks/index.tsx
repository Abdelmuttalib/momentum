import { useProjectTasks } from "@/features/projects/hooks/use-tasks";
import { DataLoader } from "@/components/data-loader";
import { AppLayout } from "@/components/layout/app-layout";
import TaskBoard from "@/components/views/project/tasks/task-board";
import { BoardHeader } from "@/components/views/project/tasks/board-header";
import { useBoardDensity } from "@/features/tasks/hooks/use-board-density";
import { requireAuthPage } from "@/server/auth-guard";
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

export const getServerSideProps: GetServerSideProps = requireAuthPage(
  {},
  async (ctx, session) => {
    const companyId = session.user.company.id;
    const projectId = ctx.params?.projectId as string;
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      project: JSON.parse(JSON.stringify(project)),
      projectId: project.id,
    };
  }
);
