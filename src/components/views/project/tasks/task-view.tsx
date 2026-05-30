/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquareIcon, Trash2 } from "lucide-react";
import LabelBadge from "@/components/ui/label-badge";
import type { Label } from "@prisma/client";
import {
  type DraggableProvidedDragHandleProps,
  type DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";
import { UserAvatar } from "@/components/user/user-menu";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { formatDate, formatDistanceToNow } from "@/lib/date";
import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/typography";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";
import { type GetProjectTasks } from "@/features/projects/types";
import { useTaskComments } from "@/features/tasks/hooks/use-task-comment";
import { DataLoader } from "@/components/data-loader";
import { CBadge } from "@/components/common/cbadge";
import { Textarea } from "@/components/ui/textarea";

interface TaskProps {
  task: GetProjectTasks[number];
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

export default function TaskView({
  task,
  innerRef,
  draggableProps,
  dragHandleProps,
}: TaskProps) {
  // const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const apiContext = api.useContext();

  // const { data: taskComments, isLoading: isLoadingTaskComments } =
  //   api.task.getTaskComments.useQuery({
  //     taskId: task.id,
  //   });

  const addCommentMutation = api.task.addComment.useMutation({
    onSuccess: async () => {
      // queryClient.invalidateQueries(["task", task.id]);
      toast.success("Comment added successfully");
      await apiContext.task.getTaskComments.invalidate();
      await apiContext.task.getAllProjectTasks.invalidate();
      reset();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const addCommentFormSchema = z.object({
    comment: z.string(),
  });

  type AddCommentFormSchemaType = z.infer<typeof addCommentFormSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCommentFormSchemaType>();

  async function onAddComment(data: AddCommentFormSchemaType) {
    await addCommentMutation.mutateAsync({
      taskId: task.id,
      comment: data.comment,
      authorId: user?.id,
    });
  }

  const deleteCommentMuation = api.task.deleteComment.useMutation({
    onSuccess: async () => {
      toast.success("Comment deleted successfully");
      await apiContext.task.getTaskComments.invalidate();
      await apiContext.task.getAllProjectTasks.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const { data: taskComments, isLoading: isLoadingTaskComments } =
    useTaskComments(task.id);

  async function onDeleteComment(commentId: string, authorId: string) {
    await deleteCommentMuation.mutateAsync({
      id: commentId,
      authorId,
    });
  }

  console.log("TASK->TASK", task);

  return (
    <Dialog
    // open={isOpen} onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <div
          {...draggableProps}
          {...dragHandleProps}
          ref={innerRef}
          className="rounded-lg border bg-card p-4 hover:bg-popover"
          // onClick={() => setSelectedTask(task)}
        >
          <div className="flex justify-between">
            <Typography as="h3" variant="md/medium" className="mb-2">
              {task.title}
            </Typography>
            {/* <TaskDialog task={task} /> */}
          </div>
          <Typography
            as="p"
            variant="sm/normal"
            className="text-muted-foreground"
          >
            {task.description}
          </Typography>
          <div className="mt-4 flex items-center justify-between gap-2">
            {/* TODO: fix typing for labels on task */}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {task?.labels?.map((label: LabelType) => (
              <LabelBadge
                key={label.id}
                name={label.name}
                color={label.color}
             />
            ))}

            <TaskStatusBadge status={task.status} size="sm" />
          </div>
          <div className="mt-2 flex justify-between px-0.5">
            {task.assigneeId && <UserAvatar user={task?.assignee} size="sm" />}

            <div className="inline-flex items-center gap-x-1 text-muted-foreground">
              <MessageSquareIcon className="w-4" />
              <Typography
                as="span"
                variant="xs/normal"
                className="text-muted-foreground"
              >
                {taskComments?.length}
              </Typography>
            </div>
          </div>
        </div>
      </DialogTrigger>
      {/* {isOpen && ( */}
      <DialogContent className="w-full max-w-2xl overflow-x-hidden">
        <DialogHeader className="space-y-0">
          <DialogTitle className="flex items-center gap-x-6">
            {task.title}
            {/* <IconButton variant="destructive-outline">
              <Trash className="w-5" />
            </IconButton> */}
          </DialogTitle>
          {/* <DialogDescription className="body-sm inline text-muted-foreground">
            <p>Update Task information.</p>
          </DialogDescription> */}
        </DialogHeader>

        {/* content */}
        <div className="truncate">
          <div className="flex flex-col gap-4 divide-y">
            <div className="flex flex-col gap-y-4 py-3 text-sm">
              <div className="flex gap-x-6">
                <p className="font-medium text-muted-foreground">Status</p>

                <TaskStatusBadge status={task.status} size="sm" />
              </div>
              <div className="flex gap-x-6">
                <p className="font-medium text-muted-foreground">Label</p>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                {task?.labels?.map((label: Label) => (
                  <LabelBadge
                    key={label.id}
                    name={label.name}
                    color={label.color}
                  />
                ))}
              </div>
              <div className="flex gap-x-6">
                <p className="font-medium text-muted-foreground">Assignee</p>
                <div className="inline-flex items-center gap-x-2">
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <UserAvatar user={task?.assignee} size="sm" />
                  <p>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    {task?.assignee?.name}
                  </p>
                </div>
              </div>
            </div>
            {/*  */}
            <div className="flex flex-col gap-y-2 pt-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
            {/* Comments */}
            <div className="flex flex-col gap-y-2 pt-4">
              <div className="inline-flex items-center gap-x-2">
                <h3 className="font-semibold">Comments</h3>

                {/* <CBadge size="sm">{taskComments?.length} </CBadge> */}
              </div>
              <DataLoader
                data={taskComments}
                isLoading={isLoadingTaskComments}
                error={null}
              >
                {(data) => (
                  <>
                    <div className="flex flex-col gap-y-2">
                      {data?.map(
                        (
                          { id, comment, author, createdAt, authorId },
                          index
                        ) => (
                          <div
                            key={id}
                            className={cn("relative flex w-full gap-3")}
                          >
                            <UserAvatar user={author} size="lg" />
                            <div className="flex flex-col truncate">
                              <Typography
                                variant="sm/normal"
                                className="inline"
                              >
                                {author.name}
                                <Typography
                                  as="span"
                                  variant="xs/normal"
                                  className="ml-1 text-muted-foreground"
                                >
                                  {formatDistanceToNow(createdAt)}
                                </Typography>
                              </Typography>
                              <Typography
                                as="span"
                                variant="xs/normal"
                                className="text-muted-foreground"
                              >
                                {formatDate(createdAt)}
                              </Typography>
                              <Typography
                                variant="base/medium"
                                className="mt-2 inline max-w-[90%] truncate"
                              >
                                {comment}
                              </Typography>
                            </div>
                            {authorId === user?.id && (
                              <Button
                                variant="link"
                                size="icon-sm"
                                className="absolute right-2 top-2 text-destructive/70 outline-none hover:bg-destructive/20 hover:text-destructive focus:outline-none disabled:pointer-events-none"
                                onClick={() => onDeleteComment(id, authorId)}
                                disabled={deleteCommentMuation.isLoading}
                              >
                                <Trash2 className="w-5" />
                              </Button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </>
                )}
              </DataLoader>

              <form onSubmit={handleSubmit(onAddComment)} className="mt-6">
                <div className="flex flex-col gap-y-2">
                  <div>
                    <label htmlFor="comment" className="sr-only">
                      Add Comment
                    </label>
                    <Textarea
                      id="comment"
                      className="max-h-64"
                      placeholder="Write a comment..."
                      {...register("comment", {
                        required: true,
                      })}
                      disabled={
                        isLoadingTaskComments ||
                        addCommentMutation.isLoading ||
                        deleteCommentMuation.isLoading
                      }
                      data-invalid={errors?.comment}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto sm:self-end"
                    disabled={
                      isLoadingTaskComments ||
                      addCommentMutation.isLoading ||
                      deleteCommentMuation.isLoading
                    }
                  >
                    <ButtonLoaderIcon
                      isPending={addCommentMutation.isPending}
                    />
                    Save Comment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
      {/* // )} */}
    </Dialog>
  );
}
