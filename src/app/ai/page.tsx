"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { ParsedTask } from "@/lib/nlp";
import { Send, Trash2, Bot, User, Plus, Check, ChevronDown } from "lucide-react";
import { RecurrenceType, Priority, GoalCategory } from "@/lib/types";

// ── Types ────────────────────────────────────────────────────

interface TaskDraft extends ParsedTask {
  confirmed?: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  taskDraft?: TaskDraft | null;
  taskAdded?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────

const RECURRENCE_NL: Record<RecurrenceType, string> = {
  none: "Eenmalig", daily: "Dagelijks", weekdays: "Weekdagen",
  weekends: "Weekend", weekly: "Wekelijks", biweekly: "Om de 2 weken",
  monthly: "Maandelijks", custom: "Aangepast",
};
const RECURRENCE_EN: Record<RecurrenceType, string> = {
  none: "One-time", daily: "Daily", weekdays: "Weekdays",
  weekends: "Weekends", weekly: "Weekly", biweekly: "Every 2 weeks",
  monthly: "Monthly", custom: "Custom",
};
const PRIORITY_COLOR: Record<Priority, string> = {
  low: "var(--green)", medium: "var(--gold)", high: "var(--red)",
};
const GOAL_ICONS: Record<GoalCategory, string> = {
  fitness: "💪", money: "💰", consistency: "🔥", school: "📚",
  mindset: "🧠", relationships: "❤️", creativity: "🎨", health: "🌿",
};

// ── Inline editable task card ─────────────────────────────────

function TaskCard({
  draft,
  lang,
  onUpdate,
  onConfirm,
  added,
}: {
  draft: TaskDraft;
  lang: "nl" | "en";
  onUpdate: (updates: Partial<TaskDraft>) => void;
  onConfirm: () => void;
  added: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const REC = lang === "nl" ? RECURRENCE_NL : RECURRENCE_EN;
  const recOptions: RecurrenceType[] = ["daily", "weekdays", "weekends", "weekly", "biweekly", "monthly", "none"];
  const priorities: Priority[] = ["low", "medium", "high"];

  return (
    <div style={{
      borderRadius: 18,
      border: added ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(99,102,241,0.3)",
      background: added ? "rgba(16,185,129,0.06)" : "rgba(99,102,241,0.06)",
      overflow: "hidden",
      marginTop: 4,
    }}>
      {/* Task header — always visible */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <input
            value={draft.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            disabled={added}
            style={{
              background: "transparent", border: "none",
              borderBottom: added ? "none" : "1px solid var(--border-light)",
              borderRadius: 0, padding: "4px 0",
              fontSize: 16, fontWeight: 700, color: "var(--text)",
              flex: 1, width: "auto",
              boxShadow: "none",
            }}
          />
          {!added && (
            <button
              onClick={() => setExpanded((v) => !v)}
              style={{ background: "none", border: "none", color: "var(--text-dim)", padding: 4, flexShrink: 0 }}
            >
              <ChevronDown
                size={18}
                style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              />
            </button>
          )}
        </div>

        {/* Summary chips */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span className="chip chip-primary" style={{ fontSize: 11 }}>{REC[draft.recurrenceType]}</span>
          <span className="chip" style={{
            fontSize: 11,
            background: `${PRIORITY_COLOR[draft.priority]}18`,
            borderColor: `${PRIORITY_COLOR[draft.priority]}40`,
            color: PRIORITY_COLOR[draft.priority],
          }}>
            {lang === "nl"
              ? (draft.priority === "high" ? "Hoog" : draft.priority === "medium" ? "Gemiddeld" : "Laag")
              : (draft.priority === "high" ? "High" : draft.priority === "medium" ? "Medium" : "Low")}
          </span>
          {draft.estimatedMinutes && (
            <span className="chip" style={{ fontSize: 11, background: "rgba(255,255,255,0.04)", borderColor: "var(--border)", color: "var(--text-dim)" }}>
              {draft.estimatedMinutes} min
            </span>
          )}
        </div>
      </div>

      {/* Expanded editor */}
      {expanded && !added && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
          {/* Recurrence */}
          <p style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            {lang === "nl" ? "Herhaling" : "Recurrence"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {recOptions.map((r) => (
              <button
                key={r}
                onClick={() => onUpdate({ recurrenceType: r })}
                style={{
                  padding: "7px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  border: `2px solid ${draft.recurrenceType === r ? "var(--primary)" : "var(--border)"}`,
                  background: draft.recurrenceType === r ? "rgba(99,102,241,0.18)" : "transparent",
                  color: draft.recurrenceType === r ? "var(--primary-light)" : "var(--text-dim)",
                }}
              >
                {REC[r]}
              </button>
            ))}
          </div>

          {/* Priority */}
          <p style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            {lang === "nl" ? "Prioriteit" : "Priority"}
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => onUpdate({ priority: p })}
                style={{
                  flex: 1, padding: "9px 6px", borderRadius: 12, fontSize: 12, fontWeight: 700,
                  border: `2px solid ${draft.priority === p ? PRIORITY_COLOR[p] : "var(--border)"}`,
                  background: draft.priority === p ? `${PRIORITY_COLOR[p]}18` : "transparent",
                  color: draft.priority === p ? PRIORITY_COLOR[p] : "var(--text-dim)",
                }}
              >
                {lang === "nl"
                  ? (p === "high" ? "Hoog" : p === "medium" ? "Gemiddeld" : "Laag")
                  : (p === "high" ? "High" : p === "medium" ? "Medium" : "Low")}
              </button>
            ))}
          </div>

          {/* Estimated time */}
          <p style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            {lang === "nl" ? "Geschatte tijd (min)" : "Estimated time (min)"}
          </p>
          <input
            type="number"
            value={draft.estimatedMinutes ?? ""}
            onChange={(e) => onUpdate({ estimatedMinutes: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="bijv. 30"
            min="1" max="480"
            style={{ marginBottom: 0, fontSize: 14 }}
          />
        </div>
      )}

      {/* Action button */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        {added ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--green)", fontWeight: 700, fontSize: 14 }}>
            <Check size={16} />
            {lang === "nl" ? "Taak toegevoegd aan kalender" : "Task added to calendar"}
          </div>
        ) : (
          <button
            onClick={onConfirm}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <Plus size={16} />
            {lang === "nl" ? "Toevoegen aan kalender" : "Add to calendar"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────

export default function AIPage() {
  const user = useStore((s) => s.user);
  const addTask = useStore((s) => s.addTask);
  const lang = user?.language ?? "nl";
  const tt = useT(lang);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          language: lang,
        }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        taskDraft: data.taskSuggestion ? { ...data.taskSuggestion } : null,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(), role: "assistant",
        content: lang === "nl" ? "Probeer het opnieuw." : "Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const updateDraft = (msgId: string, updates: Partial<TaskDraft>) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.taskDraft
          ? { ...m, taskDraft: { ...m.taskDraft, ...updates } }
          : m
      )
    );
  };

  const confirmTask = (msgId: string) => {
    const msg = messages.find((m) => m.id === msgId);
    if (!msg?.taskDraft) return;
    const t = msg.taskDraft;
    addTask({
      title: t.title,
      priority: t.priority,
      category: t.category,
      recurrence: { type: t.recurrenceType, customDays: t.customDays },
      startDate: t.startDate,
      estimatedMinutes: t.estimatedMinutes,
    });
    setMessages((prev) =>
      prev.map((m) => m.id === msgId ? { ...m, taskAdded: true } : m)
    );
  };

  const isEmpty = messages.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "var(--bg)" }}>
      {/* Header */}
      <div className="safe-top glass" style={{ padding: "12px 20px 14px", flexShrink: 0, borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #6366F1, #4F46E5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bot size={18} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>BOM Coach</p>
              <p style={{ fontSize: 11, color: "var(--text-dim)" }}>
                {lang === "nl" ? "Typ je doel of vraag" : "Type your goal or question"}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} className="btn-ghost" style={{ padding: "7px 12px", gap: 6 }}>
              <Trash2 size={13} />
              <span style={{ fontSize: 12 }}>{lang === "nl" ? "Wissen" : "Clear"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 8px" }}>

        {/* Empty state */}
        {isEmpty && (
          <div style={{ textAlign: "center", paddingTop: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
              border: "1px solid rgba(99,102,241,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px",
            }}>
              <Bot size={28} color="var(--primary-light)" />
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              {lang === "nl" ? `Hoi ${user?.name ?? ""}` : `Hey ${user?.name ?? ""}`}
            </p>
            <p style={{ fontSize: 14, color: "var(--text-dim)", maxWidth: 300, margin: "0 auto", lineHeight: 1.65 }}>
              {lang === "nl"
                ? "Vertel me je doel. Ik stel vragen, pas de taak aan en voeg hem toe aan je kalender."
                : "Tell me your goal. I'll ask questions, adjust the task, and add it to your calendar."}
            </p>

            {/* Example hints — not clickable buttons, just visual hints */}
            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10, maxWidth: 320, margin: "28px auto 0" }}>
              <p style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                {lang === "nl" ? "Voorbeelden" : "Examples"}
              </p>
              {(lang === "nl"
                ? [
                    "Ik wil elke avond 25 push-ups doen",
                    "Help me consistenter zijn met studeren",
                    "Ik wil elke week 30 min wandelen",
                    "Hoe stel ik een SMART doel in?",
                  ]
                : [
                    "I want to do 25 push-ups every evening",
                    "Help me be more consistent with studying",
                    "I want to walk 30 min every week",
                    "How do I set a SMART goal?",
                  ]
              ).map((ex) => (
                <div
                  key={ex}
                  onClick={() => send(ex)}
                  style={{
                    padding: "11px 14px", borderRadius: 12,
                    background: "var(--card)", border: "1px solid var(--border)",
                    fontSize: 13, color: "var(--text-dim)", textAlign: "left",
                    cursor: "pointer", transition: "all 0.15s",
                    lineHeight: 1.4,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  {ex}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              gap: 10, marginBottom: 20,
              alignItems: "flex-start",
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 30, height: 30, borderRadius: 9, flexShrink: 0, marginTop: 2,
              background: msg.role === "user"
                ? "linear-gradient(135deg, #6366F1, #4F46E5)"
                : "var(--card)",
              border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {msg.role === "user"
                ? <User size={15} color="white" />
                : <Bot size={15} color="var(--primary-light)" />}
            </div>

            <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Bubble */}
              <div style={{
                padding: "11px 15px",
                borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #6366F1, #4F46E5)"
                  : "var(--card)",
                border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                fontSize: 14, lineHeight: 1.65, color: "var(--text)",
                whiteSpace: "pre-wrap",
              }}>
                {msg.content}
              </div>

              {/* Task card */}
              {msg.taskDraft && (
                <TaskCard
                  draft={msg.taskDraft}
                  lang={lang}
                  added={!!msg.taskAdded}
                  onUpdate={(updates) => updateDraft(msg.id, updates)}
                  onConfirm={() => confirmTask(msg.id)}
                />
              )}
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: "var(--card)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Bot size={15} color="var(--primary-light)" />
            </div>
            <div style={{
              padding: "12px 18px", borderRadius: "4px 18px 18px 18px",
              background: "var(--card)", border: "1px solid var(--border)",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%", background: "var(--primary)",
                  animation: `float ${0.5 + i * 0.15}s ease-in-out infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="glass safe-bottom" style={{
        padding: "10px 14px",
        borderTop: "1px solid var(--border)",
        flexShrink: 0,
        display: "flex", gap: 10, alignItems: "flex-end",
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
          }}
          placeholder={lang === "nl"
            ? "Typ je doel, vraag of taak..."
            : "Type your goal, question or task..."}
          rows={1}
          style={{
            flex: 1, maxHeight: 120, borderRadius: 14,
            padding: "11px 14px", fontSize: 15, lineHeight: 1.45,
            overflow: "hidden", resize: "none",
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: input.trim() && !loading
              ? "linear-gradient(135deg, #6366F1, #4F46E5)"
              : "var(--border)",
            border: "none", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          <Send size={17} />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
