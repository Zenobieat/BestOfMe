"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { Pet3D } from "@/components/Pet3D";
import { BuddyAvatar } from "@/components/BuddyAvatar";
import { BUDDIES_CATALOG, ACCESSORIES_CATALOG, TIER_COLORS } from "@/lib/catalog";
import { Coins, Check, Lock, Pencil, ShoppingBag, PawPrint, Star } from "lucide-react";
import { useRouter } from "next/navigation";

type Tab = "collection" | "shop";

const TIERS = [0, 1, 2, 3, 4, 5, 6] as const; // 0 = all

export default function PetsPage() {
  const user = useStore((s) => s.user);
  const pets = useStore((s) => s.pets);
  const buyPet = useStore((s) => s.buyPet);
  const buyAccessory = useStore((s) => s.buyAccessory);
  const equipAccessory = useStore((s) => s.equipAccessory);
  const unequipAccessory = useStore((s) => s.unequipAccessory);
  const setActivePet = useStore((s) => s.setActivePet);
  const namePet = useStore((s) => s.namePet);

  const router = useRouter();
  const lang = user?.language ?? "nl";
  const tt = useT(lang);
  const [tab, setTab] = useState<Tab>("collection");
  const [selectedPetId, setSelectedPetId] = useState<string | null>(user?.activePetId ?? null);
  const [namingPetId, setNamingPetId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [tierFilter, setTierFilter] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const ownedPetIds = user?.ownedPetIds ?? [];
  const ownedAccessoryIds = user?.ownedAccessoryIds ?? [];
  const coins = user?.bomCoins ?? 0;

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2200);
  };

  const handleBuyPet = (id: string) => {
    const ok = buyPet(id);
    showToast(ok
      ? (lang === "nl" ? "Buddy gekocht!" : "Buddy purchased!")
      : (lang === "nl" ? "Niet genoeg coins" : "Not enough coins"), ok);
    if (ok) setSelectedPetId(id);
  };

  const filteredBuddies = tierFilter === 0
    ? BUDDIES_CATALOG
    : BUDDIES_CATALOG.filter((b) => b.tier === tierFilter);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 90 }}>
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

      {/* Header */}
      <div className="safe-top" style={{ padding: "0 20px 0", background: "var(--bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>BOM-Buddies</h1>
          <div className="chip chip-gold" style={{ gap: 5 }}>
            <Coins size={12} /> {coins.toLocaleString()}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, paddingTop: 16, paddingBottom: 4 }}>
          {([
            ["collection", <PawPrint key="p" size={14} />, lang === "nl" ? "Collectie" : "Collection"],
            ["shop", <ShoppingBag key="s" size={14} />, lang === "nl" ? "Winkel" : "Shop"],
          ] as const).map(([t, icon, label]) => (
            <button
              key={t}
              onClick={() => setTab(t as Tab)}
              style={{
                flex: 1, padding: "10px 16px", borderRadius: 12,
                background: tab === t ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "var(--card)",
                border: `1px solid ${tab === t ? "transparent" : "var(--border)"}`,
                color: tab === t ? "white" : "var(--text-dim)",
                fontSize: 14, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>

        {/* COLLECTION TAB */}
        {tab === "collection" && (
          pets.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <PawPrint size={48} color="var(--border)" style={{ margin: "0 auto 20px" }} />
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-dim)", marginBottom: 6 }}>
                {tt("no_pet_yet")}
              </p>
              <button onClick={() => setTab("shop")} className="btn-primary" style={{ marginTop: 20 }}>
                <ShoppingBag size={16} /> {lang === "nl" ? "Naar winkel" : "Go to shop"}
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 16 }}>
                {pets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => router.push(`/pets/${p.species}`)}
                    style={{
                      flexShrink: 0, width: 64, height: 64, borderRadius: 16,
                      border: `2px solid ${user?.activePetId === p.id ? "var(--primary)" : "var(--border)"}`,
                      background: user?.activePetId === p.id ? "rgba(99,102,241,0.15)" : "var(--card)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <BuddyAvatar species={p.species} size={52} />
                  </button>
                ))}
              </div>

              {selectedPet && (() => {
                const catalogEntry = BUDDIES_CATALOG.find((b) => b.id === selectedPet.species);
                const tierInfo = catalogEntry ? TIER_COLORS[catalogEntry.tier] : null;
                return (
                  <>
                    <div className="card" style={{ padding: 24, marginBottom: 20, textAlign: "center", position: "relative" }}>
                      {user?.activePetId === selectedPet.id && (
                        <span className="chip chip-green" style={{ position: "absolute", top: 14, right: 14, fontSize: 11 }}>
                          <Check size={10} /> {lang === "nl" ? "Actief" : "Active"}
                        </span>
                      )}
                      {tierInfo && (
                        <span style={{
                          position: "absolute", top: 14, left: 14,
                          fontSize: 11, fontWeight: 700, padding: "3px 10px",
                          borderRadius: 20, color: tierInfo.color, background: tierInfo.bg,
                          border: `1px solid ${tierInfo.color}44`,
                        }}>
                          {tierInfo.label}
                        </span>
                      )}

                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <Pet3D species={selectedPet.species} size={180} interactive />
                      </div>

                      {namingPetId === selectedPet.id ? (
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8, marginTop: 8 }}>
                          <input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={selectedPet.name}
                            style={{ maxWidth: 160, textAlign: "center", fontSize: 18, fontWeight: 700 }}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                if (newName.trim()) namePet(selectedPet.id, newName.trim());
                                setNamingPetId(null);
                              }
                            }}
                          />
                          <button className="btn-primary" style={{ padding: "10px 16px", flexShrink: 0 }}
                            onClick={() => { if (newName.trim()) namePet(selectedPet.id, newName.trim()); setNamingPetId(null); }}>
                            <Check size={16} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, marginBottom: 4 }}>
                          <h2 style={{ fontSize: 22, fontWeight: 800 }}>{selectedPet.name}</h2>
                          <button
                            onClick={() => { setNamingPetId(selectedPet.id); setNewName(selectedPet.name); }}
                            style={{ background: "none", border: "none", color: "var(--text-faint)", padding: 4 }}
                          >
                            <Pencil size={15} />
                          </button>
                        </div>
                      )}

                      {catalogEntry?.description && (
                        <p style={{ fontSize: 12, color: "var(--text-dim)", fontStyle: "italic", marginBottom: 8 }}>
                          "{catalogEntry.description}"
                        </p>
                      )}

                      <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 10 }}>
                        Level {selectedPet.level} · {selectedPet.xp} XP
                      </p>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${selectedPet.xp % 100}%` }} />
                      </div>
                    </div>

                    {ownedAccessoryIds.length > 0 && (
                      <>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dim)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {tt("accessories")}
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                          {ACCESSORIES_CATALOG.filter((a) => ownedAccessoryIds.includes(a.id)).map((acc) => {
                            const equipped = selectedPet.equippedAccessories.includes(acc.id);
                            return (
                              <button
                                key={acc.id}
                                onClick={() => equipped ? unequipAccessory(selectedPet.id, acc.id) : equipAccessory(selectedPet.id, acc.id)}
                                style={{
                                  padding: "12px 8px", borderRadius: 16,
                                  border: `2px solid ${equipped ? "var(--primary)" : "var(--border)"}`,
                                  background: equipped ? "rgba(99,102,241,0.15)" : "var(--card)",
                                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                                }}
                              >
                                <span style={{ fontSize: 22 }}>{acc.emoji}</span>
                                <span style={{ fontSize: 9, color: equipped ? "var(--primary-light)" : "var(--text-dim)", fontWeight: 600 }}>
                                  {equipped ? (lang === "nl" ? "Uit" : "Off") : (lang === "nl" ? "Aan" : "On")}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </>
          )
        )}

        {/* SHOP TAB */}
        {tab === "shop" && (
          <>
            {/* Tier filter */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 14 }}>
              <button
                onClick={() => setTierFilter(0)}
                style={{
                  flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                  border: `2px solid ${tierFilter === 0 ? "var(--primary)" : "var(--border)"}`,
                  background: tierFilter === 0 ? "rgba(99,102,241,0.15)" : "transparent",
                  color: tierFilter === 0 ? "var(--primary-light)" : "var(--text-dim)",
                }}
              >
                {lang === "nl" ? "Alle" : "All"} ({BUDDIES_CATALOG.length})
              </button>
              {([1, 2, 3, 4, 5, 6] as const).map((tier) => {
                const info = TIER_COLORS[tier];
                const count = BUDDIES_CATALOG.filter((b) => b.tier === tier).length;
                return (
                  <button
                    key={tier}
                    onClick={() => setTierFilter(tier)}
                    style={{
                      flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                      border: `2px solid ${tierFilter === tier ? info.color : "var(--border)"}`,
                      background: tierFilter === tier ? info.bg : "transparent",
                      color: tierFilter === tier ? info.color : "var(--text-dim)",
                    }}
                  >
                    {info.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Buddy grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
              {filteredBuddies.map((buddy) => {
                const owned = ownedPetIds.includes(buddy.id);
                const canAfford = coins >= buddy.cost;
                const tierInfo = TIER_COLORS[buddy.tier];
                const isSpecial = buddy.id === "blobfish";
                return (
                  <div
                    key={buddy.id}
                    className="card"
                    onClick={() => router.push(`/pets/${buddy.id}`)}
                    style={{
                      padding: 14, textAlign: "center", position: "relative",
                      borderColor: isSpecial ? "rgba(255,171,145,0.4)" : undefined,
                      background: isSpecial ? "linear-gradient(135deg, rgba(255,87,34,0.06), var(--card))" : undefined,
                      cursor: "pointer",
                    }}
                  >
                    {/* Tier badge */}
                    <div style={{
                      position: "absolute", top: 8, left: 8,
                      fontSize: 9, fontWeight: 700, padding: "2px 7px",
                      borderRadius: 20, color: tierInfo.color, background: tierInfo.bg,
                    }}>
                      {tierInfo.label}
                    </div>

                    {owned && (
                      <div style={{
                        position: "absolute", top: 8, right: 8,
                        background: "rgba(16,185,129,0.15)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        borderRadius: 8, padding: "2px 7px",
                        fontSize: 9, fontWeight: 700, color: "var(--green)",
                        display: "flex", alignItems: "center", gap: 3,
                      }}>
                        <Check size={8} />
                      </div>
                    )}

                    {isSpecial && (
                      <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)" }}>
                        <Star size={12} color="#FF7043" fill="#FF7043" />
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "center", marginTop: 14, marginBottom: 6 }}>
                      <BuddyAvatar species={buddy.id} size={90} />
                    </div>

                    <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2, lineHeight: 1.2 }}>{buddy.name}</p>

                    {buddy.description && (
                      <p style={{ fontSize: 10, color: "var(--text-faint)", marginBottom: 6, fontStyle: "italic", lineHeight: 1.3 }}>
                        {buddy.description}
                      </p>
                    )}

                    <div className="chip chip-gold" style={{ justifyContent: "center", marginBottom: 10, fontSize: 11 }}>
                      <Coins size={10} /> {buddy.cost.toLocaleString()}
                    </div>

                    {!owned && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBuyPet(buddy.id); }}
                        disabled={!canAfford}
                        style={{
                          width: "100%", padding: "9px",
                          borderRadius: 10,
                          background: canAfford ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "var(--surface)",
                          border: `1px solid ${canAfford ? "transparent" : "var(--border)"}`,
                          color: canAfford ? "white" : "var(--text-faint)",
                          fontSize: 12, fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                        }}
                      >
                        {!canAfford && <Lock size={11} />}
                        {tt("buy")}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Accessories */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dim)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {tt("accessories")}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {ACCESSORIES_CATALOG.map((acc) => {
                const owned = ownedAccessoryIds.includes(acc.id);
                const canAfford = coins >= acc.cost;
                return (
                  <div key={acc.id} className="card" style={{ padding: 16, textAlign: "center" }}>
                    <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>{acc.emoji}</span>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{acc.name}</p>
                    <div className="chip chip-gold" style={{ justifyContent: "center", marginBottom: 10 }}>
                      <Coins size={11} /> {acc.cost}
                    </div>
                    {owned ? (
                      <span className="chip chip-green" style={{ justifyContent: "center" }}>
                        <Check size={11} /> {lang === "nl" ? "Eigendom" : "Owned"}
                      </span>
                    ) : (
                      <button
                        onClick={() => { const ok = buyAccessory(acc.id); showToast(ok ? (lang === "nl" ? "Gekocht!" : "Purchased!") : (lang === "nl" ? "Niet genoeg coins" : "Not enough coins"), ok); }}
                        disabled={!canAfford}
                        style={{
                          width: "100%", padding: "9px", borderRadius: 10,
                          background: canAfford ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "var(--surface)",
                          border: `1px solid ${canAfford ? "transparent" : "var(--border)"}`,
                          color: canAfford ? "white" : "var(--text-faint)",
                          fontSize: 13, fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}
                      >
                        {!canAfford && <Lock size={12} />}
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
