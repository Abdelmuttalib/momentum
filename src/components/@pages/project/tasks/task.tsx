import Badge from "@/components/ui/badge";
import LabelBadge from "@/components/ui/label-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTaskStatusBadgeColor } from "@/utils/getBadgeColor";
import TaskDialog from "./task-dialog";
import type { Task } from "@prisma/client";
import {
  type DraggableProvidedDragHandleProps,
  type DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";
import { UserAvatar } from "@/components/user/UserMenu";

interface TaskProps {
  task: Task;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

export default function Task({
  task,
  innerRef,
  draggableProps,
  dragHandleProps,
}: TaskProps) {
  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className="mb-4 rounded-lg border bg-white p-4 shadow-lg hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50"
      // onClick={() => setSelectedTask(task)}
    >
      <div className="flex justify-between">
        <h3 className="mb-2 font-semibold dark:text-gray-200">{task.title}</h3>
        {/* <TaskDialog task={task} /> */}
      </div>
      <p className="text-gray-600 dark:text-gray-500">{task.description}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        {/* TODO: fix typing for labels on task */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        {task?.labels?.map((label: LabelType) => (
          <LabelBadge
            key={label.id}
            name={label.name}
            color={label.color}
          ></LabelBadge>
        ))}
        <Badge
          color={getTaskStatusBadgeColor(task.status)}
          className="capitalize"
        >
          {task.status.replace("_", " ").toLocaleLowerCase()}
        </Badge>
      </div>
      {task.assigneeId && (
        <div className="mt-2">
          {/* TODO: fix typing for assignee on task */}
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <UserAvatar user={task?.assignee} size="sm" />
        </div>
      )}
    </div>
  );
}

export function TaskLoader() {
  return (
    <div className="relative mb-4 rounded-lg border bg-white p-4 shadow-lg hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="flex justify-between">
        <h3 className="mb-2 font-semibold dark:text-gray-200">
          <Skeleton className="h-6 w-36" />
        </h3>
        {/* <TaskDialog task={task} /> */}
      </div>
      <div className="text-gray-600 dark:text-gray-500">
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Skeleton className="h-6 w-14" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-2 flex -space-x-2">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-8 w-8 rounded-full" />
        ))}
      </div>
    </div>
  );
}
