import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/router";

export type BackButtonProps = {
  fallback?: string;
  text?: "Back" | "Cancel" | string;
  disabled?: boolean;
  onClick?: () => void;
  withArrow?: boolean;
};

export function BackButton({
  fallback,
  text = "Back",
  disabled,
  onClick,
  withArrow = false,
}: BackButtonProps) {
  const router = useRouter();

  function onBack() {
    if (onClick) {
      onClick();
      return;
    }

    // if (fallback) {
    //   await router.push(fallback);
    //   return;
    // }

    router.back();
  }

  return (
    <Button
      type="button"
      title={text}
      variant="outline"
      onClick={onBack} // Go back
      disabled={disabled}
    >
      {withArrow && <ArrowLeftIcon className="h-4 w-4" />}
      {text}
    </Button>
  );
}
