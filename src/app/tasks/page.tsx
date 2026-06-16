"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { Task, RecurrenceType, Priority, GoalCategory } from "@/lib/types";
import { format } from "date-fns";
import { getTasksForDate } from "@/lib/tasks";

const GOAL_EMOJIS: Record<GoalCategory, string> = {
  fitness: "💪", money: "💰", consistency: "🔥",
  school: "📚", mindset: "🧠", relationships: "❤️",
  creativity: "🎨", health: "🌿",
};

const RECURRENCE_OPTIONS: RecurrenceType[] = [
  "none", "daily", "weekdays", "weekends", "weekly", "biweekly", "monthly", "custom",
];

const WEEK_DAYS_NL = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
const WEEK_DAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface TaskFormData {
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

const defaultForm = (): TaskFormData => ({
  title: "",
  description: "",
  priority: "medium",
  category: "consistency",
  recurrenceType: "daily",
  customDays: [1, 2, 3, 4, 5],
  startDate: format(new Date(), "yyyy-MM-dd"),
  endDate: "",
  estimatedMinutes: "",
});

export default function TasksPage() {
  const user = useStore((s) => s.user);
  const tasks = useStore((s) => s.tasks);
  const completions = useStore((s) => s.completions);
  const addTask = useStore((s) => s.addTask);
  const deleteTask = useStore((s) => s.deleteTask);

  const lang = user?.language ?? "nl";
  const tt = useT(lang);
  const weekDays = lang === "nl" ? WEEK_DAYS_NL : WEEK_DAYS_EN;

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TaskFormData>(defaultForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");
  const todayTasks = getTasksForDate(tasks, today);

  const updateForm = (k: keyof TaskFormData, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleCustomDay = (day: number) => {
    const days = form.customDays.includes(day)
      ? form.customDays.filter((d) => d !== day)
      : [...form.customDays, day];
    updateForm("customDays", days);
  };

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
    setForm(defaultForm());
    setShowForm(false);
  };

  const CATEGORIES: GoalCategory[] = [
    "fitness", "money", "consistency", "school", "mindset", "relationships", "creativity", "health",
  ];

  const recurrenceLabel = (type: RecurrenceType) => {
    const map: Record<RecurrenceType, string> = {
      none: tt("recurrence_none"),
      daily: tt("recurrence_daily"),
      weekdays: tt("recurrence_weekdays"),
      weekends: tt("recurrence_weekends"),
      weekly: tt("recurrence_weekly"),
      biweekly: tt("recurrence_biweekly"),
      monthly: tt("recurrence_monthly"),
      custom: tt("recurrence_custom"),
    };
    return map[type];
  };

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bom-bg)", paddingBottom: 90 }}>
      <div className="safe-top" style={{ padding: "16px 20px", background: "linear-gradient(180deg, #1A0A2E 0%, var(--bom-bg) 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{tt("tasks")}</h1>
          <button
            onClick={() => { setShowForm(true); setForm(defaultForm()); }}
            style={{
              padding: "10px 20px",
              borderRadius: 20,
              background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
              border: "none", color: "white",
              fontSize: 14, fontWeight: 700,
            }}
          >
            + {tt("add_task")}
          </button>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* All tasks list */}
        {tasks.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "var(--bom-muted)",
          }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📋</p>
            <p style={{ fontSize: 16, marginBottom: 8 }}>
              {lang === "nl" ? "Nog geen taken" : "No tasks yet"}
            </p>
            <p style={{ fontSize: 14 }}>
              {lang === "nl" ? "Voeg je eerste taak toe!" : "Add your first task!"}
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const priorityColor =
              task.priority === "high" ? "#EF4444" :
              task.priority === "medium" ? "#F59E0B" : "#10B981";
            return (
              <div
                key={task.id}
                style={{
                  padding: "14px 16px",
                  borderRadius: 16,
                  background: "var(--bom-surface)",
                  border: "1px solid var(--bom-border)",
                  marginBottom: 10,
                  display: "flex", alignItems: "center", gap: 14,
                }}
              >
                <div style={{ width: 4, height: 44, borderRadius: 2, background: priorityColor, flexShrink: 0 }} />
                <span style={{ fontSize: 22 }}>{GOAL_EMOJIS[task.category]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {task.title}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--bom-muted)" }}>
                    {recurrenceLabel(task.recurrence.type)}
                    {task.estimatedMinutes ? ` · ${task.estimatedMinutes} min` : ""}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (deleteConfirm === task.id) {
                      deleteTask(task.id);
                      setDeleteConfirm(null);
                    } else {
                      setDeleteConfirm(task.id);
                      setTimeout(() => setDeleteConfirm(null), 3000);
                    }
                  }}
                  style={{
                    background: deleteConfirm === task.id ? "rgba(239,68,68,0.2)" : "none",
                    border: "none",
                    color: deleteConfirm === task.id ? "#EF4444" : "var(--bom-muted)",
                    fontSize: 18,
                    padding: 6,
                    borderRadius: 8,
                  }}
                >
                  {deleteConfirm === task.id ? "✓" : "🗑"}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "flex-end",
          }}
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div
            className="slide-up"
            style={{
              width: "100%", maxHeight: "90dvh",
              background: "var(--bom-surface)",
              borderRadius: "24px 24px 0 0",
              padding: "0 20px 40px",
              overflowY: "auto",
              border: "1px solid var(--bom-border)",
              borderBottom: "none",
            }}
          >
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 20px" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--bom-border)" }} />
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>
              {tt("add_task")}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: 13, color: "var(--bom-muted)", marginBottom: 8, display: "block" }}>
                  {tt("title")} *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  placeholder={lang === "nl" ? "Bijv. 30 min sporten..." : "E.g. 30 min workout..."}
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 13, color: "var(--bom-muted)", marginBottom: 8, display: "block" }}>
                  {tt("description")}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder={lang === "nl" ? "Optionele beschrijving..." : "Optional description..."}
                  rows={2}
                  style={{ resize: "none" }}
                />
              </div>

              {/* Priority */}
              <div>
                <label style={{ fontSize: 13, color: "var(--bom-muted)", marginBottom: 8, display: "block" }}>
                  {lang === "nl" ? "Prioriteit" : "Priority"}
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {(["low", "medium", "high"] as Priority[]).map((p) => {
                    const color = p === "high" ? "#EF4444" : p === "medium" ? "#F59E0B" : "#10B981";
                    return (
                      <button
                        key={p}
                        onClick={() => updateForm("priority", p)}
                        style={{
                          flex: 1, padding: "10px",
                          borderRadius: 12,
                          border: `2px solid ${form.priority === p ? color : "var(--bom-border)"}`,
                          background: form.priority === p ? `${color}20` : "transparent",
                          color: form.priority === p ? color : "var(--bom-muted)",
                          fontSize: 13, fontWeight: 600,
                        }}
                      >
                        {tt(`priority_${p}` as Parameters<typeof tt>[0])}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category */}
              <div>
                <label style={{ fontSize: 13, color: "var(--bom-muted)", marginBottom: 8, display: "block" }}>
                  {tt("category")}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateForm("category", c)}
                      style={{
                        padding: "10px 6px",
                        borderRadius: 12,
                        border: `2px solid ${form.category === c ? "var(--bom-purple)" : "var(--bom-border)"}`,
                        background: form.category === c ? "rgba(124,58,237,0.2)" : "transparent",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{GOAL_EMOJIS[c]}</span>
                      <span style={{ fontSize: 9, color: form.category === c ? "var(--bom-purple-light)" : "var(--bom-muted)" }}>
                        {tt(`goal_${c}` as Parameters<typeof tt>[0]).split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recurrence */}
              <div>
                <label style={{ fontSize: 13, color: "var(--bom-muted)", marginBottom: 8, display: "block" }}>
                  {lang === "nl" ? "Herhaling" : "Recurrence"}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {RECURRENCE_OPTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => updateForm("recurrenceType", r)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 20,
                        border: `2px solid ${form.recurrenceType === r ? "var(--bom-purple)" : "var(--bom-border)"}`,
                        background: form.recurrenceType === r ? "rgba(124,58,237,0.2)" : "transparent",
                        color: form.recurrenceType === r ? "var(--bom-purple-light)" : "var(--bom-muted)",
                        fontSize: 13, fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {recurrenceLabel(r)}
                    </button>
                  ))}
                </div>

                {form.recurrenceType === "custom" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {weekDays.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => toggleCustomDay(i)}
                        style={{
                          flex: 1,
                          aspectRatio: "1",
                          borderRadius: 10,
                          border: `2px solid ${form.customDays.includes(i) ? "var(--bom-purple)" : "var(--bom-border)"}`,
                          background: form.customDays.includes(i) ? "rgba(124,58,237,0.2)" : "transparent",
                          color: form.customDays.includes(i) ? "var(--bom-purple-light)" : "var(--bom-muted)",
                          fontSize: 12, fontWeight: 700,
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, color: "var(--bom-muted)", marginBottom: 8, display: "block" }}>
                    {tt("start_date")}
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateForm("startDate", e.target.value)}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, color: "var(--bom-muted)", marginBottom: 8, display: "block" }}>
                    {tt("end_date")}
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => updateForm("endDate", e.target.value)}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              {/* Estimated time */}
              <div>
                <label style={{ fontSize: 13, color: "var(--bom-muted)", marginBottom: 8, display: "block" }}>
                  {tt("estimated_time")} ({tt("minutes")})
                </label>
                <input
                  type="number"
                  value={form.estimatedMinutes}
                  onChange={(e) => updateForm("estimatedMinutes", e.target.value)}
                  placeholder="30"
                  min="1" max="480"
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: "16px", borderRadius: 14,
                    background: "var(--bom-border)", border: "none",
                    color: "var(--bom-muted)", fontSize: 15, fontWeight: 600,
                    flex: 0.4,
                  }}
                >
                  {tt("cancel")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!form.title.trim()}
                  style={{
                    flex: 1, padding: "16px", borderRadius: 14,
                    background: form.title.trim()
                      ? "linear-gradient(135deg, #7C3AED, #A78BFA)"
                      : "var(--bom-border)",
                    border: "none",
                    color: form.title.trim() ? "white" : "var(--bom-muted)",
                    fontSize: 16, fontWeight: 700,
                  }}
                >
                  {tt("save")} ✓
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
