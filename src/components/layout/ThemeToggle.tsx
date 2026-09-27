import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n/language-context";

const STORAGE_KEY = "sp_theme";

export function ThemeToggle() {
  const { t } = useI18n();
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((v) => !v)}
      className="btn btn-outline btn-icon rounded-full"
      aria-label={isDark ? t.common.themeToLight : t.common.themeToDark}
      title={isDark ? t.common.themeLight : t.common.themeDark}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
