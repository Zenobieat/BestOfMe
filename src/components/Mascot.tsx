"use client";

interface MascotProps {
  mood?: "happy" | "excited" | "thinking" | "proud" | "neutral";
  size?: number;
  className?: string;
}

const MOODS = {
  happy: { face: "😊", glow: "#7C3AED" },
  excited: { face: "🤩", glow: "#F59E0B" },
  thinking: { face: "🤔", glow: "#60A5FA" },
  proud: { face: "🥳", glow: "#10B981" },
  neutral: { face: "😌", glow: "#7C3AED" },
};

export function Mascot({ mood = "happy", size = 80, className = "" }: MascotProps) {
  const { face, glow } = MOODS[mood];

  return (
    <div
      className={`relative flex items-center justify-center float-anim ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow}30 0%, transparent 70%)`,
          animation: "pulse-glow 2s ease-in-out infinite",
        }}
      />
      {/* Main body - star shape with personality */}
      <div
        style={{
          width: size * 0.85,
          height: size * 0.85,
          borderRadius: "40% 60% 55% 45% / 45% 40% 60% 55%",
          background: `linear-gradient(135deg, ${glow}CC, ${glow}88)`,
          border: `2px solid ${glow}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.4,
          boxShadow: `0 8px 32px ${glow}40`,
          position: "relative",
        }}
      >
        {face}
        {/* Sparkles */}
        <div
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            fontSize: size * 0.18,
          }}
        >
          ✨
        </div>
      </div>
    </div>
  );
}
