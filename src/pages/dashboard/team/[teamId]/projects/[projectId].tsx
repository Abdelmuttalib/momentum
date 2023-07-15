/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Layout } from "@/components/layout";
import { prisma } from "@/server/db";
import { TaskStatus, type Project, type Task, type Team } from "@prisma/client";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState, type FC, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { cn } from "@/utils/cn";
import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/20/solid";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconButton } from "@/components/ui/icon-button";
import { getServerAuthSession } from "@/server/auth";
import ProjectSwitcher from "@/components/project-switcher";
import {
  getTaskPriorityBadgeColor,
  getTaskStatusBadgeColor,
} from "@/utils/getBadgeColor";
import Badge from "@/components/ui/badge";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DraggableProvidedDraggableProps,
  type DraggableProvidedDragHandleProps,
  type DropResult,
} from "react-beautiful-dnd";
import { Priority } from "@/utils/enums";
import { Textarea } from "@/components/ui/textarea";

export function UpdateTaskForm({
  onSuccess,
  onCancel,
  task,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  task: Task;
}) {
  const apiContext = api.useContext();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TTaskForm>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      ...(task.description ? { description: task.description } : {}),
      status: task.status,
      priority: task.priority as Priority,
    },
  });

  const updateTaskMutation = api.task.updateTask.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      onSuccess();
      await apiContext.task.getAllProjectTasks.invalidate();
      // reset();
      toast.success("Task updated successfully");
    },
    onError: () => {
      toast.error("Failed to upadte task");
    },
  });

  async function onUpdateTask(data: TTaskForm): Promise<void> {
    await updateTaskMutation.mutateAsync({
      ...data,
      id: task.id,
    });
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onUpdateTask)}
      className="flex flex-col gap-2"
    >
      <div>
        <Label htmlFor="title">Task title:</Label>
        <Input
          id="title"
          type="text"
          {...register("title")}
          placeholder="task title"
          inputMode="text"
          className={cn({
            "border-red-500": errors.title,
          })}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">Task description:</Label>
        <Input
          id="description"
          type="text"
          {...register("description")}
          placeholder="task description"
          inputMode="text"
          className={cn({
            "border-red-500": errors.title,
          })}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      {/* Status Select */}
      <div>
        <Label htmlFor="status">Project Status: </Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onValueChange={(value) => field.onChange(value as TaskStatus)}
            >
              <SelectTrigger className="w-full text-gray-800">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  {Object.values(TaskStatus).map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      <Badge color={getTaskStatusBadgeColor(status)}>
                        {status.replace("_", " ")}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && (
          <p className="text-red-500">{errors.status.message}</p>
        )}
      </div>

      {/* Priority Select */}
      <div>
        <Label htmlFor="priority">Task priority: </Label>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onValueChange={(value) => field.onChange(value as Priority)}
            >
              <SelectTrigger className="w-full text-gray-800">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  {Object.values(Priority).map((priorityStatus) => (
                    <SelectItem
                      key={priorityStatus}
                      value={priorityStatus}
                      className="capitalize"
                    >
                      <Badge color={getTaskPriorityBadgeColor(priorityStatus)}>
                        {priorityStatus.replace("_", " ")}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.priority && (
          <p className="text-red-500">{errors.priority.message}</p>
        )}
      </div>

      <div className="flex flex-col-reverse md:flex-row md:gap-2">
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="mt-2 flex-1">
          Save Changes
        </Button>
      </div>
    </form>
  );
}

const TaskDialog = ({ task }: { task: Task }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <IconButton
          size="sm"
          variant="outline"
          className="ml-2 inline-flex gap-1 p-0.5"
        >
          <EllipsisHorizontalIcon className="w-5" />
        </IconButton>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="mt-10 bg-white sm:max-w-sm">
          <DialogHeader className="space-y-0">
            <DialogTitle>
              <h2 className="h5 inline">Update Task</h2>
            </DialogTitle>
            <DialogDescription className="body-sm inline text-gray-600">
              <p>Update Task information.</p>
            </DialogDescription>
          </DialogHeader>

          <UpdateTaskForm
            task={task}
            onSuccess={() => {
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};

interface TaskProps {
  task: Task;
  index: number;
  id: string;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

function Task({
  task,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: TaskProps) {
  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      id={id}
      className="mb-4 rounded-lg border bg-white p-4"
    >
      <div className="flex justify-between">
        <h3 className="mb-2 text-lg font-bold">{task.title}</h3>
        <TaskDialog task={task} />
      </div>
      <p className="text-gray-700">{task.description}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Badge
          color={getTaskStatusBadgeColor(task.status)}
          className="capitalize"
        >
          {task.status.replace("_", " ").toLocaleLowerCase()}
        </Badge>
      </div>
    </div>
  );
}

const TaskColumn: FC<{ tasks: Task[]; title: string }> = ({ tasks, title }) => {
  return (
    <>
      <div className="bg-primary-50 flex items-center gap-3 px-4 py-3">
        <h2 className="text-lg font-bold capitalize">
          {title.replace("_", " ").toLocaleLowerCase()}
        </h2>
        <span className="rounded-full bg-white px-2.5 py-0.5 font-semibold">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-4 p-4">
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
              <Task
                id={task.id}
                index={index}
                innerRef={provided.innerRef}
                draggableProps={provided.draggableProps}
                dragHandleProps={provided.dragHandleProps}
                task={task}
              />
            )}
          </Draggable>
        ))}
      </div>
    </>
  );
};

