"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { getTasksForDate, getDayCompletionRate } from "@/lib/tasks";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import { nl, enUS } from "date-fns/locale";

export default function CalendarPage() {
  const user = useStore((s) => s.user);
  const tasks = useStore((s) => s.tasks);
  const completions = useStore((s) => s.completions);
  const completeTask = useStore((s) => s.completeTask);
  const uncompleteTask = useStore((s) => s.uncompleteTask);
  const isTaskCompleted = useStore((s) => s.isTaskCompleted);

  const lang = user?.language ?? "nl";
  const tt = useT(lang);
  const locale = lang === "nl" ? nl : enUS;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fill calendar grid (start from Monday)
  const startWeekDay = (monthStart.getDay() + 6) % 7; // Mon=0
  const calendarDays: (Date | null)[] = [
    ...Array(startWeekDay).fill(null),
    ...days,
  ];

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const selectedTasks = getTasksForDate(tasks, selectedDateStr);

  const WEEK_LABELS =
    lang === "nl"
      ? ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"]
      : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bom-bg)", paddingBottom: 90 }}>
      {/* Header */}
      <div
        className="safe-top"
        style={{
          padding: "16px 20px",
          background: "linear-gradient(180deg, #1A0A2E 0%, var(--bom-bg) 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{tt("calendar")}</h1>
        </div>

        {/* Month navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            style={{ background: "none", border: "none", color: "var(--bom-text)", fontSize: 22, padding: 8 }}
          >
            ‹
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, textTransform: "capitalize" }}>
            {format(currentMonth, "MMMM yyyy", { locale })}
          </h2>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            style={{ background: "none", border: "none", color: "var(--bom-text)", fontSize: 22, padding: 8 }}
          >
            ›
          </button>
        </div>

        {/* Week day labels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {WEEK_LABELS.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "var(--bom-muted)", padding: "4px 0" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={idx} />;
            const dateStr = format(day, "yyyy-MM-dd");
            const rate = getDayCompletionRate(tasks, completions, dateStr);
            const dayTasks = getTasksForDate(tasks, dateStr);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(day)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 10,
                  border: "none",
                  background: isSelected
                    ? "var(--bom-purple)"
                    : isCurrentDay
                    ? "rgba(124,58,237,0.2)"
                    : "transparent",
                  color: isSelected ? "white" : isCurrentDay ? "var(--bom-purple-light)" : "var(--bom-text)",
                  fontWeight: isCurrentDay || isSelected ? 700 : 400,
                  fontSize: 14,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {day.getDate()}
                {dayTasks.length > 0 && (
                  <div style={{
                    width: 16, height: 3, borderRadius: 2,
                    background: rate === 100
                      ? "#10B981"
                      : rate > 0
                      ? "#F59E0B"
                      : "rgba(255,255,255,0.2)",
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day tasks */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, textTransform: "capitalize" }}>
            {format(selectedDate, "EEEE d MMMM", { locale })}
          </h3>
          <span style={{ fontSize: 13, color: "var(--bom-purple-light)", fontWeight: 600 }}>
            {selectedTasks.filter((t) => isTaskCompleted(t.id, selectedDateStr)).length}/{selectedTasks.length}
          </span>
        </div>

        {selectedTasks.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "32px 20px",
            color: "var(--bom-muted)", background: "var(--bom-surface)",
            borderRadius: 16, border: "1px dashed var(--bom-border)",
          }}>
            <p style={{ fontSize: 28, marginBottom: 8 }}>🗓️</p>
            <p>{tt("no_tasks_today")}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {selectedTasks.map((task) => {
              const done = isTaskCompleted(task.id, selectedDateStr);
              const priorityColor =
                task.priority === "high" ? "#EF4444" :
                task.priority === "medium" ? "#F59E0B" : "#10B981";
              return (
                <div
                  key={task.id}
                  onClick={() =>
                    done
                      ? uncompleteTask(task.id, selectedDateStr)
                      : completeTask(task.id, selectedDateStr)
                  }
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", borderRadius: 16,
                    background: done ? "rgba(16,185,129,0.08)" : "var(--bom-surface)",
                    border: "1px solid",
                    borderColor: done ? "rgba(16,185,129,0.2)" : "var(--bom-border)",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  <div style={{ width: 4, height: 36, borderRadius: 2, background: priorityColor, flexShrink: 0 }} />
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    border: `2px solid ${done ? "#10B981" : "var(--bom-border)"}`,
                    background: done ? "#10B981" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {done && <span style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>✓</span>}
                  </div>
                  <span style={{
                    flex: 1, fontSize: 15, fontWeight: 600,
                    textDecoration: done ? "line-through" : "none",
                    color: done ? "var(--bom-muted)" : "var(--bom-text)",
                  }}>
                    {task.title}
                  </span>
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
