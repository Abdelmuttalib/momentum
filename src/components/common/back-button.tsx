import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

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
  text,
  disabled,
  onClick,
  withArrow = false,
}: BackButtonProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const label = text ?? t("back");

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
      title={label}
      variant="outline"
      onClick={() => {
        void onBack();
      }} // Go back
      disabled={disabled}
    >
      {withArrow && <ArrowLeftIcon className="h-4 w-4 rtl:-scale-x-100" />}
      {label}
    </Button>
  );
}
