import { Layout } from "@/components/layout";
import Badge, {
  getTaskPriorityBadgeColor,
  getTaskStatusBadgeColor,
} from "@/components/ui/badge";
import { prisma } from "@/server/db";
import {
  TaskStatus,
  type Project,
  Priority,
  Task,
} from "@prisma/client";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState, type FC } from "react";
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
import cn from "@/utils/cn";
import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/20/solid";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconButton } from "@/components/ui/icon-button";

export function UpdateTaskForm({
  onSuccess,
  onCancel,
  task,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  task: Task;
}) {
  console.log(task)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TTaskForm>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      ...(task.description ? {description: task.description} : {}),
      status: task.status,
      priority: task.priority      
    }
  });

  const updateTaskMutation = api.task.updateTask.useMutation({
    onSuccess: () => {
      // Handle the new team. For example, you could redirect to the team's page
      onSuccess();
      // reset();
      toast.success("Task updated successfully");
    },
    onError: () => {
      toast.error("Failed to upadte task");
    },
  });

  async function onUpdateTask(data: TTaskForm): Promise<void> {
    console.log(data);
    await updateTaskMutation.mutateAsync({
      ...data,
      id: task.id
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
            <Select {...field} onValueChange={(value) => field.onChange(value)}>
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
            <Select {...field} onValueChange={(value) => field.onChange(value)}>
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

const TaskDialog = ({
  onSuccess,
  task,
}: {
  onSuccess: () => void;
  task: Task;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <IconButton size='sm' variant='outline' className="ml-2 inline-flex gap-1 p-0.5">
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
          <UpdateTaskForm
            task={task}
            onSuccess={() => {
              onSuccess();
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};

const Task: FC<{ task: Task }> = ({ task }) => {
  const { refetch } = api.task.allProjectTasks.useQuery({
    id: task.projectId,
  });
  return (
    <div className="mb-4 rounded-lg border bg-white p-4">
      <div className="flex justify-between">
        <h3 className="mb-2 text-lg font-bold">{task.title}</h3>
        <TaskDialog onSuccess={refetch as () => void}  task={task} />
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
};

const TaskColumn: FC<{ tasks: Task[]; title: string }> = ({ tasks, title }) => {
  return (
    <div className="w-full bg-slate-100 p-4 lg:w-1/3">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

const TaskBoard = ({ taskStatuses, tasks }: {taskStatuses: TaskStatus[], tasks: Task[]}) => {
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
  return (
    <div className="flex flex-wrap 2xl:flex-nowrap justify-between">
      {taskStatuses.map((status) => {
        const tasksForStatus = tasks.filter((task) => task.status === status);
        return (
          <TaskColumn key={status} title={status} tasks={tasksForStatus} />
        );
      })}
    </div>
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
    onSuccess: () => {
      // Handle the new team. For example, you could redirect to the team's page
      onSuccess();
      reset();
      toast.success("New project created!");
    },
    onError: () => {
      toast.error("Failed to create new project");
    },
  });

  async function onCreateProject(data: TTaskForm): Promise<void> {
    console.log(data);
    await createTaskMutation.mutateAsync({
      ...data,
      projectId: project.id,
    });
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onCreateProject)}
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
            <Select {...field} onValueChange={(value) => field.onChange(value)}>
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
            <Select {...field} onValueChange={(value) => field.onChange(value)}>
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
          Create Task
        </Button>
      </div>
    </form>
  );
}

const CreateNewTaskDialog = ({
  onSuccess,
  project,
}: {
  onSuccess: () => void;
  project: Project;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2 inline-flex gap-1 whitespace-nowrap">
          <PlusIcon className="w-5" /> Create Task
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="mt-10 bg-white sm:max-w-sm">
          <DialogHeader className="space-y-0">
            <DialogTitle>
              <h2 className="h5 inline">Create a new Task</h2>
            </DialogTitle>
            <DialogDescription className="body-sm inline text-gray-600">
              <p>Create a new task for the project team.</p>
            </DialogDescription>
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
              onSuccess();
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

const ProjectPage = ({ project }: ProjectPageProps) => {
  const { data: tasks, refetch } = api.task.allProjectTasks.useQuery({
    id: project.id,
  });
  console.log(tasks);

  return (
    <Layout pageTitle={`Project: ${project.name}`}>
      <div className="flex flex-col gap-8">
        <div className="flex w-full items-center justify-between">
          <h1 className="h3">Project: {project.name}</h1>
          <CreateNewTaskDialog
            onSuccess={refetch as () => void}
            project={project}
          />
        </div>
        {tasks && (
          <TaskBoard taskStatuses={Object.keys(TaskStatus) as TaskStatus[]} tasks={tasks} />
        )}
      </div>
    </Layout>
  );
};

export default ProjectPage;

export const getServerSideProps: GetServerSideProps<{
  project: Project;
}> = async ({ params }) => {
  const projectId = params?.projectId as string;
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  console.log("projects: ", project);

  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      project: JSON.parse(JSON.stringify(project)),
    },
  };
};
