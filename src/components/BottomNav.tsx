"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "🏠", key: "dashboard" as const },
  { href: "/calendar", icon: "📅", key: "calendar" as const },
  { href: "/tasks", icon: "✅", key: "tasks" as const },
  { href: "/pets", icon: "🐾", key: "pets" as const },
  { href: "/ai", icon: "🤖", key: "ai_coach" as const },
  { href: "/settings", icon: "⚙️", key: "settings" as const },
];

export function BottomNav() {
  const pathname = usePathname();
  const user = useStore((s) => s.user);
  const lang = user?.language ?? "nl";
  const tt = useT(lang);

  return (
    <nav
      className="glass safe-bottom"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "8px 0 4px",
        zIndex: 100,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {NAV_ITEMS.map(({ href, icon, key }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 12,
              transition: "all 0.2s",
              background: active ? "rgba(124,58,237,0.2)" : "transparent",
            }}
          >
            <span style={{ fontSize: 22 }}>{icon}</span>
            <span
              style={{
                fontSize: 10,
                color: active ? "var(--bom-purple-light)" : "var(--bom-muted)",
                fontWeight: active ? 600 : 400,
              }}
            >
              {tt(key)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
