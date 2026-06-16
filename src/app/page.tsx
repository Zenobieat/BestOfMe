"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { BomLogo } from "@/components/BomLogo";

export default function RootPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user?.onboardingCompleted) {
        router.replace("/dashboard");
      } else {
        router.replace("/onboarding");
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #0F0F1A 0%, #1A0A2E 100%)",
        gap: 20,
      }}
    >
      <div style={{ animation: "float 2s ease-in-out infinite" }}>
        <BomLogo size={100} />
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>
        <span className="gradient-text">BestOfMe</span>
      </h1>
      <p style={{ color: "var(--bom-muted)", fontSize: 14 }}>Loading...</p>
    </div>
  );
}
