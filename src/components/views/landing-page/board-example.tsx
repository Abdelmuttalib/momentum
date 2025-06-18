import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";
import { CheckCircle2, Circle, CircleDashed, Radius } from "lucide-react";
import { resetServerContext } from "react-beautiful-dnd";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { GradientBackground } from "@/components/gradient";

export default function BoardExample() {
  return (
    <>
      <Board />
    </>
  );
}

type Status = "todo" | "in progress" | "done";

interface TTask {
  id: string;
  title: string;
  description: string;
  assigneeName: string;
  assigneeAvatarUrl: string;
  status: Status;
  orderIndex: number;
}

const initialTasks: TTask[] = [
  {
    id: "1",
    title: "Implement user authentication",
    description:
      "Create a user authentication system using Firebase Authentication.",
    assigneeName: "John Doe",
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    status: "todo",
    orderIndex: 0,
  },
  {
    id: "2",
    title: "Design landing page",
    description: "Design a landing page for the website using Figma or Sketch.",
    assigneeName: "Jane Smith",
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    status: "todo",
    orderIndex: 1,
  },
  {
    id: "3",
    title: "Setup Redux store",
    description: "Setup Redux store for managing state in the application.",
    assigneeName: "John Doe",
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    status: "in progress",
    orderIndex: 0,
  },
  {
    id: "4",
    title: "Implement task board UI",
    description: "Implement the task board UI using React and Tailwind CSS.",
    assigneeName: "Jane Smith",
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    status: "in progress",
    orderIndex: 1,
  },
  {
    id: "5",
    title: "Add unit tests",
    description: "Add unit tests for the application using Jest and Enzyme.",
    assigneeName: "John Doe",
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzJ8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    status: "done",
    orderIndex: 0,
  },
  {
    id: "6",
    title: "Deploy application to AWS",
    description: "Deploy the application to AWS using EC2 and S3.",
    assigneeName: "Jane Smith",
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzd8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    status: "done",
    orderIndex: 1,
  },
  {
    id: "7",
    title: "Refactor codebase",
    description:
      "Refactor existing codebase for better performance and maintainability.",
    assigneeName: "John Doe",
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    status: "in progress",
    orderIndex: 2,
  },
  {
    id: "8",
    title: "Write API documentation",
    description:
      "Document all API endpoints and usage for better understanding.",
    assigneeName: "Jane Smith",
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzd8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    status: "todo",
    orderIndex: 2,
  },
  {
    id: "9",
    title: "Fix bugs reported by QA",
    description: "Address and fix bugs reported by QA team.",
    assigneeName: "John Doe",
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    status: "in progress",
    orderIndex: 3,
  },
  {
    id: "10",
    title: "Optimize database queries",
    description: "Optimize database queries for faster response times.",
    assigneeName: "Jane Smith",
    assigneeAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    status: "done",
    orderIndex: 2,
  },
];

function Board() {
  resetServerContext();
  const [tasks, setTasks] = useState<TTask[]>(
    initialTasks.sort((a, b) => a.orderIndex - b.orderIndex)
  );
  // .sort((a, b) => a.orderIndex - b.orderIndex)
  const statuses = ["todo", "in progress", "done"];

  function handleOnDragEnd(result: DropResult) {
    const { source, destination, draggableId: taskId } = result;

    if (!destination) return;

    // If the draggable is dropped outside of a droppable
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    // Find the task being dragged
    const draggedTask = tasks.find((task) => task.id.toString() === taskId);

    if (!draggedTask) return;

    // Remove the dragged task from the tasks array
    const tasksWithoutDragged = tasks.filter(
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
      setTasks([
        ...sourceTasks,
        {
          ...draggedTask,
          status: destinationStatus as Status,
          orderIndex: destination.index || 0,
        },
        ...otherTasks,
      ]);
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

      setTasks([...destinationTasks, ...otherTasks]);

      return;
    }
    // if the task is dropped in a different column/status
    else if (sourceStatus !== destinationStatus) {
      const finalDestinationTasks: TTask[] = [];

      destinationTasks.forEach((task, index) => {
        if (index === destination.index) {
          finalDestinationTasks.push({
            ...draggedTask,
            status: destinationStatus as Status,
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
          status: destinationStatus as Status,
          orderIndex: destination.index,
        });
      }

      setTasks([...sourceTasks, ...finalDestinationTasks, ...otherTasks]);
      return;
    }
  }

  return (
    <>
      <div className="flex h-full w-full justify-center">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="relative flex h-full w-full flex-col gap-1 md:flex-row md:gap-2">
            <GradientBackground />
            {/* Column/Status */}
            {statuses.map((status) => {
              const tasksByStatus = tasks.filter(
                (task) => task.status === status
              );
              return (
                <>
                  <div
                    key={status}
                    className="relative w-full space-y-2 rounded border bg-transparent p-3 pb-10 md:min-w-72 lg:w-full lg:min-w-64"
                  >
                    <div className="inline-flex items-center gap-x-2 ">
                      {status === "backlog" && (
                        <CircleDashed className="text-foreground-light h-[18px] w-[18px]" />
                      )}
                      {status === "todo" && (
                        <Circle className="text-foreground-light h-[18px] w-[18px]" />
                      )}
                      {status === "in progress" && (
                        <Radius className="text-foreground-light h-[18px] w-[18px]" />
                      )}
                      {status === "done" && (
                        <CheckCircle2 className="text-foreground-light h-[18px] w-[18px]" />
                      )}
                      <Typography
                        as="h3"
                        variant="sm/medium"
                        className="capitalize"
                      >
                        {status}
                        <Badge
                          className="ml-4 rounded px-1.5 py-0.5 text-xs"
                          variant={"secondary"}
                        >
                          {tasksByStatus.length}
                        </Badge>
                      </Typography>
                    </div>

                    <Droppable droppableId={status}>
                      {(provided, snapshot) => (
                        <div
                          className={`h-full space-y-4 rounded ${
                            snapshot.isDraggingOver ? "bg-primary/5" : ""
                          }`}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {tasksByStatus.map((task, index) => (
                            <Draggable
                              key={task.id.toString()}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  className="flex flex-col gap-y-2 rounded border border-border bg-popover p-3 py-3"
                                >
                                  <div className="inline-flex items-center justify-between">
                                    <Typography
                                      as="span"
                                      variant="xs/medium"
                                      className="capitalize text-muted-foreground"
                                    >
                                      CYB-246
                                    </Typography>
                                    <Typography
                                      as="span"
                                      variant="xs/medium"
                                      className="capitalize text-muted-foreground"
                                    >
                                      Mar 15
                                    </Typography>
                                  </div>
                                  <Typography
                                    as="h3"
                                    variant="sm/normal"
                                    className="capitalize text-foreground"
                                  >
                                    {task.title}
                                  </Typography>
                                  {/* <Typography
                                  as='p'
                                  variant='sm/medium'
                                  className='capitalize text-muted-foreground'
                                >
                                  {task.description}
                                </Typography> */}
                                  <div className="mt-2 flex items-center justify-between gap-2">
                                    <Badge
                                      color={
                                        task.status === "done"
                                          ? "green"
                                          : task.status === "in progress"
                                          ? "yellow"
                                          : task.status === "todo"
                                          ? "blue"
                                          : "gray"
                                      }
                                      className="border px-2 py-0.5 text-xs capitalize"
                                    >
                                      {task.status}
                                    </Badge>
                                    <div className="flex items-center">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        className="mr-2 h-6 w-6 rounded-full object-cover"
                                        src={task.assigneeAvatarUrl}
                                        alt="Assignee avatar"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </>
  );
}
