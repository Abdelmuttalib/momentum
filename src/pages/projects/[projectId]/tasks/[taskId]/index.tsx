// app/projects/[projectId]/tasks/[taskId]/page.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/router";
import { useTask } from "@/features/projects/hooks/use-tasks";
import { AppLayout } from "@/components/layout/app-layout";
import { DataLoader } from "@/components/data-loader";
import { ButtonLink } from "@/components/common/button-link";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { TaskPriorityBadge } from "@/features/tasks/components/task-priority-badge";
import { formatDistanceToNow } from "@/lib/date";
import { Stack } from "@/components/page-components";

export default function ProjectTaskPage() {
  const { query } = useRouter();
  const taskId = query.taskId as string;
  const { data: task, isLoading, error } = useTask(taskId);

  return (
    <>
      <AppLayout>
        <DataLoader data={task} isLoading={isLoading} error={error}>
          {(data) => (
            <Stack spacing="group">
              {/* Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {data.title}
                  </h1>

                  <div className="flex items-center gap-3">
                    <div>
                      Status <TaskStatusBadge status={data.status} />
                    </div>

                    <div>
                      Priority{" "}
                      <TaskPriorityBadge priority={data.priority} size="sm" />
                    </div>
                  </div>

                  <p className="text-muted-foreground">
                    Task details, metadata, notes, and progress.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <ButtonLink
                    href={`/projects/${data.projectId}/tasks/${data.id}/edit`}
                    variant="outline"
                  >
                    Edit
                  </ButtonLink>

                  {/* <Button>Save Changes</Button> */}
                </div>
              </div>

              {/* Main Layout */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>

                      {/* <CardDescription>
                        Detailed information about this data.
                      </CardDescription> */}
                    </CardHeader>

                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p>{data.description || "No description provided."}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Internal Notes</CardTitle>

                      <CardDescription>
                        Add updates, reminders, or progress notes.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Write notes here..."
                        className="min-h-[180px]"
                        disabled
                      />

                      <div className="flex justify-end">
                        <Button size="sm" disabled>
                          Save Note
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity */}
                  {/* <Card>
                    <CardHeader>
                      <CardTitle>Activity</CardTitle>

                      <CardDescription>
                        Recent task activity and updates.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary" />

                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            Task status updated to IN PROGRESS
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Apr 13, 2026 • 5:46 AM
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-muted-foreground" />

                        <div className="space-y-1">
                          <p className="text-sm font-medium">Task created</p>

                          <p className="text-xs text-muted-foreground">
                            Apr 13, 2026 • 5:39 AM
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Metadata */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Task Info</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      <div>
                        <p className="text-sm text-muted-foreground">Task ID</p>

                        <p className="mt-1 break-all text-sm font-medium">
                          {data.id}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Assignee ID
                        </p>

                        <p className="mt-1 break-all text-sm font-medium">
                          {data.assigneeId}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Created At
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {formatDistanceToNow(data.createdAt)}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Updated At
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {formatDistanceToNow(data.updatedAt)}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Due Date
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {data.dueDate
                            ? new Date(data.dueDate).toLocaleDateString()
                            : "No due date"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>

                      <CardDescription>
                        Quick task management actions.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-3">
                      <Button className="w-full">Mark as Done</Button>

                      <Button variant="secondary" className="w-full">
                        Move to Backlog
                      </Button>

                      <Button variant="outline" className="w-full">
                        Assign User
                      </Button>

                      <Button variant="destructive" className="w-full">
                        Delete Task
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Stack>
          )}
        </DataLoader>
      </AppLayout>
    </>
  );
}
