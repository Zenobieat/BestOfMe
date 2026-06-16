"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { ParsedTask } from "@/lib/nlp";
import { Send, Trash2, Bot, User, Plus, Check } from "lucide-react";

const QUICK_PROMPTS_NL = [
  "Help me een SMART doel stellen",
  "Hoe blijf ik gemotiveerd?",
  "Ik wil elke avond 25 push-ups doen",
  "Geef me een ochtend routine",
  "Ik wil elke dag 30 min studeren",
];
const QUICK_PROMPTS_EN = [
  "Help me set a SMART goal",
  "How do I stay motivated?",
  "I want to do 25 push-ups every evening",
  "Give me a morning routine",
  "I want to study 30 min every day",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  taskSuggestion?: ParsedTask | null;
  taskAdded?: boolean;
}

const RECURRENCE_LABELS_NL: Record<string, string> = {
  daily: "Dagelijks", weekdays: "Weekdagen", weekends: "Weekend",
  weekly: "Wekelijks", biweekly: "Om de 2 weken", monthly: "Maandelijks",
  custom: "Aangepast", none: "Eenmalig",
};

export default function AIPage() {
  const user = useStore((s) => s.user);
  const addTask = useStore((s) => s.addTask);
  const lang = user?.language ?? "nl";
  const tt = useT(lang);
  const quickPrompts = lang === "nl" ? QUICK_PROMPTS_NL : QUICK_PROMPTS_EN;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
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
        taskSuggestion: data.taskSuggestion ?? null,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: lang === "nl" ? "Probeer het opnieuw." : "Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = (msgId: string, task: ParsedTask) => {
    addTask({
      title: task.title,
      priority: task.priority,
      category: task.category,
      recurrence: {
        type: task.recurrenceType,
        customDays: task.customDays,
      },
      startDate: task.startDate,
      estimatedMinutes: task.estimatedMinutes,
    });
    setMessages((prev) =>
      prev.map((m) => m.id === msgId ? { ...m, taskAdded: true } : m)
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "var(--bg)" }}>
      {/* Header */}
      <div className="safe-top glass" style={{ padding: "12px 20px 16px", flexShrink: 0, borderBottom: "1px solid var(--border)" }}>
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
              <p style={{ fontSize: 11, color: "var(--text-dim)" }}>Ingebouwde AI · Altijd beschikbaar</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} className="btn-ghost" style={{ padding: "8px 12px", gap: 6 }}>
              <Trash2 size={14} />
              <span style={{ fontSize: 13 }}>{lang === "nl" ? "Wissen" : "Clear"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 8px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 20 }}>
            <div style={{
              width: 72, height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
              border: "1px solid rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <Bot size={32} color="var(--primary-light)" />
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              {lang === "nl" ? `Hallo ${user?.name ?? ""}` : `Hey ${user?.name ?? ""}`}
            </p>
            <p style={{ fontSize: 14, color: "var(--text-dim)", maxWidth: 300, margin: "0 auto 28px", lineHeight: 1.6 }}>
              {lang === "nl"
                ? "Ik help je met doelen bereiken en zet taken automatisch in je kalender."
                : "I help you achieve goals and automatically add tasks to your calendar."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 340, margin: "0 auto" }}>
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  style={{
                    padding: "13px 16px",
                    borderRadius: 14,
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: 14, textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              gap: 10, marginBottom: 16,
              alignItems: "flex-start",
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: msg.role === "user"
                ? "linear-gradient(135deg, #6366F1, #4F46E5)"
                : "var(--card)",
              border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {msg.role === "user"
                ? <User size={16} color="white" />
                : <Bot size={16} color="var(--primary-light)" />
              }
            </div>

            <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Bubble */}
              <div style={{
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #6366F1, #4F46E5)"
                  : "var(--card)",
                border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                fontSize: 14, lineHeight: 1.6,
                color: "var(--text)",
                whiteSpace: "pre-wrap",
              }}>
                {msg.content}
              </div>

              {/* Task suggestion card */}
              {msg.taskSuggestion && (
                <div style={{
                  padding: "14px 16px",
                  borderRadius: 16,
                  background: msg.taskAdded ? "rgba(16,185,129,0.08)" : "rgba(99,102,241,0.08)",
                  border: `1px solid ${msg.taskAdded ? "rgba(16,185,129,0.25)" : "rgba(99,102,241,0.25)"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                        {msg.taskSuggestion.title}
                      </p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span className="chip chip-primary" style={{ fontSize: 11 }}>
                          {lang === "nl"
                            ? RECURRENCE_LABELS_NL[msg.taskSuggestion.recurrenceType]
                            : msg.taskSuggestion.recurrenceType}
                        </span>
                        {msg.taskSuggestion.estimatedMinutes && (
                          <span className="chip chip-gold" style={{ fontSize: 11 }}>
                            {msg.taskSuggestion.estimatedMinutes} min
                          </span>
                        )}
                      </div>
                    </div>
                    {msg.taskAdded ? (
                      <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 14px", borderRadius: 12,
                        background: "rgba(16,185,129,0.15)",
                        color: "var(--green)", fontSize: 13, fontWeight: 600,
                        flexShrink: 0,
                      }}>
                        <Check size={14} />
                        {lang === "nl" ? "Toegevoegd" : "Added"}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddTask(msg.id, msg.taskSuggestion!)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "8px 14px", borderRadius: 12,
                          background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                          border: "none", color: "white",
                          fontSize: 13, fontWeight: 700, flexShrink: 0,
                        }}
                      >
                        <Plus size={14} />
                        {lang === "nl" ? "Toevoegen" : "Add task"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "var(--card)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Bot size={16} color="var(--primary-light)" />
            </div>
            <div style={{
              padding: "14px 18px", borderRadius: "4px 18px 18px 18px",
              background: "var(--card)", border: "1px solid var(--border)",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "var(--primary)",
                  animation: `float ${0.5 + i * 0.15}s ease-in-out infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="glass safe-bottom" style={{
        padding: "12px 16px",
        borderTop: "1px solid var(--border)",
        flexShrink: 0, display: "flex", gap: 10, alignItems: "flex-end",
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
          }}
          placeholder={tt("ask_anything")}
          rows={1}
          style={{ flex: 1, maxHeight: 120, borderRadius: 14, padding: "11px 14px", fontSize: 15, lineHeight: 1.4 }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: input.trim() && !loading ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "var(--border)",
            border: "none", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.2s",
          }}
        >
          <Send size={18} />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
