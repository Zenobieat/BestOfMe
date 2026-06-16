"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { Pet3D } from "@/components/Pet3D";
import { PETS_CATALOG, ACCESSORIES_CATALOG } from "@/lib/catalog";
import { PetSpecies } from "@/lib/types";
import { Coins, Check, Lock, Pencil, ShoppingBag, PawPrint } from "lucide-react";

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
  const [selectedPetId, setSelectedPetId] = useState<string | null>(user?.activePetId ?? null);
  const [namingPetId, setNamingPetId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const ownedPetIds = user?.ownedPetIds ?? [];
  const ownedAccessoryIds = user?.ownedAccessoryIds ?? [];

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2200);
  };

  const handleBuyPet = (id: string) => {
    const ok = buyPet(id);
    showToast(ok
      ? (lang === "nl" ? "Gekocht!" : "Purchased!")
      : (lang === "nl" ? "Niet genoeg coins" : "Not enough coins"), ok);
    if (ok) setSelectedPetId(id);
  };

  const handleBuyAccessory = (id: string) => {
    const ok = buyAccessory(id);
    showToast(ok
      ? (lang === "nl" ? "Accessoire gekocht!" : "Accessory purchased!")
      : (lang === "nl" ? "Niet genoeg coins" : "Not enough coins"), ok);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 90 }}>
      {/* Toast */}
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
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>{tt("pets")}</h1>
          <div className="chip chip-gold" style={{ gap: 5 }}>
            <Coins size={12} /> {user?.bomCoins ?? 0}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, paddingTop: 16, paddingBottom: 4 }}>
          {([["collection", <PawPrint key="p" size={14} />, lang === "nl" ? "Collectie" : "Collection"],
             ["shop",       <ShoppingBag key="s" size={14} />, lang === "nl" ? "Winkel" : "Shop"]] as const).map(([t, icon, label]) => (
            <button
              key={t}
              onClick={() => setTab(t as Tab)}
              style={{
                flex: 1, padding: "10px 16px",
                borderRadius: 12,
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
              {/* Pet selector row */}
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 16 }}>
                {pets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPetId(p.id); setActivePet(p.id); }}
                    style={{
                      flexShrink: 0, width: 64, height: 64, borderRadius: 16,
                      border: `2px solid ${selectedPetId === p.id ? "var(--primary)" : "var(--border)"}`,
                      background: selectedPetId === p.id ? "rgba(99,102,241,0.15)" : "var(--card)",
                      overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Pet3D species={p.species as PetSpecies} size={60} />
                  </button>
                ))}
              </div>

              {selectedPet && (
                <>
                  {/* Pet display card */}
                  <div className="card" style={{ padding: 24, marginBottom: 20, textAlign: "center", position: "relative" }}>
                    {/* Active badge */}
                    {user?.activePetId === selectedPet.id && (
                      <span className="chip chip-green" style={{ position: "absolute", top: 14, right: 14, fontSize: 11 }}>
                        <Check size={10} /> {lang === "nl" ? "Actief" : "Active"}
                      </span>
                    )}

                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Pet3D species={selectedPet.species as PetSpecies} size={180} interactive />
                    </div>

                    {/* Name */}
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
                        <button
                          className="btn-primary"
                          style={{ padding: "10px 16px", flexShrink: 0 }}
                          onClick={() => {
                            if (newName.trim()) namePet(selectedPet.id, newName.trim());
                            setNamingPetId(null);
                          }}
                        >
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

                    <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 16 }}>
                      Level {selectedPet.level} · {selectedPet.xp} XP
                    </p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${selectedPet.xp % 100}%` }} />
                    </div>
                  </div>

                  {/* Accessories */}
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
              )}
            </>
          )
        )}

        {/* SHOP TAB */}
        {tab === "shop" && (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dim)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {lang === "nl" ? "Dieren" : "Animals"}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
              {PETS_CATALOG.map((pet) => {
                const owned = ownedPetIds.includes(pet.id);
                const canAfford = (user?.bomCoins ?? 0) >= pet.cost;
                return (
                  <div key={pet.id} className="card" style={{ padding: 16, textAlign: "center", position: "relative" }}>
                    {owned && (
                      <div style={{
                        position: "absolute", top: 10, right: 10,
                        background: "rgba(16,185,129,0.15)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        borderRadius: 8, padding: "3px 8px",
                        fontSize: 10, fontWeight: 700, color: "var(--green)",
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <Check size={9} /> {lang === "nl" ? "Eigen" : "Owned"}
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Pet3D species={pet.species as PetSpecies} size={120} />
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, marginTop: 4 }}>{pet.name}</p>
                    <div className="chip chip-gold" style={{ justifyContent: "center", marginBottom: 12 }}>
                      <Coins size={11} /> {pet.cost}
                    </div>
                    {!owned && (
                      <button
                        onClick={() => handleBuyPet(pet.id)}
                        disabled={!canAfford}
                        style={{
                          width: "100%", padding: "10px",
                          borderRadius: 12,
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

            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dim)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {tt("accessories")}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {ACCESSORIES_CATALOG.map((acc) => {
                const owned = ownedAccessoryIds.includes(acc.id);
                const canAfford = (user?.bomCoins ?? 0) >= acc.cost;
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
                        onClick={() => handleBuyAccessory(acc.id)}
                        disabled={!canAfford}
                        style={{
                          width: "100%", padding: "9px",
                          borderRadius: 10,
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
