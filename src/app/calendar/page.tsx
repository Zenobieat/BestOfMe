"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { getTasksForDate, getDayCompletionRate } from "@/lib/tasks";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  addMonths, subMonths, isSameDay, isToday, parseISO,
} from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CheckCircle, X, Plus, CalendarDays } from "lucide-react";
import Link from "next/link";

const PRIORITY_COLOR: Record<string, string> = {
  high: "var(--red)", medium: "var(--gold)", low: "var(--green)",
};

export default function CalendarPage() {
  const user = useStore((s) => s.user);
  const tasks = useStore((s) => s.tasks);
  const completions = useStore((s) => s.completions);
  const skips = useStore((s) => s.skips);
  const completeTask = useStore((s) => s.completeTask);
  const uncompleteTask = useStore((s) => s.uncompleteTask);
  const isTaskCompleted = useStore((s) => s.isTaskCompleted);
  const skipTask = useStore((s) => s.skipTask);
  const isTaskSkipped = useStore((s) => s.isTaskSkipped);

  const lang = user?.language ?? "nl";
  const tt = useT(lang);
  const locale = lang === "nl" ? nl : enUS;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Monday-first offset
  const startOffset = (monthStart.getDay() + 6) % 7;
  const calendarCells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...days,
  ];

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const allSelectedTasks = getTasksForDate(tasks, selectedDateStr);
  // Exclude skipped for today's count but still show them (greyed out)
  const selectedTasks = allSelectedTasks;

  const WEEK_LABELS = lang === "nl"
    ? ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"]
    : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const goToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 90 }}>

      {/* ── Top bar ────────────────────────────────────────── */}
      <div className="safe-top" style={{ padding: "0 20px", background: "var(--bg)" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 4, paddingBottom: 14,
          borderBottom: "1px solid var(--border)",
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>{tt("calendar")}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={goToday}
              style={{
                padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                color: "var(--primary-light)",
              }}
            >
              {lang === "nl" ? "Vandaag" : "Today"}
            </button>
            <Link href="/tasks">
              <button className="btn-primary" style={{ padding: "7px 14px", fontSize: 12 }}>
                <Plus size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Month navigation ─────────────────────────────── */}
      <div style={{ padding: "14px 20px 0", background: "var(--bg)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            style={{
              width: 38, height: 38, borderRadius: 12,
              background: "var(--card)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)",
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <h2 style={{ fontSize: 17, fontWeight: 800, textTransform: "capitalize" }}>
            {format(currentMonth, "MMMM yyyy", { locale })}
          </h2>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            style={{
              width: 38, height: 38, borderRadius: 12,
              background: "var(--card)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)",
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day-of-week labels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
          {WEEK_LABELS.map((d) => (
            <div key={d} style={{
              textAlign: "center", fontSize: 11, fontWeight: 700,
              color: "var(--text-faint)", padding: "4px 0", textTransform: "uppercase", letterSpacing: "0.04em",
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 4 }}>
          {calendarCells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} />;
            const dateStr = format(day, "yyyy-MM-dd");
            const dayTasks = getTasksForDate(tasks, dateStr);
            const rate = getDayCompletionRate(tasks, completions, dateStr);
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDay = isToday(day);
            const hasTasks = dayTasks.length > 0;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(day)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 10,
                  border: isSelected
                    ? "2px solid var(--primary)"
                    : isTodayDay
                    ? "2px solid rgba(99,102,241,0.4)"
                    : "2px solid transparent",
                  background: isSelected
                    ? "var(--primary)"
                    : isTodayDay
                    ? "rgba(99,102,241,0.1)"
                    : "transparent",
                  color: isSelected ? "white" : isTodayDay ? "var(--primary-light)" : "var(--text)",
                  fontWeight: isSelected || isTodayDay ? 700 : 400,
                  fontSize: 14,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 2, cursor: "pointer",
                  transition: "all 0.12s",
                  position: "relative",
                }}
              >
                {day.getDate()}
                {hasTasks && (
                  <div style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: isSelected
                      ? "rgba(255,255,255,0.7)"
                      : rate === 100
                      ? "var(--green)"
                      : rate > 0
                      ? "var(--gold)"
                      : "var(--primary-light)",
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", padding: "10px 0 8px" }}>
          {[
            { color: "var(--green)", label: lang === "nl" ? "Alles klaar" : "All done" },
            { color: "var(--gold)", label: lang === "nl" ? "Bezig" : "In progress" },
            { color: "var(--primary-light)", label: lang === "nl" ? "Gepland" : "Planned" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "var(--text-faint)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", margin: "0 20px" }} />

      {/* ── Selected day tasks ────────────────────────────── */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, textTransform: "capitalize", marginBottom: 2 }}>
              {format(selectedDate, "EEEE d MMMM", { locale })}
            </h3>
            {selectedTasks.length > 0 && (
              <p style={{ fontSize: 12, color: "var(--text-faint)" }}>
                {selectedTasks.filter((t) => isTaskCompleted(t.id, selectedDateStr)).length}/
                {selectedTasks.filter((t) => !isTaskSkipped(t.id, selectedDateStr)).length}{" "}
                {lang === "nl" ? "voltooid" : "completed"}
              </p>
            )}
          </div>
          <Link href="/tasks">
            <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: 13, gap: 6 }}>
              <Plus size={14} /> {tt("add_task")}
            </button>
          </Link>
        </div>

        {selectedTasks.length === 0 ? (
          <div style={{
            padding: "44px 20px", textAlign: "center",
            background: "var(--card)", borderRadius: 20,
            border: "1px dashed var(--border)",
          }}>
            <CalendarDays size={36} color="var(--border)" style={{ margin: "0 auto 12px" }} />
            <p style={{ color: "var(--text-dim)", fontSize: 15, marginBottom: 6 }}>
              {tt("no_tasks_today")}
            </p>
            <Link href="/tasks">
              <button className="btn-primary" style={{ marginTop: 12, padding: "10px 20px" }}>
                <Plus size={16} /> {tt("add_task")}
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selectedTasks.map((task) => {
              const done = isTaskCompleted(task.id, selectedDateStr);
              const skipped = isTaskSkipped(task.id, selectedDateStr);
              return (
                <div
                  key={task.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "13px 14px", borderRadius: 16,
                    background: skipped
                      ? "rgba(255,255,255,0.02)"
                      : done
                      ? "rgba(16,185,129,0.06)"
                      : "var(--card)",
                    border: "1px solid",
                    borderColor: skipped
                      ? "var(--border)"
                      : done
                      ? "rgba(16,185,129,0.2)"
                      : "var(--border)",
                    opacity: skipped ? 0.45 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  {/* Priority stripe */}
                  <div style={{
                    width: 3, height: 34, borderRadius: 2, flexShrink: 0,
                    background: skipped ? "var(--border)" : PRIORITY_COLOR[task.priority],
                  }} />

                  {/* Checkbox — click to complete/uncomplete */}
                  <button
                    onClick={() => !skipped && (done ? uncompleteTask(task.id, selectedDateStr) : completeTask(task.id, selectedDateStr))}
                    disabled={skipped}
                    style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${done ? "var(--green)" : "var(--border-light)"}`,
                      background: done ? "var(--green)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: skipped ? "default" : "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {done && <CheckCircle size={13} color="white" strokeWidth={3} />}
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontWeight: 600, fontSize: 15,
                      textDecoration: done ? "line-through" : "none",
                      color: done || skipped ? "var(--text-dim)" : "var(--text)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {task.title}
                    </p>
                    {task.estimatedMinutes && !skipped && (
                      <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>
                        {task.estimatedMinutes} min
                      </p>
                    )}
                    {skipped && (
                      <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>
                        {lang === "nl" ? "Overgeslagen" : "Skipped"}
                      </p>
                    )}
                  </div>

                  {/* Coin reward badge */}
                  {!skipped && !done && (
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: "var(--gold)",
                      background: "rgba(245,158,11,0.1)",
                      borderRadius: 8, padding: "3px 7px", flexShrink: 0,
                    }}>
                      +{task.priority === "high" ? 20 : task.priority === "medium" ? 10 : 5}
                    </div>
                  )}

                  {/* Skip for this day */}
                  {!done && !skipped && (
                    <button
                      onClick={() => skipTask(task.id, selectedDateStr)}
                      style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--text-faint)", cursor: "pointer",
                      }}
                      title={lang === "nl" ? "Sla over voor vandaag" : "Skip for today"}
                    >
                      <X size={13} />
                    </button>
                  )}
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
