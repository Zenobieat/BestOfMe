"use client";

import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { BomLogo } from "@/components/BomLogo";
import { Pet3D } from "@/components/Pet3D";
import { getTasksForDate, getDayCompletionRate } from "@/lib/tasks";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Coins, CheckCircle, Plus, ChevronRight, TrendingUp } from "lucide-react";
import { PetSpecies } from "@/lib/types";

const PRIORITY_COLOR: Record<string, string> = {
  high: "var(--red)",
  medium: "var(--gold)",
  low: "var(--green)",
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

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 90 }}>
      {/* Top bar */}
      <div className="safe-top" style={{ padding: "0 20px 0", background: "var(--bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
          <BomLogo size={34} />
          <div style={{ display: "flex", gap: 10 }}>
            {user.currentStreak > 0 && (
              <div className="chip chip-red" style={{ gap: 5 }}>
                <Flame size={12} />
                {user.currentStreak} {lang === "nl" ? "d" : "d"}
              </div>
            )}
            <Link href="/pets">
              <div className="chip chip-gold" style={{ gap: 5 }}>
                <Coins size={12} />
                {user.bomCoins}
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Hero section */}
        <div style={{
          marginTop: 20, marginBottom: 20,
          padding: "24px",
          borderRadius: 24,
          background: "linear-gradient(135deg, #0F1520 0%, #141C2E 60%, #1A1040 100%)",
          border: "1px solid var(--border)",
          position: "relative", overflow: "hidden",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {/* Decorative */}
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 160, height: 160, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          }} />
          <div>
            <p style={{ fontSize: 13, color: "var(--text-dim)", textTransform: "capitalize", marginBottom: 4 }}>
              {todayFormatted}
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
              {lang === "nl" ? `Hey ${user.name}` : `Hey ${user.name}`}
            </h2>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 6 }}>
                {doneCount}/{todayTasks.length} {lang === "nl" ? "taken voltooid" : "tasks done"}
              </p>
              <div className="progress-bar" style={{ width: 180 }}>
                <div className="progress-fill" style={{ width: `${completionRate}%` }} />
              </div>
            </div>
            <p style={{ fontSize: 28, fontWeight: 900 }} className="gradient-text">{completionRate}%</p>
          </div>

          {/* Active pet 3D */}
          {activePet && (
            <Link href="/pets" style={{ flexShrink: 0 }}>
              <Pet3D species={activePet.species as PetSpecies} size={110} />
            </Link>
          )}
          {!activePet && (
            <Link href="/pets" style={{
              width: 90, height: 90,
              borderRadius: 20,
              background: "var(--surface)",
              border: "1px dashed var(--border)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 6, flexShrink: 0,
            }}>
              <Plus size={20} color="var(--text-faint)" />
              <span style={{ fontSize: 10, color: "var(--text-faint)" }}>
                {lang === "nl" ? "Dier" : "Pet"}
              </span>
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { icon: <Flame size={18} color="var(--red)" />, value: user.currentStreak, label: tt("streak"), sub: tt("days") },
            { icon: <CheckCircle size={18} color="var(--green)" />, value: user.totalTasksCompleted, label: tt("total_completed"), sub: "" },
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

        {/* Today's tasks */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>
            {lang === "nl" ? "Vandaag" : "Today"}
          </h3>
          <Link href="/tasks">
            <span style={{ fontSize: 13, color: "var(--primary-light)", display: "flex", alignItems: "center", gap: 4 }}>
              <Plus size={14} /> {tt("add_task")}
            </span>
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <div style={{
            padding: "48px 20px", textAlign: "center",
            background: "var(--card)", borderRadius: 20,
            border: "1px dashed var(--border)",
          }}>
            <CheckCircle size={40} color="var(--border)" style={{ margin: "0 auto 14px" }} />
            <p style={{ color: "var(--text-dim)", fontSize: 15, marginBottom: 6 }}>
              {tt("no_tasks_today")}
            </p>
            <Link href="/tasks">
              <button className="btn-primary" style={{ marginTop: 16, padding: "11px 22px" }}>
                <Plus size={16} />
                {tt("add_task")}
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {todayTasks.map((task) => {
              const done = isTaskCompleted(task.id, today);
              return (
                <div
                  key={task.id}
                  onClick={() => done ? uncompleteTask(task.id, today) : completeTask(task.id, today)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", borderRadius: 16,
                    background: done ? "rgba(16,185,129,0.06)" : "var(--card)",
                    border: "1px solid",
                    borderColor: done ? "rgba(16,185,129,0.2)" : "var(--border)",
                    cursor: "pointer", transition: "all 0.2s",
                    opacity: done ? 0.65 : 1,
                  }}
                >
                  {/* Priority stripe */}
                  <div style={{
                    width: 3, height: 36, borderRadius: 2, flexShrink: 0,
                    background: PRIORITY_COLOR[task.priority],
                  }} />
                  {/* Checkbox */}
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${done ? "var(--green)" : "var(--border-light)"}`,
                    background: done ? "var(--green)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.25s",
                  }}>
                    {done && <CheckCircle size={14} color="white" strokeWidth={3} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontWeight: 600, fontSize: 15,
                      textDecoration: done ? "line-through" : "none",
                      color: done ? "var(--text-dim)" : "var(--text)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {task.title}
                    </p>
                    {task.estimatedMinutes && (
                      <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2 }}>
                        {task.estimatedMinutes} min
                      </p>
                    )}
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: 700, color: "var(--gold)",
                    background: "rgba(245,158,11,0.1)",
                    borderRadius: 8, padding: "4px 8px", flexShrink: 0,
                  }}>
                    +{task.priority === "high" ? 20 : task.priority === "medium" ? 10 : 5}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
