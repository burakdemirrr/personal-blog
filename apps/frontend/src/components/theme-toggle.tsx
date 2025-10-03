"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { useTranslations } from "next-intl"

export const ModeToggle = React.memo(() => {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const t = useTranslations('Theme');

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSetLight = React.useCallback(() => setTheme("light"), [setTheme]);
  const handleSetDark = React.useCallback(() => setTheme("dark"), [setTheme]);
  const handleSetSystem = React.useCallback(() => setTheme("system"), [setTheme]);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="cursor-pointer">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSetLight}>
          {t('light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSetDark}>
          {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSetSystem}>
          {t('system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
});

ModeToggle.displayName = 'ModeToggle';
