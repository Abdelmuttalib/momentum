import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type ReactNode, useState } from "react";

interface DialogFormProps<T = unknown> {
  triggerButton: ReactNode;
  title: string;
  description?: string;
  dialogContentClassName?: string;
  extraControls?: T;
  children: (controls: { onClose: () => void } & T) => ReactNode;
}

export function DialogForm<T = unknown>({
  triggerButton,
  title,
  description,
  dialogContentClassName,
  extraControls,
  children,
}: DialogFormProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  function onClose() {
    setIsOpen(false);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>

        <DialogContent className={dialogContentClassName}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="mt-4">{children({ onClose, ...extraControls })}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
