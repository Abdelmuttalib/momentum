/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UpdateTaskForm from "./forms/Update-task";
import type { Task } from "@prisma/client";
import { IconButton } from "@/components/ui/icon-button";

export default function TaskDialog({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState(false);

  const apiContext = api.useContext();

  const deleteTaskMutation = api.task.delete.useMutation({
    onSuccess: async () => {
      await apiContext.task.getAllProjectTasks.invalidate();
      setIsOpen(false);
      toast.success("Task deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  async function onDeleteTask(): Promise<void> {
    await deleteTaskMutation.mutateAsync({
      id: task.id,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <IconButton
          type="button"
          variant="outline"
          className="h-fit w-fit rounded border-none bg-transparent p-0 dark:bg-transparent"
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </IconButton>
      </DialogTrigger>
      {isOpen && (
        <DialogContent>
          <DialogHeader className="space-y-0">
            <DialogTitle className="flex items-center gap-x-6">
              <h2 className="h5 inline">Update Task</h2>
              <IconButton variant="destructive-outline" onClick={onDeleteTask}>
                <Trash className="w-5" />
              </IconButton>
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
}
