"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { Home, CalendarDays, CheckSquare, PawPrint, Bot, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", Icon: Home,        label: { nl: "Home",     en: "Home" } },
  { href: "/calendar",  Icon: CalendarDays, label: { nl: "Kalender", en: "Calendar" } },
  { href: "/tasks",     Icon: CheckSquare,  label: { nl: "Taken",    en: "Tasks" } },
  { href: "/pets",      Icon: PawPrint,     label: { nl: "Dieren",   en: "Pets" } },
  { href: "/ai",        Icon: Bot,          label: { nl: "Coach",    en: "Coach" } },
  { href: "/settings",  Icon: Settings,     label: { nl: "Profiel",  en: "Profile" } },
];

export function BottomNav() {
  const pathname = usePathname();
  const lang = useStore((s) => s.user?.language ?? "nl");

  return (
    <nav
      className="glass safe-bottom"
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", alignItems: "stretch",
        justifyContent: "space-around",
        padding: "6px 0 2px",
        zIndex: 100,
        borderTop: "1px solid var(--border)",
      }}
    >
      {NAV_ITEMS.map(({ href, Icon, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 3, padding: "6px 4px",
              borderRadius: 10,
              color: active ? "var(--primary-light)" : "var(--text-faint)",
              transition: "color 0.2s",
              position: "relative",
            }}
          >
            {active && (
              <div style={{
                position: "absolute", top: 0, left: "20%", right: "20%", height: 2,
                background: "var(--primary)",
                borderRadius: "0 0 2px 2px",
              }} />
            )}
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, letterSpacing: "0.02em" }}>
              {label[lang]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