const TaskBoard = ({
  taskStatuses,
  projectId,
}: {
  taskStatuses: TaskStatus[];
  projectId: Project["id"];
}) => {
  // <div key={status} className="w-1/4 p-2">
  //   <h2 className="mb-2 font-bold">{status}</h2>
  //   <div className="space-y-2">
  //     {tasks
  //       .filter((task) => task.status === status)
  //       .map((task) => (
  //         <div key={task.id} className="border p-2">
  //           <h3>{task.title}</h3>
  //           {/* Rest of your task display components here */}
  //         </div>
  //       ))}
  //   </div>
  // </div>

  const { data: tasks } = api.task.getAllProjectTasks.useQuery(
    {
      projectId: projectId,
    },
    {
      enabled: !!projectId,
    }
  );

  const [currentTasks, setCurrentTasks] = useState<Task[] | undefined>(tasks);

  const apiContext = api.useContext();

  const updateTaskStatusMutation = api.task.updateTaskStatus.useMutation({
    onSuccess: async () => {
      await apiContext.task.getAllProjectTasks.invalidate();
      toast.success("Task status updated successfully.");
    },

    onError: () => {
      toast.error("Something went wrong. Please try again later.");
    },
  });

  useEffect(() => {
    setCurrentTasks(tasks);
  }, [tasks]);

  async function handleOnDragEnd(result: DropResult) {
    const { destination, source, draggableId: taskId } = result;

    if (!destination) return;

    // droppableId
    // draggableId
    if (tasks) {
      const newTasks = tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: destination?.droppableId }
          : task
      );

      setCurrentTasks(newTasks as Task[]);
    }
    // setCurrentTasks((prev) => {
    //   if (!prev) return prev;

    //   const newTasks = [...prev];
    //   const e = newTasks.find((task, index) =>
    //     task.id === taskId ? newTasks.splice(index, 1) : null
    //   );
    //   if (!e) return prev;

    //   const [removed] = newTasks.splice(source.index, 1);
    //   newTasks.splice(destination.index, 0, removed);

    //   return newTasks;
    // });

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    await updateTaskStatusMutation.mutateAsync({
      taskId,
      status: destination.droppableId as TaskStatus,
    });
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="grid h-full min-h-[75svh] grid-cols-1 justify-between gap-4 overflow-x-auto pb-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-7 2xl:flex-nowrap">
        {currentTasks &&
          taskStatuses.map((status) => {
            const tasksForStatus = currentTasks.filter(
              (task) => task.status === status
            );
            return (
              <Droppable
                droppableId={status}
                direction="horizontal"
                type="task"
                key={status}
              >
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "h-full min-h-[75svh] w-full space-y-3 rounded border",
                      {
                        "bg-white": snapshot.isDraggingOver,
                      }
                    )}
                  >
                    <TaskColumn title={status} tasks={tasksForStatus} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
      </div>
    </DragDropContext>
    // <DragDropContext onDragEnd={handleOnDragEnd}>

    //       <div

    //         className="flex flex-wrap justify-between 2xl:flex-nowrap"
    //       >
    //         {taskStatuses.map((status) => {
    //           const tasksForStatus = tasks.filter(
    //             (task) => task.status === status
    //           );
    //           return (
    //             <Droppable droppableId="board" direction="horizontal" type="task">
    //                {(provided) => (
    //             <TaskColumn
    //             {...provided.droppableProps}
    //             ref={provided.innerRef}
    //               key={status}
    //               title={status}
    //               tasks={tasksForStatus}
    //             />
    //             </Droppable>)}
    //             )
    //             }
    //             )
    //             }

    //       </div>
    // </DragDropContext>
  );
};

