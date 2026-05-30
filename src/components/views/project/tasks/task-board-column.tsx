import type { Task as TaskType, TaskStatus } from "@prisma/client";
import { CreateTask } from "./forms/create-task";
import { cn } from "@/lib/cn";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TaskView from "./task-view";
import { Typography } from "@/components/ui/typography";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useSession } from "next-auth/react";
import { type GetProjectTasks } from "@/features/projects/types";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: GetProjectTasks;
}

export default function TaskBoardColumn({ status, tasks }: TaskColumnProps) {
  console.log("TASKS->COLUMN", status, tasks);
  const router = useRouter();

  const [teamId, projectId] = [
    router.query.teamId,
    router.query.projectId,
  ] as string[];

  const { data: session } = useSession();
  const companyId = session?.user?.company.id;

  const { data: projects } = useProjects(companyId);

  return (
    <div key={status} className="h-full w-full overflow-hidden rounded-lg">
      <div className="flex items-center justify-between gap-3 py-1">
        <div className="flex items-center gap-1">
          <Typography variant="sm/medium" className="capitalize">
            {status.replace("_", " ").toLocaleLowerCase()}
          </Typography>
          <span className="rounded-full px-2.5 py-0.5 text-sm">
            {tasks.length}
          </span>
        </div>
        <div>
          <CreateTask
            type="column"
            status={status}
            projects={projects}
            projectId={projectId}
            triggerButton={
              <Button
                type="button"
                className="ml-2 inline-flex gap-1 whitespace-nowrap"
                variant="ghost"
                size="icon-sm"
              >
                <PlusIcon className="w-5" />
              </Button>
            }
          />
        </div>
      </div>
      <Droppable
        droppableId={status}
        direction="vertical"
        // type="task"
        // key={status}
      >
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "h-full min-h-[75svh] w-full space-y-4 rounded py-4",
              {
                "bg-secondary": snapshot.isDraggingOver,
              }
            )}
          >
            {tasks?.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided) => (
                  <TaskView
                    draggableProps={provided.draggableProps}
                    dragHandleProps={provided.dragHandleProps}
                    innerRef={provided.innerRef}
                    task={task}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
