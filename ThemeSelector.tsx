import { Sun, Moon, Sunrise, Sunset, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/dashboard/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeSelector() {
  const { theme, setTheme, customTheme, setCustomTheme } = useTheme();

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
  ] as const;

  const customThemes = [
    { id: "default", label: "Default", icon: Palette },
    { id: "morning", label: "Morning", icon: Sunrise },
    { id: "night", label: "Night", icon: Sunset },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          {customTheme === "morning" ? (
            <Sunrise className="h-4 w-4" />
          ) : customTheme === "night" ? (
            <Sunset className="h-4 w-4" />
          ) : theme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={theme === themeOption.id ? "bg-accent" : ""}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{themeOption.label}</span>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        {customThemes.map((customThemeOption) => {
          const Icon = customThemeOption.icon;
          return (
            <DropdownMenuItem
              key={customThemeOption.id}
              onClick={() => setCustomTheme(customThemeOption.id)}
              className={customTheme === customThemeOption.id ? "bg-accent" : ""}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{customThemeOption.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}