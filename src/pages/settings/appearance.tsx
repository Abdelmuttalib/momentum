import { FontSelect } from "@/components/font-select";
import { SettingsContentLayout, SettingsSectionTitle } from ".";
import { ThemeModeSelect } from "@/components/theme-customization";
import { FontSizeSelect } from "@/components/font-size-select";
import {
  SettingDivider,
  SettingSection,
} from "@/components/settings/setting-section";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";

export default function AppearanceSettings() {
  return (
    <SettingsContentLayout>
      <SettingsSectionTitle>Appearance</SettingsSectionTitle>
      <div className="flex flex-col">
        <SettingSection
          title="Theme mode"
          description="Choose a light or dark interface."
        >
          <ThemeModeSelect className="w-full max-w-md" />
        </SettingSection>
        <SettingDivider />
        <SettingSection
          title="Font family"
          description="Choose a font for your interface."
        >
          <FontSelect />
        </SettingSection>
        <SettingDivider />
        <SettingSection
          title="Font size"
          description="Choose a text size for your interface."
        >
          <FontSizeSelect />
        </SettingSection>
      </div>
    </SettingsContentLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
