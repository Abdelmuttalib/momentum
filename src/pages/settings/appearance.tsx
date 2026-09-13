import { FontSelect } from "@/components/font-select";
import { SettingsContentLayout, SettingsSectionTitle } from ".";
import { ThemeModeSelect } from "@/components/theme-customization";
import { FontSizeSelect } from "@/components/font-size-select";
import {
  SettingDivider,
  SettingSection,
} from "@/components/settings/setting-section";
import { type GetServerSideProps } from "next";
import { requireAuthPage } from "@/server/auth-guard";
import { useTranslations } from "next-intl";

export default function AppearanceSettings() {
  const t = useTranslations("settings");
  return (
    <SettingsContentLayout>
      <SettingsSectionTitle>{t("appearance")}</SettingsSectionTitle>
      <div className="flex flex-col">
        <SettingSection
          title={t("themeMode")}
          description={t("themeModeDescription")}
        >
          <ThemeModeSelect className="w-full max-w-md" />
        </SettingSection>
        <SettingDivider />
        <SettingSection
          title={t("fontFamily")}
          description={t("fontFamilyDescription")}
        >
          <FontSelect />
        </SettingSection>
        <SettingDivider />
        <SettingSection
          title={t("fontSize")}
          description={t("fontSizeDescription")}
        >
          <FontSizeSelect />
        </SettingSection>
      </div>
    </SettingsContentLayout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage();
