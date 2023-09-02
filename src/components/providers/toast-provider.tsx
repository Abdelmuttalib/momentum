import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      // expand
      // visibleToasts={6}
      closeButton
    />
  );
}
