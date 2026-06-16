"use client";

import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { Language } from "@/lib/types";
import { BomLogo } from "@/components/BomLogo";
import { useRouter } from "next/navigation";
import { Moon, Sun, Flame, CheckCircle, Coins, CalendarDays, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const user = useStore((s) => s.user);
  const updateUser = useStore((s) => s.updateUser);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const router = useRouter();

  const lang = user?.language ?? "nl";
  const tt = useT(lang);

  if (!user) return null;

  const handleReset = () => {
    if (window.confirm(
      lang === "nl"
        ? "Weet je zeker dat je alles wilt resetten? Dit kan niet ongedaan worden."
        : "Are you sure you want to reset everything? This cannot be undone."
    )) {
      localStorage.removeItem("bestofme-storage");
      router.push("/onboarding");
      window.location.reload();
    }
  };

  const stats = [
    { icon: <CheckCircle size={20} color="var(--green)" />, label: tt("total_completed"), value: user.totalTasksCompleted },
    { icon: <Flame size={20} color="var(--red)" />, label: tt("longest_streak"), value: `${user.longestStreak} ${tt("days")}` },
    { icon: <Coins size={20} color="var(--gold)" />, label: tt("bom_coins"), value: user.bomCoins.toLocaleString() },
    { icon: <CalendarDays size={20} color="var(--primary-light)" />, label: lang === "nl" ? "Huidige streak" : "Current streak", value: `${user.currentStreak} ${tt("days")}` },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 90 }}>

      {/* Header */}
      <div className="safe-top" style={{ padding: "0 20px", background: "var(--bg)" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 4, paddingBottom: 14, borderBottom: "1px solid var(--border)",
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>{tt("settings")}</h1>
          <BomLogo size={32} />
        </div>
      </div>

      <div style={{ padding: "20px" }}>

        {/* ── Profile card ── */}
        <div style={{
          padding: "20px", borderRadius: 20,
          background: "var(--card)", border: "1px solid var(--border)",
          marginBottom: 20,
        }}>
          <p style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>{user.name}</p>
          <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 16 }}>
            {lang === "nl" ? "Lid sinds" : "Member since"}{" "}
            {new Date(user.createdAt).toLocaleDateString(lang === "nl" ? "nl-BE" : "en-GB")}
          </p>
          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {stats.map(({ icon, label, value }) => (
              <div key={label} style={{
                padding: "12px 14px", borderRadius: 14,
                background: "var(--surface)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                {icon}
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800 }}>{value}</p>
                  <p style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 1 }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Theme toggle ── */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {lang === "nl" ? "Thema" : "Theme"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {(["dark", "light"] as const).map((t) => {
              const active = theme === t || (!theme && t === "dark");
              return (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  style={{
                    padding: "16px 14px",
                    borderRadius: 18,
                    border: `2px solid ${active ? "var(--primary)" : "var(--border)"}`,
                    background: active ? `rgba(${t === "dark" ? "99,102,241" : "22,163,74"},0.1)` : "var(--card)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                    cursor: "pointer",
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: t === "dark" ? "#070B14" : "#F0FDF4",
                    border: `2px solid ${t === "dark" ? "#1E2D45" : "#D1FAE5"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {t === "dark"
                      ? <Moon size={20} color="#818CF8" />
                      : <Sun size={20} color="#16A34A" />}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: active ? "var(--primary-light)" : "var(--text)" }}>
                      {t === "dark" ? (lang === "nl" ? "Donker" : "Dark") : (lang === "nl" ? "Licht" : "Light")}
                    </p>
                    <p style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2 }}>
                      {t === "dark"
                        ? (lang === "nl" ? "Indigo & donkerblauw" : "Indigo & dark blue")
                        : (lang === "nl" ? "Wit & groen" : "White & green")}
                    </p>
                  </div>
                  {active && (
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: "var(--primary-light)",
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Language ── */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {tt("choose_language")}
          </h3>
          <div style={{ display: "flex", gap: 10 }}>
            {(["nl", "en"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => updateUser({ language: l })}
                style={{
                  flex: 1, padding: "14px",
                  borderRadius: 16,
                  border: `2px solid ${user.language === l ? "var(--primary)" : "var(--border)"}`,
                  background: user.language === l ? "rgba(99,102,241,0.1)" : "var(--card)",
                  color: user.language === l ? "var(--primary-light)" : "var(--text-dim)",
                  fontSize: 15, fontWeight: 700,
                }}
              >
                {l === "nl" ? "🇧🇪 Nederlands" : "🇬🇧 English"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Goals ── */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {tt("goals")}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {user.goals.map((g) => (
              <span key={g} className="chip chip-primary">
                {tt(`goal_${g}` as Parameters<typeof tt>[0])}
              </span>
            ))}
          </div>
        </div>

        {/* ── Danger zone ── */}
        <div>
          <h3 style={{ fontSize: 13, color: "var(--red)", marginBottom: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {lang === "nl" ? "Gevaarzone" : "Danger zone"}
          </h3>
          <button
            onClick={handleReset}
            style={{
              width: "100%", padding: "14px",
              borderRadius: 16,
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "var(--red)",
              fontSize: 15, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Trash2 size={16} />
            {lang === "nl" ? "Alles resetten" : "Reset everything"}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
