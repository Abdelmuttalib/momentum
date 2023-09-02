import type { Task as TaskType, TaskStatus } from "@prisma/client";
import CreateTask from "./forms/create-task";
import { cn } from "@/utils/cn";
import Task from "./task";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: TaskType[];
}

export default function TaskBoardColumn({ status, tasks }: TaskColumnProps) {
  return (
    <div
      key={status}
      className="h-full w-full overflow-hidden rounded-lg border shadow-lg dark:border-gray-800/30 dark:bg-gray-800/10"
    >
      <div className="flex items-center justify-between gap-3 bg-gray-50 px-4 py-3 dark:bg-transparent dark:text-gray-300">
        <div className="flex items-center gap-1">
          <h2 className="font-medium capitalize">
            {status.replace("_", " ").toLocaleLowerCase()}
          </h2>
          <span className="rounded-full px-2.5 py-0.5 text-sm">
            {tasks.length}
          </span>
        </div>
        <div>
          <CreateTask type="column" status={status} />
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
              "h-full min-h-[75svh] w-full space-y-4 rounded px-2.5 py-4",
              {
                "bg-brand-100/10 dark:bg-gray-800/20": snapshot.isDraggingOver,
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
                  <Task
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
