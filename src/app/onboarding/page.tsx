"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { GoalCategory, Language } from "@/lib/types";
import { BomLogo } from "@/components/BomLogo";
import { Mascot } from "@/components/Mascot";
import { t } from "@/lib/i18n";

const GOAL_OPTIONS: { id: GoalCategory; emoji: string }[] = [
  { id: "fitness", emoji: "💪" },
  { id: "money", emoji: "💰" },
  { id: "consistency", emoji: "🔥" },
  { id: "school", emoji: "📚" },
  { id: "mindset", emoji: "🧠" },
  { id: "relationships", emoji: "❤️" },
  { id: "creativity", emoji: "🎨" },
  { id: "health", emoji: "🌿" },
];

type Step = "language" | "name" | "goals" | "welcome";

export default function OnboardingPage() {
  const router = useRouter();
  const initUser = useStore((s) => s.initUser);
  const [step, setStep] = useState<Step>("language");
  const [lang, setLang] = useState<Language>("nl");
  const [name, setName] = useState("");
  const [goals, setGoals] = useState<GoalCategory[]>([]);

  const tt = (key: Parameters<typeof t>[0]) => t(key, lang);

  const toggleGoal = (g: GoalCategory) => {
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const handleFinish = () => {
    initUser(name || "Vriend", lang, goals.length > 0 ? goals : ["consistency"]);
    router.push("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #0F0F1A 0%, #1A0A2E 50%, #0F0F1A 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "env(safe-area-inset-top, 20px) 24px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div style={{
        position: "absolute", top: "10%", right: "10%",
        width: 200, height: 200, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", left: "5%",
        width: 150, height: 150, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420, zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40, marginBottom: 24 }}>
          <BomLogo size={72} />
        </div>

        {step === "language" && (
          <div className="slide-up" style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
              <span className="gradient-text">BestOfMe</span>
            </h1>
            <p style={{ color: "var(--bom-muted)", marginBottom: 40, fontSize: 16 }}>
              Word de beste versie van jezelf ✨
            </p>
            <p style={{ marginBottom: 20, fontWeight: 600, fontSize: 18 }}>
              Kies je taal / Choose your language
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              {(["nl", "en"] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setStep("name"); }}
                  style={{
                    padding: "20px 40px",
                    borderRadius: 16,
                    border: "2px solid",
                    borderColor: lang === l ? "var(--bom-purple)" : "var(--bom-border)",
                    background: "var(--bom-surface)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--bom-text)",
                    transition: "all 0.2s",
                  }}
                >
                  {l === "nl" ? "🇧🇪 Nederlands" : "🇬🇧 English"}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "name" && (
          <div className="slide-up">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <Mascot mood="happy" size={100} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>
              {tt("welcome")}
            </h2>
            <p style={{ color: "var(--bom-muted)", marginBottom: 32, textAlign: "center" }}>
              {tt("whats_your_name")}
            </p>
            <input
              type="text"
              placeholder={lang === "nl" ? "Jouw naam..." : "Your name..."}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginBottom: 24, fontSize: 18 }}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && setStep("goals")}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep("language")} style={secondaryBtn}>
                {tt("back")}
              </button>
              <button onClick={() => setStep("goals")} style={primaryBtn}>
                {tt("next")} →
              </button>
            </div>
          </div>
        )}

        {step === "goals" && (
          <div className="slide-up">
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>
              {lang === "nl" ? `Hey ${name || "daar"}! 👋` : `Hey ${name || "there"}! 👋`}
            </h2>
            <p style={{ color: "var(--bom-muted)", marginBottom: 24, textAlign: "center", fontSize: 15 }}>
              {tt("choose_goals")}
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 28,
            }}>
              {GOAL_OPTIONS.map(({ id, emoji }) => {
                const selected = goals.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleGoal(id)}
                    style={{
                      padding: "16px 12px",
                      borderRadius: 16,
                      border: "2px solid",
                      borderColor: selected ? "var(--bom-purple)" : "var(--bom-border)",
                      background: selected
                        ? "rgba(124,58,237,0.2)"
                        : "var(--bom-surface)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.2s",
                      transform: selected ? "scale(0.97)" : "scale(1)",
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{emoji}</span>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: selected ? "var(--bom-purple-light)" : "var(--bom-text)",
                      textAlign: "center",
                    }}>
                      {tt(`goal_${id}` as Parameters<typeof t>[0])}
                    </span>
                    {selected && (
                      <span style={{ fontSize: 14, color: "var(--bom-purple)" }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep("name")} style={secondaryBtn}>
                {tt("back")}
              </button>
              <button onClick={handleFinish} style={primaryBtn}>
                {tt("finish")} 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  flex: 1,
  padding: "16px",
  borderRadius: 14,
  background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
  border: "none",
  color: "white",
  fontSize: 16,
  fontWeight: 700,
  transition: "opacity 0.2s",
};

const secondaryBtn: React.CSSProperties = {
  padding: "16px 20px",
  borderRadius: 14,
  background: "var(--bom-surface)",
  border: "1px solid var(--bom-border)",
  color: "var(--bom-muted)",
  fontSize: 16,
  fontWeight: 600,
};
