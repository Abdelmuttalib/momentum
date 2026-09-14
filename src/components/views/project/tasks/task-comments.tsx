import { useState } from "react";
import { useSession } from "next-auth/react";
import { DataLoader } from "@/components/data-loader";
import { Heading, Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";
import { UserAvatar } from "@/components/user/user-menu";
import { useTaskComments } from "@/features/tasks/hooks/use-task-comment";
import {
  useAddTaskComment,
  useDeleteTaskComment,
} from "@/features/tasks/hooks/use-task-mutations";
import { formatDate, formatDistanceToNow } from "@/lib/date";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function TaskComments({ taskId }: { taskId: string }) {
  const t = useTranslations("tasks");
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: comments, isLoading, error } = useTaskComments(taskId);
  const { execute: addComment, isPending: isAdding } = useAddTaskComment();
  const { execute: deleteComment, isPending: isDeleting } =
    useDeleteTaskComment();

  const [draft, setDraft] = useState("");

  async function handleAdd() {
    if (!draft.trim() || !userId) return;
    await addComment({
      taskId,
      comment: draft.trim(),
      authorId: userId,
    });
    setDraft("");
  }

  return (
    <section aria-label={t("comments")} className="flex flex-col gap-3">
      <Heading level="subsection">{t("comments")}</Heading>

      <DataLoader
        data={comments}
        isLoading={isLoading}
        error={error}
        emptyMessage={t("noComments")}
      >
        {(data) => (
          <ul className="flex flex-col gap-4">
            {data.map(({ id, comment, author, createdAt, authorId }) => (
              <li key={id} className="relative flex w-full gap-3">
                <UserAvatar user={author} size="sm" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <Text size="sm" weight="medium" className="inline">
                      {author.name}
                      <Text as="span" size="xs" tone="muted" className="ms-1.5">
                        {formatDistanceToNow(createdAt)} (
                        {formatDate(createdAt)})
                      </Text>
                    </Text>
                  </div>
                  <Text size="sm" className="break-words">
                    {comment}
                  </Text>
                </div>
                {authorId === userId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("deleteComment")}
                    className="h-7 w-7 shrink-0 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => void deleteComment({ id })}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </DataLoader>

      <div className="flex flex-col gap-2">
        <label htmlFor={`comment-${taskId}`} className="sr-only">
          {t("addComment")}
        </label>
        <Textarea
          id={`comment-${taskId}`}
          placeholder={t("commentPlaceholder")}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={isAdding || !userId}
          className="min-h-[5rem]"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="self-end"
          onClick={() => void handleAdd()}
          disabled={isAdding || !draft.trim() || !userId}
        >
          <ButtonLoaderIcon isPending={isAdding} />
          {t("comment")}
        </Button>
      </div>
    </section>
  );
}
