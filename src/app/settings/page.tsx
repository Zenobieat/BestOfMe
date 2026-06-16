"use client";

import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { Language } from "@/lib/types";
import { BomLogo } from "@/components/BomLogo";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const user = useStore((s) => s.user);
  const updateUser = useStore((s) => s.updateUser);
  const router = useRouter();

  const lang = user?.language ?? "nl";
  const tt = useT(lang);

  if (!user) return null;

  const handleReset = () => {
    if (
      window.confirm(
        lang === "nl"
          ? "Weet je zeker dat je alles wilt resetten? Dit kan niet ongedaan worden."
          : "Are you sure you want to reset everything? This cannot be undone."
      )
    ) {
      localStorage.removeItem("bestofme-storage");
      router.push("/onboarding");
      window.location.reload();
    }
  };

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bom-bg)", paddingBottom: 90 }}>
      <div className="safe-top" style={{ padding: "16px 20px", background: "linear-gradient(180deg, #1A0A2E 0%, var(--bom-bg) 100%)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{tt("settings")}</h1>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Profile */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: 20, borderRadius: 20,
            background: "var(--bom-surface)",
            border: "1px solid var(--bom-border)",
            marginBottom: 16,
          }}>
            <BomLogo size={50} />
            <div>
              <p style={{ fontWeight: 800, fontSize: 18 }}>{user.name}</p>
              <p style={{ color: "var(--bom-muted)", fontSize: 13 }}>
                {lang === "nl" ? "Lid sinds" : "Member since"}{" "}
                {new Date(user.createdAt).toLocaleDateString(lang === "nl" ? "nl-BE" : "en-GB")}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { icon: "✅", label: tt("total_completed"), value: user.totalTasksCompleted },
              { icon: "🔥", label: tt("longest_streak"), value: `${user.longestStreak} ${tt("days")}` },
              { icon: "🪙", label: tt("bom_coins"), value: user.bomCoins },
              { icon: "📅", label: lang === "nl" ? "Huidige streak" : "Current streak", value: `${user.currentStreak} ${tt("days")}` },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                style={{
                  padding: 16, borderRadius: 16,
                  background: "var(--bom-surface)",
                  border: "1px solid var(--bom-border)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 24 }}>{icon}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: "var(--bom-purple-light)" }}>{value}</p>
                <p style={{ fontSize: 11, color: "var(--bom-muted)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Language */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, color: "var(--bom-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {tt("choose_language")}
          </h3>
          <div style={{ display: "flex", gap: 12 }}>
            {(["nl", "en"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => updateUser({ language: l })}
                style={{
                  flex: 1, padding: "14px",
                  borderRadius: 16,
                  border: `2px solid ${user.language === l ? "var(--bom-purple)" : "var(--bom-border)"}`,
                  background: user.language === l ? "rgba(124,58,237,0.2)" : "var(--bom-surface)",
                  color: user.language === l ? "var(--bom-purple-light)" : "var(--bom-muted)",
                  fontSize: 15, fontWeight: 700,
                }}
              >
                {l === "nl" ? "🇧🇪 Nederlands" : "🇬🇧 English"}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, color: "var(--bom-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {tt("goals")}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {user.goals.map((g) => (
              <span
                key={g}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "rgba(124,58,237,0.2)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  color: "var(--bom-purple-light)",
                  fontSize: 13, fontWeight: 600,
                }}
              >
                {tt(`goal_${g}` as Parameters<typeof tt>[0])}
              </span>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <h3 style={{ fontSize: 14, color: "var(--bom-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {lang === "nl" ? "Gevaarzone" : "Danger zone"}
          </h3>
          <button
            onClick={handleReset}
            style={{
              width: "100%", padding: "14px",
              borderRadius: 16,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#EF4444",
              fontSize: 15, fontWeight: 700,
            }}
          >
            🗑 {lang === "nl" ? "Alles resetten" : "Reset everything"}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
