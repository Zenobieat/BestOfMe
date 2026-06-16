"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { Task, RecurrenceType, Priority, GoalCategory } from "@/lib/types";
import { format } from "date-fns";
import { Plus, Trash2, Repeat, Clock, ChevronRight } from "lucide-react";

const GOAL_ICONS: Record<GoalCategory, string> = {
  fitness: "💪", money: "💰", consistency: "🔥",
  school: "📚", mindset: "🧠", relationships: "❤️",
  creativity: "🎨", health: "🌿",
};

// Goal labels without emojis for chips
const GOAL_COLORS: Record<GoalCategory, string> = {
  fitness: "#EF4444", money: "#F59E0B", consistency: "#6366F1",
  school: "#3B82F6", mindset: "#8B5CF6", relationships: "#EC4899",
  creativity: "#F97316", health: "#10B981",
};

// Simplified: removed biweekly and monthly from UI
const RECURRENCE_OPTIONS: RecurrenceType[] = [
  "daily", "weekdays", "weekends", "weekly", "custom", "none",
];

const WEEK_DAYS_NL = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
const WEEK_DAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface FormData {
  title: string;
  description: string;
  priority: Priority;
  category: GoalCategory;
  recurrenceType: RecurrenceType;
  customDays: number[];
  startDate: string;
  endDate: string;
  estimatedMinutes: string;
}

const freshForm = (): FormData => ({
  title: "", description: "",
  priority: "medium", category: "consistency",
  recurrenceType: "daily", customDays: [1, 2, 3, 4, 5],
  startDate: format(new Date(), "yyyy-MM-dd"),
  endDate: "", estimatedMinutes: "",
});

