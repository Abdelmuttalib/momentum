import type { Task as TaskType, TaskStatus } from "@prisma/client";
import { CreateTask } from "./forms/create-task";
import { cn } from "@/utils/cn";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TaskView from "./task-view";
import { Typography } from "@/components/ui/typography";
import { useRouter } from "next/router";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: TaskType[];
}

export default function TaskBoardColumn({ status, tasks }: TaskColumnProps) {
  const router = useRouter();

  const [teamId, projectId] = [router.query.teamId, router.query.projectId] as [
    string,
    string
  ];

  return (
    <div key={status} className="h-full w-full overflow-hidden rounded-lg">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
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
            teamId={teamId}
            projectId={projectId}
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
