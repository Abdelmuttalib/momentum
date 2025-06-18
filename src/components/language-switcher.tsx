import { useRouter } from "next/router";
import { IconLink } from "./ui/icon-button";
import { LanguageIcon } from "@heroicons/react/20/solid";

export default function LanguageSwitcher() {
  const { asPath, locale } = useRouter();
  return (
    <IconLink
      href={asPath}
      locale={locale === "en" ? "zh" : "en"}
      variant="outline"
      size="sm"
      className="inline-flex h-10 w-24 items-center justify-center gap-2 border-gray-100 p-0 text-primary hover:border-gray-200"
    >
      <LanguageIcon className="h-6 w-6 text-gray-800" />
      <div className="h-7 w-0.5 bg-slate-200"></div>
      <p className="label-md font-bold uppercase">
        {locale === "en" ? "zh" : "en"}
      </p>
    </IconLink>
  );
}
