"use client";

import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { Mascot } from "@/components/Mascot";
import { BomLogo } from "@/components/BomLogo";
import { getTasksForDate, getDayCompletionRate } from "@/lib/tasks";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const tasks = useStore((s) => s.tasks);
  const completions = useStore((s) => s.completions);
  const pets = useStore((s) => s.pets);
  const completeTask = useStore((s) => s.completeTask);
  const uncompleteTask = useStore((s) => s.uncompleteTask);
  const isTaskCompleted = useStore((s) => s.isTaskCompleted);

  const lang = user?.language ?? "nl";
  const tt = useT(lang);
  const today = format(new Date(), "yyyy-MM-dd");
  const todayFormatted = format(new Date(), "EEEE d MMMM", {
    locale: lang === "nl" ? nl : enUS,
  });

  const todayTasks = getTasksForDate(tasks, today);
  const completionRate = getDayCompletionRate(tasks, completions, today);
  const activePet = pets.find((p) => p.id === user?.activePetId);

  if (!user) {
    router.replace("/onboarding");
    return null;
  }

  const mascotMood =
    completionRate === 100 ? "proud" :
    completionRate >= 50 ? "happy" :
    user.currentStreak > 3 ? "excited" : "neutral";

  const mascotMessage =
    completionRate === 100
      ? `${tt("well_done")} ${user.name}! 🎉`
      : user.currentStreak > 0
      ? tt("mascot_streak", { n: user.currentStreak })
      : tt("mascot_greeting", { name: user.name });

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bom-bg)", paddingBottom: 90 }}>
      {/* Header */}
      <div
        className="safe-top"
        style={{
          background: "linear-gradient(180deg, #1A0A2E 0%, var(--bom-bg) 100%)",
          padding: "16px 20px 20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BomLogo size={36} />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Coins */}
            <Link href="/pets" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 20,
                padding: "6px 14px",
              }}>
                <span style={{ fontSize: 16 }}>🪙</span>
                <span style={{ fontWeight: 700, color: "#F59E0B", fontSize: 15 }}>
                  {user.bomCoins}
                </span>
              </div>
            </Link>
            {/* Streak */}
            {user.currentStreak > 0 && (
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 20,
                padding: "6px 12px",
              }}>
                <span style={{ fontSize: 16 }}>🔥</span>
                <span style={{ fontWeight: 700, color: "#EF4444", fontSize: 14 }}>
                  {user.currentStreak}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mascot + greeting */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 20,
          padding: "16px",
          borderRadius: 20,
          background: "rgba(124,58,237,0.08)",
          border: "1px solid rgba(124,58,237,0.15)",
        }}>
          <Mascot mood={mascotMood} size={70} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, lineHeight: 1.4 }}>
              {mascotMessage}
            </p>
            <p style={{ fontSize: 13, color: "var(--bom-muted)" }}>
              {tt("mascot_motivate")}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Date + progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 13, color: "var(--bom-muted)", textTransform: "capitalize" }}>
                {todayFormatted}
              </p>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
                {tt("today")}
              </h2>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 24, fontWeight: 800, color: "var(--bom-purple-light)" }}>
                {completionRate}%
              </p>
              <p style={{ fontSize: 12, color: "var(--bom-muted)" }}>
                {todayTasks.filter((t) => isTaskCompleted(t.id, today)).length}/{todayTasks.length} {lang === "nl" ? "taken" : "tasks"}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 8, background: "var(--bom-border)", borderRadius: 4, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${completionRate}%`,
                background: "linear-gradient(90deg, #7C3AED, #A78BFA)",
                borderRadius: 4,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        {/* Active pet card */}
        {activePet && (
          <Link href="/pets" style={{ textDecoration: "none" }}>
            <div style={{
              marginBottom: 20,
              padding: "14px 16px",
              borderRadius: 16,
              background: "var(--bom-surface)",
              border: "1px solid var(--bom-border)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}>
              <div style={{ fontSize: 36, position: "relative" }}>
                {activePet.emoji}
                {activePet.equippedAccessories.length > 0 && (
                  <span style={{ position: "absolute", top: -6, right: -6, fontSize: 16 }}>
                    ✨
                  </span>
                )}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{activePet.name}</p>
                <p style={{ fontSize: 12, color: "var(--bom-muted)" }}>
                  Lvl {activePet.level} · {activePet.xp} XP
                </p>
              </div>
              <div style={{ marginLeft: "auto", color: "var(--bom-muted)", fontSize: 20 }}>›</div>
            </div>
          </Link>
        )}

        {/* Today's tasks */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            {lang === "nl" ? "Taken van vandaag" : "Today's tasks"}
          </h3>
          <Link href="/tasks" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 13, color: "var(--bom-purple-light)" }}>
              + {tt("add_task")}
            </span>
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "var(--bom-muted)",
            background: "var(--bom-surface)",
            borderRadius: 20,
            border: "1px dashed var(--bom-border)",
          }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📋</p>
            <p style={{ fontSize: 15 }}>{tt("no_tasks_today")}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {todayTasks.map((task) => {
              const done = isTaskCompleted(task.id, today);
              const priorityColor =
                task.priority === "high" ? "#EF4444" :
                task.priority === "medium" ? "#F59E0B" : "#10B981";

              return (
                <div
                  key={task.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderRadius: 16,
                    background: done
                      ? "rgba(16,185,129,0.08)"
                      : "var(--bom-surface)",
                    border: "1px solid",
                    borderColor: done ? "rgba(16,185,129,0.2)" : "var(--bom-border)",
                    transition: "all 0.2s",
                    opacity: done ? 0.7 : 1,
                  }}
                  onClick={() =>
                    done
                      ? uncompleteTask(task.id, today)
                      : completeTask(task.id, today)
                  }
                >
                  {/* Priority indicator */}
                  <div style={{
                    width: 4, height: 40, borderRadius: 2,
                    background: priorityColor, flexShrink: 0,
                  }} />

                  {/* Checkbox */}
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    border: `2px solid ${done ? "#10B981" : "var(--bom-border)"}`,
                    background: done ? "#10B981" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", flexShrink: 0,
                  }}>
                    {done && <span style={{ fontSize: 13, color: "white", fontWeight: "bold" }}>✓</span>}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontWeight: 600, fontSize: 15,
                      textDecoration: done ? "line-through" : "none",
                      color: done ? "var(--bom-muted)" : "var(--bom-text)",
                      marginBottom: 2,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {task.title}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--bom-muted)" }}>
                      {task.estimatedMinutes ? `${task.estimatedMinutes} min · ` : ""}
                      {task.priority === "high" ? (lang === "nl" ? "Hoog" : "High") :
                       task.priority === "medium" ? (lang === "nl" ? "Gemiddeld" : "Medium") :
                       (lang === "nl" ? "Laag" : "Low")}
                    </p>
                  </div>

                  {/* Coins indicator */}
                  <div style={{
                    fontSize: 12, color: "#F59E0B",
                    background: "rgba(245,158,11,0.1)",
                    borderRadius: 8, padding: "4px 8px",
                    fontWeight: 700, flexShrink: 0,
                  }}>
                    +{task.priority === "high" ? 20 : task.priority === "medium" ? 10 : 5}🪙
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginTop: 24,
        }}>
          {[
            { label: tt("streak"), value: user.currentStreak, unit: tt("days"), icon: "🔥" },
            { label: tt("total_completed"), value: user.totalTasksCompleted, unit: "", icon: "✅" },
            { label: tt("bom_coins"), value: user.bomCoins, unit: "", icon: "🪙" },
          ].map(({ label, value, unit, icon }) => (
            <div
              key={label}
              style={{
                padding: "14px 12px",
                borderRadius: 16,
                background: "var(--bom-surface)",
                border: "1px solid var(--bom-border)",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 22, marginBottom: 4 }}>{icon}</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: "var(--bom-purple-light)" }}>
                {value}
                <span style={{ fontSize: 11, color: "var(--bom-muted)", fontWeight: 400, marginLeft: 2 }}>
                  {unit}
                </span>
              </p>
              <p style={{ fontSize: 11, color: "var(--bom-muted)", marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