export default function TasksPage() {
  const user = useStore((s) => s.user);
  const tasks = useStore((s) => s.tasks);
  const addTask = useStore((s) => s.addTask);
  const deleteTask = useStore((s) => s.deleteTask);

  const lang = user?.language ?? "nl";
  const tt = useT(lang);
  const weekDays = lang === "nl" ? WEEK_DAYS_NL : WEEK_DAYS_EN;

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(freshForm());
  const [delConfirm, setDelConfirm] = useState<string | null>(null);

  const set = (k: keyof FormData, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const toggleDay = (d: number) =>
    set("customDays", form.customDays.includes(d)
      ? form.customDays.filter((x) => x !== d)
      : [...form.customDays, d]
    );

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    addTask({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      category: form.category,
      recurrence: {
        type: form.recurrenceType,
        customDays: form.recurrenceType === "custom" ? form.customDays : undefined,
      },
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      estimatedMinutes: form.estimatedMinutes ? parseInt(form.estimatedMinutes) : undefined,
    });
    setForm(freshForm());
    setShowForm(false);
  };

  const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
    none: lang === "nl" ? "Eenmalig" : "One-time",
    daily: lang === "nl" ? "Dagelijks" : "Daily",
    weekdays: lang === "nl" ? "Weekdagen" : "Weekdays",
    weekends: lang === "nl" ? "Weekend" : "Weekends",
    weekly: lang === "nl" ? "Wekelijks" : "Weekly",
    biweekly: lang === "nl" ? "Om de 2 weken" : "Biweekly",
    monthly: lang === "nl" ? "Maandelijks" : "Monthly",
    custom: lang === "nl" ? "Specifieke dagen" : "Specific days",
  };

  const CATEGORIES: GoalCategory[] = ["fitness","money","consistency","school","mindset","relationships","creativity","health"];
  const PRIORITIES: Priority[] = ["low", "medium", "high"];
  const PRIORITY_COLORS: Record<Priority, string> = { low: "var(--green)", medium: "var(--gold)", high: "var(--red)" };

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 90 }}>
      <div className="safe-top" style={{ padding: "0 20px", background: "var(--bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>{tt("tasks")}</h1>
          <button
            onClick={() => { setShowForm(true); setForm(freshForm()); }}
            className="btn-primary"
            style={{ padding: "10px 18px", fontSize: 14 }}
          >
            <Plus size={16} /> {tt("add_task")}
          </button>
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {tasks.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <Repeat size={48} color="var(--border)" style={{ margin: "0 auto 20px" }} />
            <p style={{ fontSize: 16, color: "var(--text-dim)", marginBottom: 6 }}>
              {lang === "nl" ? "Nog geen taken" : "No tasks yet"}
            </p>
            <p style={{ fontSize: 14, color: "var(--text-faint)" }}>
              {lang === "nl" ? "Voeg je eerste taak toe of vraag de AI Coach!" : "Add your first task or ask the AI Coach!"}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tasks.map((task) => {
              const pc = PRIORITY_COLORS[task.priority];
              return (
                <div key={task.id} className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 3, height: 44, borderRadius: 2, background: pc, flexShrink: 0 }} />
                  <div style={{ fontSize: 20, flexShrink: 0 }}>{GOAL_ICONS[task.category]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 4 }}>
                      {task.title}
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span className="chip chip-primary" style={{ fontSize: 11 }}>
                        <Repeat size={9} /> {RECURRENCE_LABELS[task.recurrence.type]}
                      </span>
                      {task.estimatedMinutes && (
                        <span className="chip" style={{ fontSize: 11, background: "rgba(255,255,255,0.04)", borderColor: "var(--border)", color: "var(--text-dim)" }}>
                          <Clock size={9} /> {task.estimatedMinutes} min
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (delConfirm === task.id) { deleteTask(task.id); setDelConfirm(null); }
                      else { setDelConfirm(task.id); setTimeout(() => setDelConfirm(null), 2500); }
                    }}
                    style={{
                      background: delConfirm === task.id ? "rgba(239,68,68,0.15)" : "none",
                      border: "none", color: delConfirm === task.id ? "var(--red)" : "var(--text-faint)",
                      borderRadius: 10, padding: 8, flexShrink: 0,
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Sheet */}
      {showForm && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end" }}
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div
            className="fade-up"
            style={{
              width: "100%", maxHeight: "92dvh",
              background: "var(--surface)", borderRadius: "24px 24px 0 0",
              padding: "0 20px 40px", overflowY: "auto",
              border: "1px solid var(--border)", borderBottom: "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 20px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>{tt("add_task")}</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
                  {tt("title")} *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder={lang === "nl" ? "Bijv. 30 min sporten..." : "E.g. 30 min workout..."}
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              {/* Priority */}
              <div>
                <label style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
                  {lang === "nl" ? "Prioriteit" : "Priority"}
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      onClick={() => set("priority", p)}
                      style={{
                        flex: 1, padding: "11px 8px", borderRadius: 12,
                        border: `2px solid ${form.priority === p ? PRIORITY_COLORS[p] : "var(--border)"}`,
                        background: form.priority === p ? `${PRIORITY_COLORS[p]}18` : "transparent",
                        color: form.priority === p ? PRIORITY_COLORS[p] : "var(--text-dim)",
                        fontSize: 13, fontWeight: 700,
                      }}
                    >
                      {tt(`priority_${p}` as Parameters<typeof tt>[0])}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
                  {tt("category")}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => set("category", c)}
                      style={{
                        padding: "10px 6px", borderRadius: 12,
                        border: `2px solid ${form.category === c ? GOAL_COLORS[c] : "var(--border)"}`,
                        background: form.category === c ? `${GOAL_COLORS[c]}18` : "transparent",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{GOAL_ICONS[c]}</span>
                      <span style={{ fontSize: 9, color: form.category === c ? GOAL_COLORS[c] : "var(--text-dim)", fontWeight: 600 }}>
                        {tt(`goal_${c}` as Parameters<typeof tt>[0]).split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recurrence */}
              <div>
                <label style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
                  {lang === "nl" ? "Herhaling" : "Recurrence"}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {RECURRENCE_OPTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => set("recurrenceType", r)}
                      style={{
                        padding: "8px 13px", borderRadius: 20,
                        border: `2px solid ${form.recurrenceType === r ? "var(--primary)" : "var(--border)"}`,
                        background: form.recurrenceType === r ? "rgba(99,102,241,0.15)" : "transparent",
                        color: form.recurrenceType === r ? "var(--primary-light)" : "var(--text-dim)",
                        fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                      }}
                    >
                      {RECURRENCE_LABELS[r]}
                    </button>
                  ))}
                </div>
                {form.recurrenceType === "custom" && (
                  <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                    {weekDays.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => toggleDay(i)}
                        style={{
                          flex: 1, aspectRatio: "1", borderRadius: 10,
                          border: `2px solid ${form.customDays.includes(i) ? "var(--primary)" : "var(--border)"}`,
                          background: form.customDays.includes(i) ? "rgba(99,102,241,0.2)" : "transparent",
                          color: form.customDays.includes(i) ? "var(--primary-light)" : "var(--text-dim)",
                          fontSize: 12, fontWeight: 700,
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dates + Time */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
                    {tt("start_date")}
                  </label>
                  <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} style={{ colorScheme: "dark" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
                    {tt("estimated_time")}
                  </label>
                  <input type="number" value={form.estimatedMinutes} onChange={(e) => set("estimatedMinutes", e.target.value)} placeholder="30 min" min="1" max="480" />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
                <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ flex: 0.4 }}>
                  {tt("cancel")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!form.title.trim()}
                  className="btn-primary"
                  style={{ flex: 1, opacity: form.title.trim() ? 1 : 0.4 }}
                >
                  {tt("save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
