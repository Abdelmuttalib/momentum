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
import {
  ChatBubbleLeftRightIcon,
  // EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LabelBadge from "@/components/ui/label-badge";
import { getTaskStatusBadgeColor } from "@/utils/getBadgeColor";
import type { Label, Task } from "@prisma/client";
import {
  type DraggableProvidedDragHandleProps,
  type DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";
import { UserAvatar } from "@/components/user/user-menu";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { formatFullDate } from "@/utils/date";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/ui/typography";

interface TaskProps {
  task: Task;
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

  const { data: taskComments, isLoading: isLoadingTaskComments } =
    api.task.getTaskComments.useQuery({
      taskId: task.id,
    });

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
          className="mb-4 rounded-lg border bg-popover p-4 hover:bg-popover"
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
            className="text-foreground-light"
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
              ></LabelBadge>
            ))}
            <Badge
              color={getTaskStatusBadgeColor(task.status)}
              className="capitalize"
            >
              {task.status.replace("_", " ").toLocaleLowerCase()}
            </Badge>
          </div>
          <div className="mt-2 flex justify-between px-0.5">
            <div className="inline-flex items-center gap-x-1 text-muted-foreground">
              <ChatBubbleLeftRightIcon className="w-[18px]" />
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <span className="text-xs">{task?.comments?.length}</span>
            </div>

            {/* TODO: fix typing for assignee on task */}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {task.assigneeId && <UserAvatar user={task?.assignee} size="sm" />}
          </div>
        </div>
      </DialogTrigger>
      {/* {isOpen && ( */}
      <DialogContent className="w-full max-w-2xl">
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
        <div>
          <div className="flex flex-col gap-4 divide-y">
            <div className="flex flex-col gap-y-4 py-3 text-sm">
              <div className="flex gap-x-6">
                <p className="font-medium text-muted-foreground">Status</p>
                <Badge
                  color={getTaskStatusBadgeColor(task.status)}
                  className="capitalize"
                >
                  {task.status.replace("_", " ").toLocaleLowerCase()}
                </Badge>
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
                  ></LabelBadge>
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
                <span className="block rounded-full bg-accent px-1.5 py-0.5 text-sm font-medium">
                  {taskComments?.length}{" "}
                </span>
              </div>
              <div className="flex flex-col gap-y-2 divide-y">
                {taskComments?.map(
                  ({ id, comment, author, createdAt, authorId }, index) => (
                    <div
                      key={id}
                      className={cn("relative flex gap-3", {
                        "pt-3": index !== 0,
                      })}
                    >
                      <UserAvatar
                        user={author}
                        size="lg"
                        triggerClassName="w-12 h-12"
                      />
                      <div className="flex flex-col">
                        <p className="inline text-sm font-medium">
                          {author.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatFullDate(createdAt)}
                        </span>
                        <p className="inline pt-2 font-semibold">{comment}</p>
                      </div>
                      {authorId === user?.id && (
                        <button
                          className="absolute right-2 top-2 outline-none focus:outline-none disabled:pointer-events-none"
                          onClick={() => onDeleteComment(id, authorId)}
                          disabled={deleteCommentMuation.isLoading}
                        >
                          <Trash2 className="text-destructive-500 dark:text-destructive-400 w-5" />
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
              {/* <p className="text-muted-foreground">{task.description}</p> */}
              <form onSubmit={handleSubmit(onAddComment)} className="mt-6">
                <div className="flex flex-col gap-y-2">
                  <div>
                    <label htmlFor="comment" className="sr-only">
                      Add Comment
                    </label>
                    <Input
                      id="comment"
                      type="text"
                      className="h-14"
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
                    className="w-full sm:w-auto sm:self-end"
                    disabled={
                      isLoadingTaskComments ||
                      addCommentMutation.isLoading ||
                      deleteCommentMuation.isLoading
                    }
                    isLoading={addCommentMutation.isLoading}
                  >
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
