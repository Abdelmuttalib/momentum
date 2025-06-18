import { Toaster } from "@/components/ui/sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      expand
      visibleToasts={4}
      closeButton
    />
  );
}
