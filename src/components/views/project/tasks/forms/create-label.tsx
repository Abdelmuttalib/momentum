/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/20/solid";
import type { Priority } from "@/utils/enums";
import { extractedColors } from "@/utils/tailwind-colors";
import { useCreateLabel } from "@/hooks/use-create-label";
import { DialogForm } from "@/components/common/dialog-form";
import { toast } from "sonner";

function CreateLabelForm({
  onSuccess,
  onError,
  onCancel,
}: {
  onSuccess: () => void;
  onError: () => void;
  onCancel: () => void;
}) {
  const { form, handleSubmit, mutation } = useCreateLabel({
    onSuccess,
    onError,
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 py-2">
        <div className="flex flex-col gap-y-2">
          <div className="space-y-2">
            <Label htmlFor="label">Name</Label>
            <Input
              id="label"
              type="text"
              {...form.register("name")}
              placeholder="label"
              inputMode="text"
              disabled={mutation.isLoading}
              data-invalid={form.formState.errors.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Controller
              name="color"
              control={form.control}
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={(value) => field.onChange(value as Priority)}
                  disabled={mutation.isLoading}
                >
                  <SelectTrigger className="h-fit w-full">
                    <SelectValue placeholder="color" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 overflow-y-auto">
                    <SelectGroup>
                      {extractedColors?.map((color) => (
                        <SelectItem
                          key={color.name}
                          value={color.shade500}
                          className="py-2.5"
                        >
                          <span className="flex items-center gap-x-1.5 capitalize">
                            <span
                              className="h-3 w-3 rounded"
                              style={{
                                backgroundColor: color.shade500,
                              }}
                            ></span>
                            <span>{color.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="mt-2 flex flex-col-reverse md:flex-row md:gap-2 lg:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={mutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 lg:flex-initial"
            disabled={mutation.isLoading}
            isLoading={mutation.isLoading}
          >
            Create Label
          </Button>
        </div>
      </div>
    </form>
  );
}

// export default function CreateLabel() {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button
//           size="sm"
//           className="ml-2 inline-flex gap-1 whitespace-nowrap capitalize"
//         >
//           <PlusIcon className="w-5" /> Create Label
//         </Button>
//       </DialogTrigger>
//       {isOpen && (
//         <DialogContent className=" bg-white sm:max-w-xs">
//           <DialogHeader className="space-y-0">
//             <DialogTitle>
//               <h2 className="h5 inline">Create a new Label</h2>
//             </DialogTitle>
//           </DialogHeader>

//           <CreateLabelForm
//             onSuccess={() => setIsOpen(false)}
//             onError={() => setIsOpen(false)}
//             onCancel={() => setIsOpen(false)}
//           />
//         </DialogContent>
//       )}
//     </Dialog>
//   );
// }

export function CreateLabel() {
  return (
    <>
      <DialogForm
        title="Create a new Label (task label)"
        description="Labels are a great way to organize your tasks."
        triggerButton={
          <Button
            type="button"
            className="ml-2 inline-flex gap-1 whitespace-nowrap"
          >
            <PlusIcon className="w-4" />
            Create Label
          </Button>
        }
        dialogContentClassName="sm:max-w-md"
      >
        {({ onClose }) => (
          <CreateLabelForm
            onSuccess={() => {
              // toast.success("Label created successfully");
              onClose();
            }}
            onCancel={onClose}
            onError={() => {
              // toast.error("Failed to create label");
              onClose();
            }}
          />
        )}
      </DialogForm>
    </>
  );
}
