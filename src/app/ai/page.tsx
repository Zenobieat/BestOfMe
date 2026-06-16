"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { Mascot } from "@/components/Mascot";

const QUICK_PROMPTS_NL = [
  "Help me een SMART doel stellen",
  "Hoe blijf ik gemotiveerd?",
  "Geef me een dagelijkse routine",
  "Hoe verbeter ik mijn discipline?",
  "Wat is de beste manier om doelen te bereiken?",
];

const QUICK_PROMPTS_EN = [
  "Help me set a SMART goal",
  "How do I stay motivated?",
  "Give me a daily routine",
  "How do I improve my discipline?",
  "What's the best way to achieve goals?",
];

export default function AIPage() {
  const user = useStore((s) => s.user);
  const chatHistory = useStore((s) => s.chatHistory);
  const addChatMessage = useStore((s) => s.addChatMessage);
  const clearChat = useStore((s) => s.clearChat);
  const goals = useStore((s) => s.goals);

  const lang = user?.language ?? "nl";
  const tt = useT(lang);
  const quickPrompts = lang === "nl" ? QUICK_PROMPTS_NL : QUICK_PROMPTS_EN;

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg = text.trim();
    setInput("");

    addChatMessage({ role: "user", content: userMsg });
    setIsLoading(true);

    try {
      const messages = [
        ...chatHistory.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: userMsg },
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, language: lang }),
      });

      const data = await res.json();
      addChatMessage({ role: "assistant", content: data.message });
    } catch {
      addChatMessage({
        role: "assistant",
        content: lang === "nl"
          ? "Sorry, er ging iets mis. Probeer het opnieuw."
          : "Sorry, something went wrong. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "var(--bom-bg)" }}>
      {/* Header */}
      <div
        className="safe-top"
        style={{
          padding: "16px 20px 12px",
          background: "linear-gradient(180deg, #1A0A2E 0%, var(--bom-bg) 100%)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{tt("ai_coach")}</h1>
            <p style={{ fontSize: 12, color: "var(--bom-muted)", margin: 0 }}>BOM AI · Claude Haiku</p>
          </div>
          {chatHistory.length > 0 && (
            <button
              onClick={clearChat}
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#EF4444",
                borderRadius: 12,
                padding: "6px 12px",
                fontSize: 12, fontWeight: 600,
              }}
            >
              {lang === "nl" ? "Wissen" : "Clear"}
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
        {chatHistory.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
            <Mascot mood="happy" size={80} className="mx-auto" />
            <p style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6 }}>
              {lang === "nl" ? `Hey ${user?.name ?? ""}! Ik ben BOM 👋` : `Hey ${user?.name ?? ""}! I'm BOM 👋`}
            </p>
            <p style={{ fontSize: 14, color: "var(--bom-muted)", maxWidth: 280, margin: "0 auto 24px" }}>
              {lang === "nl"
                ? "Ik help je met doelen bereiken, SMART plannen maken en gemotiveerd blijven."
                : "I help you achieve goals, create SMART plans, and stay motivated."}
            </p>

            {/* Quick prompts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch", maxWidth: 320, margin: "0 auto" }}>
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 16,
                    background: "var(--bom-surface)",
                    border: "1px solid var(--bom-border)",
                    color: "var(--bom-text)",
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

        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              gap: 10,
              marginBottom: 14,
              alignItems: "flex-end",
            }}
          >
            {msg.role === "assistant" && (
              <div style={{ fontSize: 28, flexShrink: 0, marginBottom: 2 }}>🤖</div>
            )}
            <div
              style={{
                maxWidth: "80%",
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #7C3AED, #A78BFA)"
                  : "var(--bom-surface)",
                border: msg.role === "assistant" ? "1px solid var(--bom-border)" : "none",
                fontSize: 15,
                lineHeight: 1.5,
                color: "var(--bom-text)",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-end" }}>
            <div style={{ fontSize: 28 }}>🤖</div>
            <div style={{
              padding: "12px 20px",
              borderRadius: "20px 20px 20px 4px",
              background: "var(--bom-surface)",
              border: "1px solid var(--bom-border)",
              display: "flex", gap: 6, alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "var(--bom-purple)",
                    animation: `float ${0.6 + i * 0.15}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        className="safe-bottom glass"
        style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder={tt("ask_anything")}
          rows={1}
          style={{
            flex: 1, resize: "none",
            maxHeight: 120, borderRadius: 16,
            padding: "12px 14px",
            background: "var(--bom-surface)",
            border: "1px solid var(--bom-border)",
            fontSize: 16,
            lineHeight: 1.4,
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          style={{
            width: 44, height: 44,
            borderRadius: 14, border: "none",
            background: input.trim() && !isLoading
              ? "linear-gradient(135deg, #7C3AED, #A78BFA)"
              : "var(--bom-border)",
            color: "white", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.2s",
          }}
        >
          ↑
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
