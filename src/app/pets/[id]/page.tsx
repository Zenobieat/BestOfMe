"use client";

import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { BUDDIES_CATALOG, TIER_COLORS } from "@/lib/catalog";
import { Pet3D } from "@/components/Pet3D";
import { Coins, Check, Lock, ChevronLeft, Pencil, Star } from "lucide-react";
import { useState } from "react";

export default function BuddyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useStore((s) => s.user);
  const pets = useStore((s) => s.pets);
  const buyPet = useStore((s) => s.buyPet);
  const setActivePet = useStore((s) => s.setActivePet);
  const namePet = useStore((s) => s.namePet);

  const lang = user?.language ?? "nl";
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  const buddy = BUDDIES_CATALOG.find((b) => b.id === id);
  const ownedPet = pets.find((p) => p.species === id);
  const owned = !!ownedPet;
  const isActive = user?.activePetId === ownedPet?.id;
  const coins = user?.bomCoins ?? 0;
  const canAfford = coins >= (buddy?.cost ?? 0);
  const isSpecial = id === "blobfish";

  const tierInfo = buddy ? TIER_COLORS[buddy.tier] : null;

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2200);
  };

  const handleBuy = () => {
    const ok = buyPet(id);
    showToast(
      ok
        ? lang === "nl" ? "Buddy gekocht! 🎉" : "Buddy purchased! 🎉"
        : lang === "nl" ? "Niet genoeg coins" : "Not enough coins",
      ok
    );
  };

  const handleEquip = () => {
    if (ownedPet) {
      setActivePet(ownedPet.id);
      showToast(
        lang === "nl" ? "Buddy ingesteld als actief!" : "Buddy set as active!",
        true
      );
    }
  };

  if (!buddy) {
    return (
      <div style={{ minHeight: "100dvh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-dim)" }}>{lang === "nl" ? "Buddy niet gevonden" : "Buddy not found"}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {toast && (
        <div style={{
          position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)",
          padding: "10px 22px", borderRadius: 20,
          background: toast.ok ? "var(--green)" : "var(--red)",
          color: "white", fontWeight: 700, fontSize: 14, zIndex: 999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }} className="fade-up">
          {toast.msg}
        </div>
      )}

      {/* Back button */}
      <div className="safe-top" style={{ padding: "0 20px", background: "var(--bg)" }}>
        <div style={{ paddingTop: 4, paddingBottom: 14 }}>
          <button
            onClick={() => router.back()}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "none", color: "var(--text-dim)",
              fontSize: 15, fontWeight: 600, cursor: "pointer", padding: "8px 0",
            }}
          >
            <ChevronLeft size={20} />
            {lang === "nl" ? "Terug" : "Back"}
          </button>
        </div>
      </div>

      {/* Hero gradient background */}
      <div style={{
        position: "relative",
        background: `radial-gradient(ellipse at 50% 0%, ${buddy.colors.body}28 0%, transparent 70%)`,
        paddingTop: 20, paddingBottom: 32,
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {/* Tier + special badge row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
          {tierInfo && (
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "4px 12px",
              borderRadius: 20, color: tierInfo.color, background: tierInfo.bg,
              border: `1px solid ${tierInfo.color}44`,
            }}>
              {tierInfo.label}
            </span>
          )}
          {isSpecial && (
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "4px 12px",
              borderRadius: 20, color: "#FF7043", background: "rgba(255,112,67,0.12)",
              border: "1px solid rgba(255,112,67,0.3)",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <Star size={11} fill="#FF7043" /> Special
            </span>
          )}
          {owned && (
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "4px 12px",
              borderRadius: 20, color: "var(--green)", background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <Check size={11} /> {lang === "nl" ? "In collectie" : "Owned"}
            </span>
          )}
        </div>

        {/* 3D model — large interactive viewer */}
        <div style={{
          width: 280, height: 280,
          filter: `drop-shadow(0 20px 40px ${buddy.colors.glow ?? buddy.colors.accent}44)`,
        }}>
          <Pet3D species={id} size={280} interactive />
        </div>

        {/* Name */}
        {renaming && ownedPet ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16 }}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={ownedPet.name}
              autoFocus
              style={{ fontSize: 22, fontWeight: 800, textAlign: "center", maxWidth: 200 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (newName.trim()) namePet(ownedPet.id, newName.trim());
                  setRenaming(false);
                }
              }}
            />
            <button
              className="btn-primary"
              style={{ padding: "10px 16px" }}
              onClick={() => { if (newName.trim()) namePet(ownedPet.id, newName.trim()); setRenaming(false); }}
            >
              <Check size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900 }}>
              {ownedPet ? ownedPet.name : buddy.name}
            </h1>
            {owned && ownedPet && (
              <button
                onClick={() => { setRenaming(true); setNewName(ownedPet.name); }}
                style={{ background: "none", border: "none", color: "var(--text-faint)", padding: 4, cursor: "pointer" }}
              >
                <Pencil size={16} />
              </button>
            )}
          </div>
        )}

        <p style={{ fontSize: 13, color: "var(--text-faint)", marginTop: 2 }}>{buddy.name}</p>
      </div>

      {/* Info card */}
      <div style={{ flex: 1, padding: "0 20px 32px" }}>
        {/* Description */}
        {buddy.description && (
          <div style={{
            padding: "16px 18px", borderRadius: 18,
            background: "var(--card)", border: "1px solid var(--border)",
            marginBottom: 14,
          }}>
            <p style={{ fontSize: 14, color: "var(--text-dim)", fontStyle: "italic", lineHeight: 1.5 }}>
              "{buddy.description}"
            </p>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{
            padding: "14px 16px", borderRadius: 16,
            background: "var(--card)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <Coins size={20} color="var(--gold)" />
            <div>
              <p style={{ fontSize: 18, fontWeight: 800 }}>{buddy.cost.toLocaleString()}</p>
              <p style={{ fontSize: 10, color: "var(--text-faint)" }}>{lang === "nl" ? "Prijs" : "Price"}</p>
            </div>
          </div>
          {ownedPet && (
            <div style={{
              padding: "14px 16px", borderRadius: 16,
              background: "var(--card)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 22 }}>⭐</span>
              <div>
                <p style={{ fontSize: 18, fontWeight: 800 }}>Level {ownedPet.level}</p>
                <p style={{ fontSize: 10, color: "var(--text-faint)" }}>{ownedPet.xp} XP</p>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <div style={{ marginTop: 8 }}>
          {!owned ? (
            <button
              onClick={handleBuy}
              disabled={!canAfford}
              style={{
                width: "100%", padding: "16px",
                borderRadius: 18, fontSize: 16, fontWeight: 800,
                background: canAfford
                  ? `linear-gradient(135deg, ${buddy.colors.body}, ${buddy.colors.accent})`
                  : "var(--surface)",
                border: canAfford ? "none" : "1px solid var(--border)",
                color: canAfford ? "white" : "var(--text-faint)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: canAfford ? `0 8px 24px ${buddy.colors.body}44` : "none",
              }}
            >
              {!canAfford && <Lock size={16} />}
              <Coins size={16} />
              {canAfford
                ? (lang === "nl" ? `Kopen voor ${buddy.cost.toLocaleString()} coins` : `Buy for ${buddy.cost.toLocaleString()} coins`)
                : (lang === "nl" ? `Niet genoeg coins (${(buddy.cost - coins).toLocaleString()} te kort)` : `Need ${(buddy.cost - coins).toLocaleString()} more coins`)}
            </button>
          ) : isActive ? (
            <div style={{
              width: "100%", padding: "16px",
              borderRadius: 18, fontSize: 15, fontWeight: 700,
              background: "rgba(16,185,129,0.1)", border: "1.5px solid rgba(16,185,129,0.35)",
              color: "var(--green)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <Check size={18} />
              {lang === "nl" ? "Actieve buddy" : "Active buddy"}
            </div>
          ) : (
            <button
              onClick={handleEquip}
              style={{
                width: "100%", padding: "16px",
                borderRadius: 18, fontSize: 16, fontWeight: 800,
                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                border: "none", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
              }}
            >
              {lang === "nl" ? "Instellen als actief" : "Set as active"}
            </button>
          )}
        </div>

        {/* Coins balance if can't afford */}
        {!owned && !canAfford && (
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-faint)", marginTop: 12 }}>
            {lang === "nl" ? "Jouw coins: " : "Your coins: "}
            <span style={{ color: "var(--gold)", fontWeight: 700 }}>{coins.toLocaleString()}</span>
          </p>
        )}
      </div>
    </div>
  );
}
