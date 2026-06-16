"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme ?? "dark";
  }, [theme]);

  return <>{children}</>;
}
