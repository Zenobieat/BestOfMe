"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { getTasksForDate, getDayCompletionRate } from "@/lib/tasks";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  addMonths, subMonths, isSameDay, isToday,
} from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CheckCircle, X, Plus, CalendarDays, Coins } from "lucide-react";
import Link from "next/link";

const PRIORITY_COLOR: Record<string, string> = {
  high: "var(--red)", medium: "var(--gold)", low: "var(--green)",
};
const PRIORITY_LABEL_NL: Record<string, string> = { high: "Hoog", medium: "Gemiddeld", low: "Laag" };

export default function CalendarPage() {
  const user = useStore((s) => s.user);
  const tasks = useStore((s) => s.tasks);
  const completions = useStore((s) => s.completions);
  const completeTask = useStore((s) => s.completeTask);
  const uncompleteTask = useStore((s) => s.uncompleteTask);
  const isTaskCompleted = useStore((s) => s.isTaskCompleted);
  const skipTask = useStore((s) => s.skipTask);
  const isTaskSkipped = useStore((s) => s.isTaskSkipped);

  const lang = user?.language ?? "nl";
  const tt = useT(lang);
  const locale = lang === "nl" ? nl : enUS;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startOffset = (monthStart.getDay() + 6) % 7;
  const calendarCells: (Date | null)[] = [...Array(startOffset).fill(null), ...days];

  const WEEK_LABELS = lang === "nl"
    ? ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"]
    : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setSheetOpen(true);
  };

  const closeSheet = () => setSheetOpen(false);

  const selDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const selTasks = selectedDate ? getTasksForDate(tasks, selDateStr) : [];
  const selDone = selTasks.filter((t) => isTaskCompleted(t.id, selDateStr)).length;
  const selActive = selTasks.filter((t) => !isTaskSkipped(t.id, selDateStr));

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 90 }}>

      {/* ── Top bar ── */}
      <div className="safe-top" style={{ padding: "0 20px", background: "var(--bg)" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 4, paddingBottom: 14, borderBottom: "1px solid var(--border)",
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>{tt("calendar")}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => { setCurrentMonth(new Date()); handleDayClick(new Date()); }}
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

      {/* ── Month navigation ── */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: "var(--card)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)",
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 800, textTransform: "capitalize" }}>
            {format(currentMonth, "MMMM yyyy", { locale })}
          </h2>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: "var(--card)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)",
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day-of-week header */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 8 }}>
          {WEEK_LABELS.map((d) => (
            <div key={d} style={{
              textAlign: "center", fontSize: 11, fontWeight: 700,
              color: "var(--text-faint)", padding: "4px 0",
              textTransform: "uppercase", letterSpacing: "0.04em",
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {calendarCells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} />;
            const dateStr = format(day, "yyyy-MM-dd");
            const dayTasks = getTasksForDate(tasks, dateStr);
            const rate = getDayCompletionRate(tasks, completions, dateStr);
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            const isTodayDay = isToday(day);
            const hasTasks = dayTasks.length > 0;

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(day)}
                style={{
                  aspectRatio: "1", borderRadius: 12,
                  border: isSelected
                    ? "2px solid var(--primary)"
                    : isTodayDay
                    ? "2px solid rgba(99,102,241,0.45)"
                    : "2px solid transparent",
                  background: isSelected
                    ? "var(--primary)"
                    : isTodayDay
                    ? "rgba(99,102,241,0.1)"
                    : "var(--card)",
                  color: isSelected ? "white" : isTodayDay ? "var(--primary-light)" : "var(--text)",
                  fontWeight: isSelected || isTodayDay ? 700 : 500,
                  fontSize: 14, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 3, cursor: "pointer", transition: "all 0.12s",
                }}
              >
                {day.getDate()}
                {hasTasks && (
                  <div style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: isSelected
                      ? "rgba(255,255,255,0.75)"
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
        <div style={{ display: "flex", gap: 16, justifyContent: "center", padding: "12px 0 6px" }}>
          {[
            { color: "var(--green)", label: lang === "nl" ? "Klaar" : "Done" },
            { color: "var(--gold)", label: lang === "nl" ? "Bezig" : "Partial" },
            { color: "var(--primary-light)", label: lang === "nl" ? "Gepland" : "Planned" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "var(--text-faint)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Empty hint ── */}
      {!sheetOpen && (
        <div style={{ padding: "24px 20px", textAlign: "center" }}>
          <CalendarDays size={32} color="var(--border)" style={{ margin: "0 auto 10px" }} />
          <p style={{ color: "var(--text-faint)", fontSize: 14 }}>
            {lang === "nl" ? "Tik op een dag om taken te zien" : "Tap a day to see tasks"}
          </p>
        </div>
      )}

      {/* ── Bottom Sheet ── */}
      {sheetOpen && selectedDate && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "flex-end",
          }}
          onClick={closeSheet}
        >
          <div
            className="fade-up"
            style={{
              width: "100%", maxHeight: "72dvh",
              background: "var(--surface)",
              borderRadius: "24px 24px 0 0",
              overflowY: "auto",
              border: "1px solid var(--border)", borderBottom: "none",
              paddingBottom: "max(env(safe-area-inset-bottom), 24px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 4px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
            </div>

            {/* Sheet header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 20px 16px", borderBottom: "1px solid var(--border)",
            }}>
              <div>
                <p style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "capitalize", marginBottom: 2 }}>
                  {format(selectedDate, "EEEE", { locale })}
                </p>
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>
                  {format(selectedDate, "d MMMM", { locale })}
                  {selTasks.length > 0 && (
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dim)", marginLeft: 8 }}>
                      {selDone}/{selActive.length}
                    </span>
                  )}
                </h3>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Link href="/tasks" onClick={closeSheet}>
                  <button className="btn-primary" style={{ padding: "9px 16px", fontSize: 13, gap: 6 }}>
                    <Plus size={14} />
                    {lang === "nl" ? "Taak" : "Task"}
                  </button>
                </Link>
                <button
                  onClick={closeSheet}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "var(--card)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--text-dim)",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Tasks list */}
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {selTasks.length === 0 ? (
                <div style={{
                  padding: "40px 20px", textAlign: "center",
                  background: "var(--card)", borderRadius: 20,
                  border: "1px dashed var(--border)",
                }}>
                  <CalendarDays size={32} color="var(--border)" style={{ margin: "0 auto 12px" }} />
                  <p style={{ color: "var(--text-dim)", fontSize: 15, marginBottom: 6 }}>
                    {tt("no_tasks_today")}
                  </p>
                  <Link href="/tasks" onClick={closeSheet}>
                    <button className="btn-primary" style={{ marginTop: 12, padding: "10px 20px" }}>
                      <Plus size={16} /> {tt("add_task")}
                    </button>
                  </Link>
                </div>
              ) : (
                // Sort: undone + unskipped first
                [...selTasks].sort((a, b) => {
                  const da = isTaskSkipped(a.id, selDateStr) ? 2 : isTaskCompleted(a.id, selDateStr) ? 1 : 0;
                  const db = isTaskSkipped(b.id, selDateStr) ? 2 : isTaskCompleted(b.id, selDateStr) ? 1 : 0;
                  return da - db;
                }).map((task) => {
                  const done = isTaskCompleted(task.id, selDateStr);
                  const skipped = isTaskSkipped(task.id, selDateStr);
                  const coins = task.priority === "high" ? 20 : task.priority === "medium" ? 10 : 5;

                  return (
                    <div
                      key={task.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "14px 16px", borderRadius: 18,
                        background: skipped
                          ? "rgba(255,255,255,0.02)"
                          : done
                          ? "rgba(16,185,129,0.07)"
                          : "var(--card)",
                        border: "1px solid",
                        borderColor: done
                          ? "rgba(16,185,129,0.2)"
                          : skipped
                          ? "var(--border)"
                          : "var(--border)",
                        opacity: skipped ? 0.45 : 1,
                        transition: "all 0.2s",
                      }}
                    >
                      {/* Priority stripe */}
                      <div style={{
                        width: 4, minHeight: 44, borderRadius: 3, flexShrink: 0,
                        background: skipped ? "var(--border)" : PRIORITY_COLOR[task.priority],
                      }} />

                      {/* Checkbox */}
                      <button
                        onClick={() => !skipped && (done ? uncompleteTask(task.id, selDateStr) : completeTask(task.id, selDateStr))}
                        disabled={skipped}
                        style={{
                          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                          border: `2px solid ${done ? "var(--green)" : "var(--border-light)"}`,
                          background: done ? "var(--green)" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: skipped ? "default" : "pointer", transition: "all 0.2s",
                        }}
                      >
                        {done && <CheckCircle size={15} color="white" strokeWidth={3} />}
                      </button>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontWeight: 700, fontSize: 15,
                          textDecoration: done ? "line-through" : "none",
                          color: done || skipped ? "var(--text-dim)" : "var(--text)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {task.title}
                        </p>
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                          {task.estimatedMinutes && (
                            <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                              {task.estimatedMinutes} min
                            </span>
                          )}
                          {!skipped && !done && (
                            <span style={{ fontSize: 11, color: PRIORITY_COLOR[task.priority] }}>
                              {lang === "nl" ? PRIORITY_LABEL_NL[task.priority] : task.priority}
                            </span>
                          )}
                          {skipped && (
                            <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                              {lang === "nl" ? "Overgeslagen" : "Skipped"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Coins */}
                      {!skipped && !done && (
                        <div style={{
                          display: "flex", alignItems: "center", gap: 4,
                          fontSize: 12, fontWeight: 700, color: "var(--gold)",
                          background: "rgba(245,158,11,0.1)", borderRadius: 10,
                          padding: "4px 9px", flexShrink: 0,
                        }}>
                          <Coins size={11} /> +{coins}
                        </div>
                      )}

                      {/* Skip button */}
                      {!done && !skipped && (
                        <button
                          onClick={() => skipTask(task.id, selDateStr)}
                          style={{
                            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
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
                })
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
