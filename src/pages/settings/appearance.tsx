import { FontSelect } from "@/components/font-select";
import { SettingsContentLayout } from ".";
import { ThemeModeSelect } from "@/components/theme-customization";
import { Button } from "@/components/ui/button";
import { FontSizeSelect } from "@/components/font-size-select";

export default function AppearanceSettings() {
  return (
    <SettingsContentLayout
      title="Appearance Settings"
      description="dd"
      actions={
        <>
          <Button variant="default">Save Changes</Button>
        </>
      }
    >
      <div>
        <div className="border-b py-6 text-sm lg:flex lg:items-start">
          <div className="mb-1 space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
            <h3 className="text-foreground">Theme mode</h3>
            <p className="max-w-[420px] text-muted-foreground">
              Choose a theme mode for your store
            </p>
          </div>
          <div className="lg:flex-grow">
            <ThemeModeSelect className="w-full" />
          </div>
        </div>
        <div className="border-b py-6 text-sm lg:flex lg:items-start">
          <div className="mb-1 space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
            <h3 className="text-foreground">
              Font family <span className="text-destructive">*</span>
            </h3>
            <p className="max-w-[420px] text-muted-foreground">
              Choose a font family for your interface
            </p>
          </div>
          <div className="lg:flex-grow">
            <FontSelect />
          </div>
        </div>
        <div className="border-b py-6 text-sm lg:flex lg:items-start">
          <div className="mb-1 space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
            <h3 className="text-foreground">Font size</h3>
            <p className="max-w-[420px] text-muted-foreground">
              Choose a font size for your interface
            </p>
          </div>
          <div className="lg:flex-grow">
            <FontSizeSelect />
          </div>
        </div>
        {/* <div className="border-gray-100 border-b py-6 text-sm lg:flex lg:items-start">
          <div className="mb-1 space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
            <h3 className="text-foreground">Theme color</h3>
            <p className="max-w-[420px] text-muted-foreground">
              Choose a color theme for your store
            </p>
          </div>
          <div className="lg:flex-grow">
          </div>
        </div> */}
      </div>
    </SettingsContentLayout>
  );
}
