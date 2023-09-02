/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import type {
  Project,
  Task as TaskType,
  TaskStatus,
} from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  type DropResult,
} from "react-beautiful-dnd";
import { toast } from "sonner";
// import TaskView from "./task-view";
import { TaskStatus as TaskStatusNativeEnum } from "@/utils/enums";
import { Skeleton } from "@/components/ui/skeleton";
import TaskBoardColumn from "./task-board-column";
import { TaskLoader } from "./task";

export default function TaskBoard({ projectId }: { projectId: Project["id"] }) {
  const taskStatuses = Object.keys(TaskStatusNativeEnum) as TaskStatus[];
  const { data: tasks, isLoading: isLoadingTasks } =
    api.task.getAllProjectTasks.useQuery(
      {
        projectId: projectId,
      },
      {
        enabled: !!projectId,
      }
    );

  const [currentTasks, setCurrentTasks] = useState<TaskType[] | undefined>(
    tasks
  );

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

  if (isLoadingTasks) {
    return (
      <div className="relative z-10 flex h-full min-h-[75svh] w-full min-w-fit flex-col justify-between gap-3 overflow-x-auto pb-6 lg:flex-row 2xl:flex-nowrap">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 m-auto grid h-max w-full grid-cols-2 -space-x-52 opacity-10 dark:opacity-20"
        >
          <div className="h-56 bg-gradient-to-br from-primary to-purple-400 blur-[106px] dark:from-blue-700"></div>
          <div className="h-56 bg-gradient-to-r from-brand-400 to-brand-300 blur-[106px] dark:to-brand-600"></div>
        </div>
        <TaskBoardLoader />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={(e) => void handleOnDragEnd(e)}>
      {/* {selectedTask && <TaskView task={selectedTask} />} */}
      <div className="relative z-10 flex h-full min-h-[75svh] w-full min-w-fit flex-col justify-between gap-3 overflow-x-auto pb-6 lg:flex-row 2xl:flex-nowrap">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 m-auto grid h-max w-full grid-cols-2 -space-x-52 opacity-10 dark:opacity-20"
        >
          <div className="h-56 bg-gradient-to-br from-primary to-purple-400 blur-[106px] dark:from-blue-700"></div>
          <div className="h-56 bg-gradient-to-r from-brand-400 to-brand-300 blur-[106px] dark:to-brand-600"></div>
        </div>
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
              />
            );
          })}
      </div>
    </DragDropContext>
  );
}

export function TaskBoardLoader() {
  return Object.keys(TaskStatusNativeEnum).map((status) => (
    <div
      key={status}
      className="h-full w-full overflow-hidden rounded-lg border shadow-lg dark:border-gray-800/30 dark:bg-gray-800/10"
    >
      <div className="flex items-center justify-between gap-3 bg-gray-50 px-4 py-3 dark:bg-transparent dark:text-gray-300">
        <div className="flex items-center gap-1">
          <h2 className="font-medium capitalize">
            {status.replace("_", " ").toLocaleLowerCase()}
          </h2>
          <div className="rounded-full px-2.5 py-0.5 text-sm">
            <Skeleton className="h-5 w-4" />
          </div>
        </div>
        <div>
          <Skeleton className="h-7 w-7" />
        </div>
      </div>

      <div
        className={cn(
          "h-full min-h-[75svh] w-full space-y-4 rounded px-2.5 py-4"
        )}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <TaskLoader key={n} />
        ))}
      </div>
    </div>
  ));
}
