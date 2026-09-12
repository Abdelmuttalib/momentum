import type { TaskStatus } from "@prisma/client";
import { CreateTask } from "./forms/create-task";
import { cn } from "@/lib/cn";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TaskView from "./task-view";
import { Text } from "@/components/typography";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useSession } from "next-auth/react";
import { type GetProjectTasks } from "@/features/projects/types";
import { type BoardDensity } from "@/features/tasks/hooks/use-board-density";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: GetProjectTasks;
  density?: BoardDensity;
}

export default function TaskBoardColumn({
  status,
  tasks,
  density = "compact",
}: TaskColumnProps) {
  const router = useRouter();

  const [teamId, projectId] = [
    router.query.teamId,
    router.query.projectId,
  ] as string[];

  const { data: session } = useSession();
  const companyId = session?.user?.company.id;

  const { data: projects } = useProjects(companyId);

  const statusLabel = status.replace("_", " ").toLocaleLowerCase();

  return (
    <div key={status} className="w-72 shrink-0 overflow-hidden rounded-lg">
      <div className="flex items-center justify-between gap-2 px-1 py-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <Text size="sm" weight="medium" as="h2" className="truncate capitalize">
            {statusLabel}
          </Text>
          <Text size="xs" tone="muted" as="span" aria-label={`${tasks.length} tasks`}>
            {tasks.length}
          </Text>
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
                aria-label={`Add task to ${statusLabel}`}
                title={`Add task to ${statusLabel}`}
                className="inline-flex h-7 w-7 whitespace-nowrap"
                variant="ghost"
                size="icon"
              >
                <PlusIcon className="h-4 w-4" />
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
              "max-h-[calc(100vh-16rem)] min-h-[12rem] w-full overflow-y-auto rounded-lg bg-muted/40",
              density === "compact" ? "space-y-1.5 p-1.5" : "space-y-2 p-2",
              {
                "bg-accent": snapshot.isDraggingOver,
              }
            )}
          >
            {tasks.length === 0 && (
              <Text
                size="xs"
                tone="muted"
                className="px-1 py-3 text-center"
              >
                No tasks
              </Text>
            )}
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
                    density={density}
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
