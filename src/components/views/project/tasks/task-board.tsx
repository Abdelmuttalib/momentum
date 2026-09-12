/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";
import type { Project, Task as TaskType, TaskStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { toast } from "sonner";
// import TaskView from "./task-view";
import { TaskStatus as TaskStatusNativeEnum } from "@/lib/enums";
import { Skeleton } from "@/components/ui/skeleton";
import TaskBoardColumn from "./task-board-column";
import { type GetProjectTasks } from "@/features/projects/types";
import { type BoardDensity } from "@/features/tasks/hooks/use-board-density";
import { EmptyState } from "@/components/common/empty-state";
import { ButtonLink } from "@/components/common/button-link";
import { routes } from "@/lib/routes";

export default function TaskBoard({
  tasks,
  projectId,
  density = "compact",
}: {
  tasks: GetProjectTasks;
  projectId: Project["id"];
  density?: BoardDensity;
}) {
  const taskStatuses = Object.keys(TaskStatusNativeEnum) as TaskStatus[];
  // const { data: tasks, isLoading: isLoadingTasks } =
  //   api.task.getAllProjectTasks.useQuery(
  //     {
  //       projectId: projectId,
  //     },
  //     {
  //       enabled: !!projectId,
  //     }
  //   );

  const [currentTasks, setCurrentTasks] = useState(tasks);

  const apiContext = api.useContext();

  const updateTasksStatusesMutation = api.task.updateTasksStatuses.useMutation({
    onSuccess: async () => {
      await apiContext.task.getAllProjectTasks.invalidate();
      toast.success("Tasks updated successfully.");
    },

    onError: () => {
      toast.error("Something went wrong. Please try again later.");
    },
  });

  useEffect(() => {
    setCurrentTasks(tasks);
  }, [tasks]);


  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId: taskId } = result;

    // If the task was not dropped in a valid destination, return
    if (!destination) {
      return;
    }

    // if (source.index === destination.index) {
    //   return;
    // }

    // If the draggable is dropped outside of a droppable
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const crtTasks = currentTasks || [];

    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    // Find the task being dragged
    const draggedTask = crtTasks.find((task) => task.id.toString() === taskId);

    if (!draggedTask) return;

    // Remove the dragged task from the tasks array
    const tasksWithoutDragged = crtTasks.filter(
      (task) => task.id.toString() !== taskId
    );

    // Insert the dragged task at the appropriate index in the destination column
    const updatedTasks = [...tasksWithoutDragged];
    const destinationTasks = updatedTasks.filter(
      (task) => task.status === destinationStatus
    );
    const sourceTasks = updatedTasks.filter(
      (task) => task.status === sourceStatus
    );
    const otherTasks = updatedTasks.filter(
      (task) =>
        task.status !== destinationStatus && task.status !== sourceStatus
    );

    if (destinationTasks.length === 0) {
      setCurrentTasks([
        ...sourceTasks,
        {
          ...draggedTask,
          status: destinationStatus as TaskStatus,
          orderIndex: destination.index || 0,
        },
        ...otherTasks,
      ]);

      await updateTasksStatusesMutation.mutateAsync(
        [
          ...sourceTasks,
          {
            ...draggedTask,
            status: destinationStatus as TaskStatus,
            orderIndex: destination.index || 0,
          },
          ...otherTasks,
        ].map((t) => ({
          taskId: t.id,
          status: t.status,
          orderIndex: t.orderIndex,
        }))
      );
      return;
    }

    // If the task is dropped in the same column/status
    if (sourceStatus === destinationStatus) {
      destinationTasks.splice(destination.index, 0, {
        ...draggedTask,
        orderIndex: destination.index,
      });

      // Update the order indices for tasks in the same column
      destinationTasks
        .filter((task) => task.status === destinationStatus)
        .forEach((task, index) => {
          task.orderIndex = index;
        });

      setCurrentTasks(
        [...destinationTasks, ...otherTasks].sort(
          (a, b) => a.orderIndex - b.orderIndex
        )
      );

      await updateTasksStatusesMutation.mutateAsync(
        [...destinationTasks, ...otherTasks].map((t) => ({
          taskId: t.id,
          status: t.status,
          orderIndex: t.orderIndex,
        }))
      );

      return;
    }
    // if the task is dropped in a different column/status
    else if (sourceStatus !== destinationStatus) {
      const finalDestinationTasks = [];

      destinationTasks.forEach((task, index) => {
        if (index === destination.index) {
          finalDestinationTasks.push({
            ...draggedTask,
            status: destinationStatus as TaskStatus,
            orderIndex: destination.index,
          });
          finalDestinationTasks.push({
            ...task,
            orderIndex: destination.index + 1,
          });
        } else if (index !== destination.index) {
          finalDestinationTasks.push({
            ...task,
            orderIndex: index > destination.index ? index + 1 : index,
          });
        }
      });

      // if the task is dropped at the end of the column
      if (destinationTasks.length === destination.index) {
        finalDestinationTasks.push({
          ...draggedTask,
          status: destinationStatus as TaskStatus,
          orderIndex: destination.index,
        });
      }

      setCurrentTasks(
        [...sourceTasks, ...finalDestinationTasks, ...otherTasks].sort(
          (a, b) => a.orderIndex - b.orderIndex
        )
      );

      await updateTasksStatusesMutation.mutateAsync(
        [...sourceTasks, ...finalDestinationTasks, ...otherTasks].map((t) => ({
          taskId: t.id,
          status: t.status,
          orderIndex: t.orderIndex,
        }))
      );

      return;
    }
  };

  // const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  // if (isLoadingTasks) {
  //   return (
  //     <div className="relative z-10 flex h-full min-h-[75svh] w-full min-w-fit flex-col justify-between gap-3 overflow-x-auto pb-6 lg:flex-row 2xl:flex-nowrap">
  //       <TaskBoardLoader />
  //     </div>
  //   );
  // }

  return (
    <DragDropContext onDragEnd={(e) => void handleOnDragEnd(e)}>
      {/* {selectedTask && <TaskView task={selectedTask} />} */}
      {currentTasks && currentTasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create the first task to start tracking work on this board."
          action={
            <ButtonLink
              href={routes.projects.tasks.new({ projectId })}
              size="sm"
            >
              New task
            </ButtonLink>
          }
        />
      ) : (
        <div className="flex w-full items-start gap-3 overflow-x-auto pb-4">
          {currentTasks &&
            taskStatuses.map((status) => {
              const tasksForStatus = currentTasks.filter(
                (task) => task.status === status
              );

              return (
                <TaskBoardColumn
                  key={status}
                  status={status}
                  tasks={tasksForStatus}
                  density={density}
                />
              );
            })}
        </div>
      )}
    </DragDropContext>
  );
}

export function TaskBoardLoader() {
  return (
    <div className="flex w-full items-start gap-3 overflow-x-auto pb-4">
      {Object.keys(TaskStatusNativeEnum).map((status) => (
        <div
          key={status}
          className="w-72 shrink-0 overflow-hidden rounded-lg border bg-card"
        >
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-6 rounded-full" />
            </div>
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>

          <div className={cn("space-y-2 rounded-lg bg-muted/40 p-2")}>
            {[1, 2, 3].map((n) => (
              <TaskCardLoader key={n} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskCardLoader() {
  return (
    <div className="rounded-md border bg-card p-2.5">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-3 w-6" />
      </div>
    </div>
  );
}
