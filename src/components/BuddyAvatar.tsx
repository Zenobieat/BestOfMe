"use client";

import { BUDDIES_CATALOG } from "@/lib/catalog";

interface Props {
  species: string;
  size?: number;
}

// T-Rex is at cost 8500 — buddies beyond this get premium Twemoji SVG art
const PREMIUM_THRESHOLD_COST = 8500;

function emojiToCodepoint(emoji: string): string {
  const points: string[] = [];
  for (const char of emoji) {
    const cp = char.codePointAt(0);
    if (cp !== undefined && cp !== 0xFE0F) { // skip variation selector
      points.push(cp.toString(16));
    }
  }
  return points.join("-");
}

// Simple CSS avatar — used for starter/common buddies (up to T-Rex)
function SimpleAvatar({ emoji, colors, size }: { emoji: string; colors: { body: string; accent: string; dark: string; glow?: string }; size: number }) {
  const glowStyle = colors.glow
    ? { boxShadow: `0 0 ${size * 0.25}px ${colors.glow}55, 0 0 ${size * 0.1}px ${colors.glow}33` }
    : {};
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `radial-gradient(circle at 38% 32%, ${colors.accent} 0%, ${colors.body} 55%, ${colors.dark} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, ...glowStyle,
    }}>
      <span style={{ fontSize: size * 0.44, lineHeight: 1, userSelect: "none" }}>{emoji}</span>
    </div>
  );
}

// Premium avatar — uses Twemoji SVG from jsDelivr CDN (much higher quality)
function PremiumAvatar({ emoji, colors, size, tier }: { emoji: string; colors: { body: string; accent: string; dark: string; glow?: string }; size: number; tier: number }) {
  const codepoint = emojiToCodepoint(emoji);
  const src = `https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/svg/${codepoint}.svg`;
  const glow = colors.glow ?? colors.accent;

  const borderGlow = tier >= 6
    ? `0 0 ${size * 0.3}px ${glow}88, 0 0 ${size * 0.15}px ${glow}55, inset 0 0 ${size * 0.1}px ${glow}22`
    : tier >= 5
    ? `0 0 ${size * 0.2}px ${glow}66, 0 0 ${size * 0.08}px ${glow}33`
    : `0 0 ${size * 0.12}px ${glow}44`;

  return (
    <div style={{
      width: size, height: size, borderRadius: tier >= 6 ? "30%" : "50%",
      background: `radial-gradient(circle at 35% 30%, ${colors.accent}44, ${colors.body}66, ${colors.dark}88)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, position: "relative", overflow: "visible",
      boxShadow: borderGlow,
      border: tier >= 5 ? `1.5px solid ${glow}44` : "none",
    }}>
      {/* Glow ring for diamond tier */}
      {tier >= 6 && (
        <div style={{
          position: "absolute", inset: -3, borderRadius: "32%",
          border: `1.5px solid ${glow}33`,
          animation: "spin-slow 8s linear infinite",
          pointerEvents: "none",
        }} />
      )}
      <img
        src={src}
        alt={emoji}
        width={size * 0.72}
        height={size * 0.72}
        style={{ objectFit: "contain", pointerEvents: "none", userSelect: "none" }}
        loading="lazy"
        onError={(e) => {
          // Fallback to emoji text if image fails to load
          const el = e.currentTarget;
          el.style.display = "none";
          const span = document.createElement("span");
          span.textContent = emoji;
          span.style.fontSize = `${size * 0.44}px`;
          el.parentElement?.appendChild(span);
        }}
      />
    </div>
  );
}

export function BuddyAvatar({ species, size = 80 }: Props) {
  const entry = BUDDIES_CATALOG.find((b) => b.id === species);
  const c = entry?.colors ?? { body: "#6366F1", accent: "#818CF8", dark: "#1e1b4b" };
  const emoji = entry?.emoji ?? "✨";
  const tier = entry?.tier ?? 1;
  const cost = entry?.cost ?? 0;

  const isPremium = cost > PREMIUM_THRESHOLD_COST;

  if (isPremium) {
    return <PremiumAvatar emoji={emoji} colors={c} size={size} tier={tier} />;
  }

  return <SimpleAvatar emoji={emoji} colors={c} size={size} />;
}
