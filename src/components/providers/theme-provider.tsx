import { ThemeProvider as NextThemeProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      defaultTheme="system"
      attribute="class"
      themes={["light", "dark"]}
    >
      {children}
    </NextThemeProvider>
  );
}
