import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/router";

export type BackButtonProps = {
  fallback?: string;
  href?: string;
  text?: "Back" | "Cancel" | string;
  disabled?: boolean;
  onClick?: () => void;
  withArrow?: boolean;
};

export function BackButton({
  fallback,
  href,
  text = "Back",
  disabled,
  onClick,
  withArrow = false,
}: BackButtonProps) {
  const router = useRouter();

  async function onBack() {
    if (onClick) {
      onClick();
      return;
    }

    if (href) {
      await router.push(href);
      return;
    }

    router.back();
  }

  return (
    <Button
      type="button"
      title={text}
      variant="outline"
      onClick={() => {
        void onBack();
      }} // Go back
      disabled={disabled}
    >
      {withArrow && <ArrowLeftIcon className="h-4 w-4" />}
      {text}
    </Button>
  );
}
