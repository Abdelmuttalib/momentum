import { useFont } from "@/hooks/use-font";
import { useFontSize } from "@/hooks/use-font-size";
import { useThemeColor } from "@/hooks/use-theme-color";
import { cn } from "@/utils/cn";
import { useEffect } from "react";

interface ThemeColorWrapperProps extends React.ComponentProps<"div"> {
  defaultTheme?: string;
}

export function ThemeColorWrapper({
  children,
  className,
}: ThemeColorWrapperProps) {
  // const [fontSize] = useFontSize();

  // const fonts = 'font-inter font-general-sans font-plus-jakarta font-onest';

  // const fontSizeClasses =
  //   'font-sizes-small font-sizes-default font-sizes-large';

  // const fontSizeClass = `theme-text-sizes-${fontSize.fontSize}`;


  const [themeColor] = useThemeColor();
  const [font] = useFont();

  const fontClass = `font-${font.font || "general-sans"}`;

  const [fontSize] = useFontSize();

  const fontSizeClass = `theme-text-sizes-${fontSize.fontSize}`;

  useEffect(() => {
    if (document) {
      // Remove existing font classes and add the new one

      document.documentElement.classList.forEach((className) => {
        if (className.startsWith("font-")) {
          document.documentElement.classList.remove(className);
        }
      });
      document.documentElement.classList.add(fontClass);

      // Remove existing theme color classes and add the new one
      document.documentElement.classList.forEach((className) => {
        if (className.startsWith("theme-")) {
          document.documentElement.classList.remove(className);
        }
      });
      document.documentElement.classList.add(`theme-${themeColor.colorName}`);

      // Only add/remove font size class if it's not 'default'
      if (fontSizeClass) {
        document.documentElement.classList.forEach((className) => {
          if (className.startsWith("theme-text-sizes-")) {
            document.documentElement.classList.remove(className);
          }
        });
        document.documentElement.classList.add(fontSizeClass);
      }
    }
  }, [fontClass, fontSizeClass, themeColor]);

  return (
    <div
      className={cn(
        // `theme-${defaultTheme || themeColor}`,
        "relative w-full",
        // fonts,
        // fontSizeClass,
        className
      )}
      // style={
      //   {
      //     "--radius": `${defaultTheme ? 0.5 : config.radius}rem`,
      //   } as React.CSSProperties
      // }
    >
      {children}
    </div>
  );
}
