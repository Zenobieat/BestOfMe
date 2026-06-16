"use client";

import { BUDDIES_CATALOG } from "@/lib/catalog";

interface Props {
  species: string;
  size?: number;
}

// Lightweight CSS avatar — no WebGL, safe for large grids
export function BuddyAvatar({ species, size = 80 }: Props) {
  const entry = BUDDIES_CATALOG.find((b) => b.id === species);
  const c = entry?.colors ?? { body: "#6366F1", accent: "#818CF8", dark: "#1e1b4b", glow: undefined };
  const emoji = entry?.emoji ?? "✨";

  const glowStyle = c.glow
    ? { boxShadow: `0 0 ${size * 0.25}px ${c.glow}55, 0 0 ${size * 0.1}px ${c.glow}33` }
    : {};

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 38% 32%, ${c.accent} 0%, ${c.body} 55%, ${c.dark} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...glowStyle,
      }}
    >
      <span style={{ fontSize: size * 0.42, lineHeight: 1, userSelect: "none" }}>{emoji}</span>
    </div>
  );
}
