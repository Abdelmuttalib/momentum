import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import type { Task } from "@prisma/client";
import { Trash } from "lucide-react";

export default function TaskView({ task }: { task: Task }) {
  // const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog
    // open={isOpen} onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-fit w-fit rounded border-none p-0"
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      {/* {isOpen && ( */}
      <DialogContent>
        <DialogHeader className="space-y-0">
          <DialogTitle className="flex items-center gap-x-6">
            <h2 className="h5 inline">Update Task</h2>
            <Button size="icon" variant="outline-destructive">
              <Trash className="w-5" />
            </Button>
          </DialogTitle>
          <DialogDescription className="body-sm inline text-gray-600">
            <p>Update Task information.</p>
          </DialogDescription>
        </DialogHeader>

        {/* content */}
        <div>{JSON.stringify(task)}</div>
      </DialogContent>
      {/* // )} */}
    </Dialog>
  );
}
