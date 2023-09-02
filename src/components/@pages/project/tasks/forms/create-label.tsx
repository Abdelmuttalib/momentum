/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
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
import { PlusIcon } from "@heroicons/react/20/solid";
import { api } from "@/utils/api";
import { toast } from "sonner";
import type { Priority } from "@/utils/enums";
import { extractedColors } from "@/utils/tailwind-colors";

const labelFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").nonempty(),
  color: z.string().nonempty(), // You might need to adjust the color validation here
});

type LabelFormSchema = z.infer<typeof labelFormSchema>;

function CreateLabelForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LabelFormSchema>();

  const apiContext = api.useContext();

  const createLabelMutation = api.task.createLabel.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      await apiContext.task.getLabels.invalidate();
      onSuccess();
      toast.success("Label created successfully");
    },
    onError: () => {
      toast.error("Error creating label");
    },
  });

  const onSubmit = async (data: LabelFormSchema) => {
    // Label created successfully, redirect or show a success message
    await createLabelMutation.mutateAsync({
      name: data.name,
      color: data.color,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <div>
          <Label htmlFor="label">Name:</Label>
          <Input
            id="label"
            type="text"
            {...register("name")}
            placeholder="label"
            inputMode="text"
            error={errors.name}
          />
        </div>
        <div>
          <Label htmlFor="color">Color: </Label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value as Priority)}
              >
                <SelectTrigger className="h-fit w-full text-gray-800">
                  <SelectValue placeholder="color" />
                </SelectTrigger>
                <SelectContent className="max-h-80 overflow-y-auto">
                  <SelectGroup>
                    {extractedColors?.map((color) => (
                      <SelectItem
                        key={color.name}
                        value={color.shade500 as string}
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
          {errors.color && (
            <p className="text-red-500">{errors.color?.message}</p>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-col-reverse md:flex-row md:gap-2 lg:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createLabelMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 lg:flex-initial"
          disabled={createLabelMutation.isLoading}
          isLoading={createLabelMutation.isLoading}
        >
          Create Label
        </Button>
      </div>
    </form>
  );
}

export default function CreateLabel() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="ml-2 inline-flex gap-1 whitespace-nowrap capitalize"
        >
          <PlusIcon className="w-5" /> Create Label
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className=" bg-white sm:max-w-xs">
          <DialogHeader className="space-y-0">
            <DialogTitle>
              <h2 className="h5 inline">Create a new Label</h2>
            </DialogTitle>
          </DialogHeader>

          <CreateLabelForm
            onSuccess={() => setIsOpen(false)}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
