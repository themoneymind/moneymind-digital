import { useTheme } from "@/hooks/use-theme";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

export const DisplaySettings = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-background rounded-apple">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Display Settings</CardTitle>
          <CardDescription className="text-muted-foreground">
            Customize your app appearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-muted">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="dark-mode" className="text-foreground">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={handleThemeChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};