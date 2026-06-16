"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { PETS_CATALOG, ACCESSORIES_CATALOG } from "@/lib/catalog";

type Tab = "collection" | "shop";

export default function PetsPage() {
  const user = useStore((s) => s.user);
  const pets = useStore((s) => s.pets);
  const buyPet = useStore((s) => s.buyPet);
  const buyAccessory = useStore((s) => s.buyAccessory);
  const equipAccessory = useStore((s) => s.equipAccessory);
  const unequipAccessory = useStore((s) => s.unequipAccessory);
  const setActivePet = useStore((s) => s.setActivePet);
  const namePet = useStore((s) => s.namePet);

  const lang = user?.language ?? "nl";
  const tt = useT(lang);
  const [tab, setTab] = useState<Tab>("collection");
  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    user?.activePetId ?? null
  );
  const [namingPetId, setNamingPetId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [buyFeedback, setBuyFeedback] = useState<string | null>(null);

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const ownedIds = user?.ownedPetIds ?? [];
  const ownedAccessoryIds = user?.ownedAccessoryIds ?? [];

  const handleBuyPet = (petId: string) => {
    const success = buyPet(petId);
    setBuyFeedback(success ? "bought" : "failed");
    if (success) setSelectedPetId(petId);
    setTimeout(() => setBuyFeedback(null), 2000);
  };

  const handleBuyAccessory = (id: string) => {
    const success = buyAccessory(id);
    setBuyFeedback(success ? "bought" : "failed");
    setTimeout(() => setBuyFeedback(null), 2000);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bom-bg)", paddingBottom: 90 }}>
      {/* Header */}
      <div className="safe-top" style={{ padding: "16px 20px 0", background: "linear-gradient(180deg, #1A0A2E 0%, var(--bom-bg) 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{tt("pets")}</h1>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(245,158,11,0.15)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: 20, padding: "6px 14px",
          }}>
            <span>🪙</span>
            <span style={{ fontWeight: 700, color: "#F59E0B" }}>{user?.bomCoins ?? 0}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["collection", "shop"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "10px",
                borderRadius: 12,
                border: "none",
                background: tab === t ? "var(--bom-purple)" : "var(--bom-surface)",
                color: tab === t ? "white" : "var(--bom-muted)",
                fontSize: 14, fontWeight: 700,
              }}
            >
              {t === "collection" ? `🐾 ${tt("your_pets")}` : `🛍️ ${tt("shop")}`}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback toast */}
      {buyFeedback && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          padding: "10px 20px", borderRadius: 20,
          background: buyFeedback === "bought" ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.9)",
          color: "white", fontWeight: 700, fontSize: 14, zIndex: 999,
          animation: "slide-up 0.3s ease-out",
        }}>
          {buyFeedback === "bought"
            ? (lang === "nl" ? "Gekocht! 🎉" : "Purchased! 🎉")
            : (lang === "nl" ? "Niet genoeg coins 💸" : "Not enough coins 💸")}
        </div>
      )}

      <div style={{ padding: "0 20px" }}>
        {tab === "collection" && (
          <>
            {pets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--bom-muted)" }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>🐾</p>
                <p style={{ fontSize: 16, marginBottom: 8 }}>{tt("no_pet_yet")}</p>
                <button
                  onClick={() => setTab("shop")}
                  style={{
                    marginTop: 16, padding: "12px 24px",
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
                    border: "none", color: "white",
                    fontSize: 15, fontWeight: 700,
                  }}
                >
                  → {tt("shop")}
                </button>
              </div>
            ) : (
              <>
                {/* Pet selector */}
                <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, marginBottom: 20 }}>
                  {pets.map((pet) => (
                    <button
                      key={pet.id}
                      onClick={() => {
                        setSelectedPetId(pet.id);
                        setActivePet(pet.id);
                      }}
                      style={{
                        flexShrink: 0,
                        width: 70, height: 70,
                        borderRadius: 20,
                        border: `2px solid ${selectedPetId === pet.id ? "var(--bom-purple)" : "var(--bom-border)"}`,
                        background: selectedPetId === pet.id ? "rgba(124,58,237,0.2)" : "var(--bom-surface)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        gap: 4, cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{pet.emoji}</span>
                      <span style={{ fontSize: 10, color: "var(--bom-muted)", fontWeight: 600 }}>
                        Lv{pet.level}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedPet && (
                  <div>
                    {/* Pet display */}
                    <div style={{
                      background: "var(--bom-surface)",
                      border: "1px solid var(--bom-border)",
                      borderRadius: 24,
                      padding: 24, marginBottom: 20,
                      textAlign: "center",
                    }}>
                      {/* Pet with accessories */}
                      <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
                        <div style={{ fontSize: 72 }}>{selectedPet.emoji}</div>
                        {selectedPet.equippedAccessories.map((id, idx) => {
                          const acc = ACCESSORIES_CATALOG.find((a) => a.id === id);
                          return acc ? (
                            <span
                              key={id}
                              style={{
                                position: "absolute",
                                top: idx * 0 - 16,
                                right: idx * 10 - 10,
                                fontSize: 24,
                              }}
                            >
                              {acc.emoji}
                            </span>
                          ) : null;
                        })}
                      </div>

                      {namingPetId === selectedPet.id ? (
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
                          <input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={selectedPet.name}
                            style={{ maxWidth: 160, textAlign: "center" }}
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (newName.trim()) namePet(selectedPet.id, newName.trim());
                              setNamingPetId(null);
                              setNewName("");
                            }}
                            style={{
                              padding: "10px 16px", borderRadius: 12,
                              background: "var(--bom-purple)", border: "none",
                              color: "white", fontWeight: 700,
                            }}
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 4 }}>
                          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{selectedPet.name}</h2>
                          <button
                            onClick={() => { setNamingPetId(selectedPet.id); setNewName(selectedPet.name); }}
                            style={{ background: "none", border: "none", fontSize: 16, color: "var(--bom-muted)" }}
                          >
                            ✏️
                          </button>
                        </div>
                      )}

                      <p style={{ color: "var(--bom-muted)", fontSize: 14, marginBottom: 16 }}>
                        Level {selectedPet.level} · {selectedPet.xp} XP
                      </p>

                      {/* XP bar */}
                      <div style={{ height: 6, background: "var(--bom-border)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${Math.min(100, (selectedPet.xp % 100))}%`,
                          background: "linear-gradient(90deg, #7C3AED, #A78BFA)",
                          borderRadius: 3,
                        }} />
                      </div>
                    </div>

                    {/* Accessories */}
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
                      {tt("accessories")}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                      {ACCESSORIES_CATALOG.filter((a) =>
                        ownedAccessoryIds.includes(a.id)
                      ).map((acc) => {
                        const equipped = selectedPet.equippedAccessories.includes(acc.id);
                        return (
                          <button
                            key={acc.id}
                            onClick={() =>
                              equipped
                                ? unequipAccessory(selectedPet.id, acc.id)
                                : equipAccessory(selectedPet.id, acc.id)
                            }
                            style={{
                              padding: "12px 8px",
                              borderRadius: 16,
                              border: `2px solid ${equipped ? "var(--bom-purple)" : "var(--bom-border)"}`,
                              background: equipped ? "rgba(124,58,237,0.2)" : "var(--bom-surface)",
                              display: "flex", flexDirection: "column",
                              alignItems: "center", gap: 6,
                            }}
                          >
                            <span style={{ fontSize: 24 }}>{acc.emoji}</span>
                            <span style={{ fontSize: 10, color: equipped ? "var(--bom-purple-light)" : "var(--bom-muted)" }}>
                              {equipped ? tt("unequip") : tt("equip")}
                            </span>
                          </button>
                        );
                      })}
                      {ownedAccessoryIds.length === 0 && (
                        <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--bom-muted)", fontSize: 13 }}>
                          {lang === "nl" ? "Koop accessoires in de winkel!" : "Buy accessories in the shop!"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {tab === "shop" && (
          <>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
              🐾 {lang === "nl" ? "Dieren" : "Animals"}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
              {PETS_CATALOG.map((pet) => {
                const owned = ownedIds.includes(pet.id);
                const canAfford = (user?.bomCoins ?? 0) >= pet.cost;
                return (
                  <div
                    key={pet.id}
                    style={{
                      padding: 20,
                      borderRadius: 20,
                      background: "var(--bom-surface)",
                      border: `1px solid ${owned ? "rgba(16,185,129,0.3)" : "var(--bom-border)"}`,
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {owned && (
                      <div style={{
                        position: "absolute", top: 8, right: 8,
                        background: "rgba(16,185,129,0.2)", borderRadius: 8,
                        padding: "2px 8px", fontSize: 11, color: "#10B981", fontWeight: 700,
                      }}>
                        {tt("owned")}
                      </div>
                    )}
                    <div style={{ fontSize: 48, marginBottom: 8 }}>{pet.emoji}</div>
                    <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{pet.name}</p>
                    <p style={{ color: "#F59E0B", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                      🪙 {pet.cost}
                    </p>
                    {!owned && (
                      <button
                        onClick={() => handleBuyPet(pet.id)}
                        disabled={!canAfford}
                        style={{
                          width: "100%", padding: "10px",
                          borderRadius: 12, border: "none",
                          background: canAfford
                            ? "linear-gradient(135deg, #7C3AED, #A78BFA)"
                            : "var(--bom-border)",
                          color: canAfford ? "white" : "var(--bom-muted)",
                          fontSize: 14, fontWeight: 700,
                        }}
                      >
                        {tt("buy")}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
              ✨ {tt("accessories")}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {ACCESSORIES_CATALOG.map((acc) => {
                const owned = ownedAccessoryIds.includes(acc.id);
                const canAfford = (user?.bomCoins ?? 0) >= acc.cost;
                return (
                  <div
                    key={acc.id}
                    style={{
                      padding: 16,
                      borderRadius: 20,
                      background: "var(--bom-surface)",
                      border: `1px solid ${owned ? "rgba(16,185,129,0.3)" : "var(--bom-border)"}`,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{acc.emoji}</div>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{acc.name}</p>
                    <p style={{ color: "#F59E0B", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                      🪙 {acc.cost}
                    </p>
                    {owned ? (
                      <span style={{ fontSize: 12, color: "#10B981", fontWeight: 700 }}>✓ {tt("owned")}</span>
                    ) : (
                      <button
                        onClick={() => handleBuyAccessory(acc.id)}
                        disabled={!canAfford}
                        style={{
                          width: "100%", padding: "8px",
                          borderRadius: 10, border: "none",
                          background: canAfford
                            ? "linear-gradient(135deg, #7C3AED, #A78BFA)"
                            : "var(--bom-border)",
                          color: canAfford ? "white" : "var(--bom-muted)",
                          fontSize: 13, fontWeight: 700,
                        }}
                      >
                        {tt("buy")}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
