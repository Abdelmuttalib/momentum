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
import { ArrowRight, MessageSquareIcon, Trash2 } from "lucide-react";
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
import { Text } from "@/components/typography";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";
import { type GetProjectTasks } from "@/features/projects/types";
import { useTaskComments } from "@/features/tasks/hooks/use-task-comment";
import { DataLoader } from "@/components/data-loader";
import { CBadge } from "@/components/common/cbadge";
import { type BoardDensity } from "@/features/tasks/hooks/use-board-density";
import { Textarea } from "@/components/ui/textarea";
import { ButtonLink } from "@/components/common/button-link";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface TaskProps {
  task: GetProjectTasks[number];
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  density?: BoardDensity;
}

export default function TaskView({
  task,
  innerRef,
  draggableProps,
  dragHandleProps,
  density = "compact",
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

  const {
    data: taskComments,
    isLoading: isLoadingTaskComments,
    error: taskCommentsError,
  } = useTaskComments(task.id);

  async function onDeleteComment(commentId: string, authorId: string) {
    await deleteCommentMuation.mutateAsync({
      id: commentId,
      authorId,
    });
  }

  return (
    <Dialog
    // open={isOpen} onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <div
          {...draggableProps}
          {...dragHandleProps}
          ref={innerRef}
          role="button"
          tabIndex={0}
          aria-label={`Open task: ${task.title}`}
          // Enter opens the quick-view dialog; Space is reserved for the
          // drag-and-drop keyboard lift so both interactions stay available.
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.click();
            }
          }}
          className={cn(
            "cursor-pointer rounded-md border bg-card hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            density === "compact" ? "p-2.5" : "p-3"
          )}
          // onClick={() => setSelectedTask(task)}
        >
          <Text size="sm" weight="medium" as="h3" className="line-clamp-2">
            {task.title}
          </Text>
          {/* <TaskDialog task={task} /> */}
          {task.description && (
            <Text size="xs" tone="muted" className="mt-1 line-clamp-2">
              {task.description}
            </Text>
          )}
          <div className="mt-2.5 flex items-center justify-between gap-2">
            {/* TODO: fix typing for labels on task */}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <div className="flex min-w-0 flex-wrap items-center gap-1">
              {task?.labels?.map((label: Label) => (
                <LabelBadge
                  key={label.id}
                  name={label.name}
                  color={label.color}
                />
              ))}
            </div>

            <TaskStatusBadge status={task.status} size="sm" />
          </div>
          <div className="mt-2 flex items-center justify-between px-0.5">
            {task.assigneeId ? (
              <UserAvatar user={task?.assignee} size="sm" />
            ) : (
              <span />
            )}

            <div className="inline-flex items-center gap-x-1 text-muted-foreground">
              <MessageSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <Text size="xs" tone="muted" as="span">
                {taskComments?.length ?? 0}
              </Text>
            </div>
          </div>
        </div>
      </DialogTrigger>
      {/* {isOpen && ( */}
      <DialogContent className="w-full max-w-2xl overflow-x-hidden">
        <DialogHeader className="space-y-0">
          <DialogTitle className="flex items-center gap-x-2">
            {task.title}
            {/* <IconButton variant="destructive-outline">
              <Trash className="w-5" />
            </IconButton> */}

            <Link
              href={`/projects/${task.projectId}/tasks/${task.id}`}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowRight className="h-4 w-4 -rotate-45" />
            </Link>
          </DialogTitle>
          {/* <DialogDescription className="body-sm inline text-muted-foreground">
            <p>Update Task information.</p>
          </DialogDescription> */}
        </DialogHeader>

        {/* content */}
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-4 divide-y">
            <div className="flex flex-col gap-y-3 py-3 text-sm">
              <div className="flex gap-x-6">
                <Text size="sm" weight="medium" tone="muted" className="w-20 shrink-0">Status</Text>

                <TaskStatusBadge status={task.status} size="sm" />
              </div>
              <div className="flex gap-x-6">
                <Text size="sm" weight="medium" tone="muted" className="w-20 shrink-0">Label</Text>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <div className="flex flex-wrap gap-1">
                  {task?.labels?.map((label: Label) => (
                    <LabelBadge
                      key={label.id}
                      name={label.name}
                      color={label.color}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-x-6">
                <Text size="sm" weight="medium" tone="muted" className="w-20 shrink-0">Assignee</Text>
                <div className="inline-flex items-center gap-x-2">
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <UserAvatar user={task?.assignee} size="sm" />
                  <Text size="sm">
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    {task?.assignee?.name ?? "Unassigned"}
                  </Text>
                </div>
              </div>
            </div>
            {/*  */}
            <div className="flex flex-col gap-y-2 pt-4">
              <Text size="sm" weight="semibold" as="h3">Description</Text>
              <Text size="sm" tone="muted">{task.description || "No description provided."}</Text>
            </div>
            {/* Comments */}
            <div className="flex flex-col gap-y-2 pt-4">
              <div className="inline-flex items-center gap-x-2">
                <Text size="sm" weight="semibold" as="h3">Comments</Text>

                {/* <CBadge size="sm">{taskComments?.length} </CBadge> */}
              </div>
              <DataLoader
                data={taskComments}
                isLoading={isLoadingTaskComments}
                error={taskCommentsError}
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
                            <div className="flex min-w-0 flex-col">
                              <Text size="sm" className="inline">
                                {author.name}
                                <Text
                                  as="span"
                                  size="xs"
                                  tone="muted"
                                  className="ml-1"
                                >
                                  {formatDistanceToNow(createdAt)}
                                </Text>
                              </Text>
                              <Text size="xs" tone="muted" as="span">
                                {formatDate(createdAt)}
                              </Text>
                              <Text size="sm" className="mt-2 break-words">
                                {comment}
                              </Text>
                            </div>
                            {authorId === user?.id && (
                              <Button
                                variant="link"
                                size="icon-sm"
                                aria-label="Delete comment"
                                className="absolute right-2 top-2 text-destructive/70 outline-none hover:bg-destructive/20 hover:text-destructive focus:outline-none disabled:pointer-events-none"
                                onClick={() => onDeleteComment(id, authorId)}
                                disabled={deleteCommentMuation.isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
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
