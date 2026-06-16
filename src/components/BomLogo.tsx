"use client";

export function BomLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1A2E" />
          <stop offset="100%" stopColor="#0F0F1A" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" stroke="url(#bomGrad)" strokeWidth="2" />
      {/* BOM text */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fill="url(#bomGrad)"
        fontSize="28"
        fontWeight="800"
        fontFamily="-apple-system, 'SF Pro Display', sans-serif"
        letterSpacing="1"
      >
        BOM
      </text>
      {/* Star accent */}
      <circle cx="80" cy="20" r="5" fill="#F59E0B" opacity="0.8" />
      <circle cx="20" cy="80" r="3" fill="#A78BFA" opacity="0.6" />
    </svg>
  );
}