const taskFormSchema = z.object({
  title: z.string().min(1, "Please enter a team name").nonempty(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(Priority),
  dueDate: z.date().optional(),
});

type TTaskForm = z.infer<typeof taskFormSchema>;

export function CreateTaskForm({
  onSuccess,
  onCancel,
  project,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  project: Project;
}) {
  const trpc = api.useContext();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TTaskForm>({
    resolver: zodResolver(taskFormSchema),
  });

  const createTaskMutation = api.task.createTask.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      onSuccess();
      await trpc.task.getAllProjectTasks.invalidate();
      reset();
      toast.success("New project created!");
    },
    onError: () => {
      toast.error("Failed to create new project");
    },
  });

  async function onCreateProject(data: TTaskForm): Promise<void> {
    await createTaskMutation.mutateAsync({
      ...data,
      projectId: project.id,
    });
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onCreateProject)}
      className="flex flex-col gap-5"
    >
      <div>
        <Label htmlFor="title" className="sr-only">
          Task title:
        </Label>
        <Input
          id="title"
          type="text"
          {...register("title")}
          placeholder="task title"
          variant="outline"
          inputMode="text"
          className={cn("h-16 border-b bg-white text-2xl text-gray-800", {
            "border-red-500": errors.title,
          })}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">Task description:</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="task description"
          inputMode="text"
          className={cn("h-10 bg-white text-lg text-gray-500", {
            "border-red-500": errors.title,
          })}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      {/* Status Select */}
      <div className="grid w-full grid-cols-2 gap-x-3">
        <div>
          <Label htmlFor="status">Project Status: </Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value as TaskStatus)}
              >
                <SelectTrigger className="w-full text-gray-800">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    {Object.values(TaskStatus).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        <Badge color={getTaskStatusBadgeColor(status)}>
                          {status.replace("_", " ")}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-red-500">{errors.status.message}</p>
          )}
        </div>

        {/* Priority Select */}
        <div>
          <Label htmlFor="priority">Task priority: </Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value as Priority)}
              >
                <SelectTrigger className="w-full text-gray-800">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    {Object.values(Priority).map((priorityStatus) => (
                      <SelectItem
                        key={priorityStatus}
                        value={priorityStatus}
                        className="capitalize"
                      >
                        <Badge
                          color={getTaskPriorityBadgeColor(priorityStatus)}
                        >
                          {priorityStatus.replace("_", " ")}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.priority && (
            <p className="text-red-500">{errors.priority?.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:gap-2 lg:justify-end">
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={onCancel}
          disabled={createTaskMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          type="submit"
          className="mt-2 flex-1 lg:flex-initial"
          disabled={createTaskMutation.isLoading}
          isLoading={createTaskMutation.isLoading}
        >
          Create Task
        </Button>
      </div>
    </form>
  );
}

const CreateNewTaskDialog = ({ project }: { project: Project }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2 inline-flex gap-1 whitespace-nowrap">
          <PlusIcon className="w-5" /> Create Task
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="mt-10 bg-white sm:max-w-4xl">
          <DialogHeader className="space-y-0">
            <DialogTitle>
              <h2 className="h5 inline">Create a new Task</h2>
            </DialogTitle>
          </DialogHeader>
          {/* <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='name' className='text-right'>
              Name
            </label>
            <Input id='name' value='Pedro Duarte' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='username' className='text-right'>
              Username
            </label>
            <Input id='username' value='@peduarte' className='col-span-3' />
          </div>
        </div> */}
          <CreateTaskForm
            project={project}
            onSuccess={() => {
              // onSuccess();
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};

type ProjectPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ProjectPage = ({ project, teamId }: ProjectPageProps) => {
  return (
    <Layout
      pageTitle={
        <div className="flex items-center gap-3">
          Project <ProjectSwitcher currentProject={project} teamId={teamId} />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-end">
          <CreateNewTaskDialog project={project} />
        </div>
        {project?.id && (
          <TaskBoard
            taskStatuses={Object.keys(TaskStatus) as TaskStatus[]}
            projectId={project.id}
          />
        )}
      </div>
    </Layout>
  );
};

export default ProjectPage;

export const getServerSideProps: GetServerSideProps<{
  project: Project;
  teamId: Team["id"];
}> = async ({ req, res, params }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const teamId = params?.teamId as string;
  const projectId = params?.projectId as string;
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      userSession: JSON.parse(JSON.stringify(userSession)),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      project: JSON.parse(JSON.stringify(project)),
      teamId,
    },
  };
};
