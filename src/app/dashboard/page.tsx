"use client";

import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { BomLogo } from "@/components/BomLogo";
import { BuddyAvatar } from "@/components/BuddyAvatar";
import { getTasksForDate, getDayCompletionRate } from "@/lib/tasks";
import { GoalCategory } from "@/lib/types";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Coins, CheckCircle, Plus, TrendingUp } from "lucide-react";

const PRIORITY_COLOR: Record<string, string> = {
  high: "#EF4444", medium: "#F59E0B", low: "#10B981",
};

const CATEGORY_CONFIG: Record<GoalCategory, { emoji: string; color: string; bg: string }> = {
  fitness:       { emoji: "💪", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  money:         { emoji: "💰", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  consistency:   { emoji: "🔥", color: "#6366F1", bg: "rgba(99,102,241,0.12)" },
  school:        { emoji: "📚", color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
  mindset:       { emoji: "🧠", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
  relationships: { emoji: "❤️", color: "#EC4899", bg: "rgba(236,72,153,0.12)" },
  creativity:    { emoji: "🎨", color: "#F97316", bg: "rgba(249,115,22,0.12)" },
  health:        { emoji: "🌿", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
};

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
  const todayFormatted = format(new Date(), "EEEE d MMMM", { locale: lang === "nl" ? nl : enUS });

  if (!user) { router.replace("/onboarding"); return null; }

  const todayTasks = getTasksForDate(tasks, today);
  const completionRate = getDayCompletionRate(tasks, completions, today);
  const doneCount = todayTasks.filter((t) => isTaskCompleted(t.id, today)).length;
  const activePet = pets.find((p) => p.id === user.activePetId);

  const sortedTasks = [...todayTasks].sort((a, b) => {
    const da = isTaskCompleted(a.id, today) ? 1 : 0;
    const db = isTaskCompleted(b.id, today) ? 1 : 0;
    return da - db;
  });

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 90 }}>

      {/* ── Top bar ── */}
      <div className="safe-top" style={{ padding: "0 20px", background: "var(--bg)" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 4, paddingBottom: 14, borderBottom: "1px solid var(--border)",
        }}>
          <BomLogo size={34} />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {user.currentStreak > 0 && (
              <div className="chip chip-red" style={{ gap: 5 }}>
                <Flame size={12} /> {user.currentStreak}d
              </div>
            )}
            <Link href="/pets">
              <div className="chip chip-gold" style={{ gap: 5 }}>
                <Coins size={12} /> {user.bomCoins.toLocaleString()}
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>

        {/* ── Header: date + pet + progress ── */}
        <div style={{ marginTop: 18, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 12, color: "var(--text-dim)", textTransform: "capitalize", marginBottom: 4 }}>
                {todayFormatted}
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.1 }}>
                {lang === "nl" ? `Hey ${user.name}` : `Hey ${user.name}`}
              </h2>
              {todayTasks.length > 0 && (
                <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4 }}>
                  {doneCount === todayTasks.length && todayTasks.length > 0
                    ? (lang === "nl" ? "Alles klaar! 🎉" : "All done! 🎉")
                    : `${doneCount}/${todayTasks.length} ${lang === "nl" ? "voltooid" : "done"}`}
                </p>
              )}
            </div>
            {activePet ? (
              <Link href="/pets">
                <BuddyAvatar species={activePet.species} size={64} />
              </Link>
            ) : (
              <Link href="/pets" style={{
                width: 60, height: 60, borderRadius: 16,
                background: "var(--card)", border: "1px dashed var(--border)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 4,
              }}>
                <Plus size={18} color="var(--text-faint)" />
                <span style={{ fontSize: 9, color: "var(--text-faint)" }}>
                  {lang === "nl" ? "Buddy" : "Buddy"}
                </span>
              </Link>
            )}
          </div>

          {/* Progress ring area */}
          {todayTasks.length > 0 && (
            <div style={{
              borderRadius: 20, padding: "14px 18px",
              background: "linear-gradient(135deg, var(--card) 0%, rgba(99,102,241,0.04) 100%)",
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              {/* Circle progress */}
              <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
                <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="26" cy="26" r="22" fill="none" stroke="var(--border)" strokeWidth="5" />
                  <circle
                    cx="26" cy="26" r="22" fill="none"
                    stroke="var(--primary-light)" strokeWidth="5"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - completionRate / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                  />
                </svg>
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: "var(--primary-light)",
                }}>
                  {completionRate}%
                </div>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                  {lang === "nl" ? "Dag voortgang" : "Day progress"}
                </p>
                <div className="progress-bar" style={{ width: 160 }}>
                  <div className="progress-fill" style={{ width: `${completionRate}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Section label ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>
            {lang === "nl" ? "Taken vandaag" : "Today's tasks"}
          </h3>
          <Link href="/tasks">
            <button style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              color: "var(--primary-light)",
            }}>
              <Plus size={12} /> {tt("add_task")}
            </button>
          </Link>
        </div>

        {/* ── Task list ── */}
        {todayTasks.length === 0 ? (
          <div style={{
            padding: "44px 20px", textAlign: "center",
            background: "var(--card)", borderRadius: 24,
            border: "1px dashed var(--border)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
            <p style={{ color: "var(--text-dim)", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              {tt("no_tasks_today")}
            </p>
            <p style={{ color: "var(--text-faint)", fontSize: 13, marginBottom: 18 }}>
              {lang === "nl" ? "Voeg een taak toe of vraag de AI Coach" : "Add a task or ask the AI Coach"}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Link href="/tasks">
                <button className="btn-primary" style={{ padding: "10px 18px", fontSize: 13 }}>
                  <Plus size={14} /> {tt("add_task")}
                </button>
              </Link>
              <Link href="/ai">
                <button className="btn-ghost" style={{ padding: "10px 18px", fontSize: 13 }}>
                  {lang === "nl" ? "AI Coach" : "AI Coach"}
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {sortedTasks.map((task) => {
              const done = isTaskCompleted(task.id, today);
              const coins = task.priority === "high" ? 20 : task.priority === "medium" ? 10 : 5;
              const cat = CATEGORY_CONFIG[task.category] ?? CATEGORY_CONFIG.consistency;
              const prioColor = PRIORITY_COLOR[task.priority];

              return (
                <div
                  key={task.id}
                  onClick={() => done ? uncompleteTask(task.id, today) : completeTask(task.id, today)}
                  style={{
                    borderRadius: 20,
                    background: done
                      ? "rgba(16,185,129,0.05)"
                      : "var(--card)",
                    border: "1px solid",
                    borderColor: done ? "rgba(16,185,129,0.18)" : "var(--border)",
                    cursor: "pointer",
                    transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
                    opacity: done ? 0.6 : 1,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Top accent line = priority color */}
                  <div style={{
                    height: 3,
                    background: done
                      ? "rgba(16,185,129,0.3)"
                      : `linear-gradient(90deg, ${prioColor}, ${prioColor}66)`,
                    transition: "background 0.3s",
                  }} />

                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Category icon bubble */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                      background: done ? "rgba(16,185,129,0.1)" : cat.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, transition: "all 0.2s",
                    }}>
                      {cat.emoji}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontWeight: 700, fontSize: 16, lineHeight: 1.2,
                        textDecoration: done ? "line-through" : "none",
                        color: done ? "var(--text-dim)" : "var(--text)",
                        marginBottom: 4,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {task.title}
                      </p>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: done ? "var(--text-faint)" : cat.color,
                        }}>
                          {lang === "nl"
                            ? (task.priority === "high" ? "Hoog" : task.priority === "medium" ? "Medium" : "Laag")
                            : task.priority}
                        </span>
                        {task.estimatedMinutes && (
                          <>
                            <span style={{ color: "var(--border-light)", fontSize: 10 }}>·</span>
                            <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                              {task.estimatedMinutes} min
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right side: coins + checkbox */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                      {!done && (
                        <div style={{
                          display: "flex", alignItems: "center", gap: 3,
                          fontSize: 12, fontWeight: 800, color: "#F59E0B",
                          background: "rgba(245,158,11,0.1)", borderRadius: 10,
                          padding: "3px 8px",
                        }}>
                          <Coins size={10} /> +{coins}
                        </div>
                      )}
                      {/* Big checkbox */}
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        border: `2.5px solid ${done ? "#10B981" : "var(--border-light)"}`,
                        background: done ? "#10B981" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.25s",
                        flexShrink: 0,
                      }}>
                        {done && <CheckCircle size={17} color="white" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Stats row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { icon: <Flame size={18} color="#EF4444" />, value: user.currentStreak, label: tt("streak"), sub: tt("days") },
            { icon: <CheckCircle size={18} color="#10B981" />, value: user.totalTasksCompleted, label: tt("total_completed"), sub: "" },
            { icon: <TrendingUp size={18} color="var(--primary-light)" />, value: user.longestStreak, label: tt("longest_streak"), sub: tt("days") },
          ].map(({ icon, value, label, sub }) => (
            <div key={label} className="card" style={{ padding: "14px 12px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>{icon}</div>
              <p style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{value}</p>
              {sub && <p style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2 }}>{sub}</p>}
              <p style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
