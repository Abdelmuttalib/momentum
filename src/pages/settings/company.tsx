import { SettingsContentLayout, SettingsSectionTitle } from ".";
import { CompanySettings } from "@/components/views/settings";
import { type GetServerSideProps } from "next";
import { requireAuthPage } from "@/server/auth-guard";
import { useTranslations } from "next-intl";

export default function CompanySettingsPage() {
  const t = useTranslations("settings");
  return (
    <SettingsContentLayout>
      <SettingsSectionTitle>{t("company")}</SettingsSectionTitle>
      <CompanySettings />
    </SettingsContentLayout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage();
