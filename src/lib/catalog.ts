import { Pet, PetAccessory } from "./types";

export const PETS_CATALOG: Omit<Pet, "purchasedAt" | "equippedAccessories" | "level" | "xp">[] = [
  { id: "cat", species: "cat", name: "Cat", emoji: "🐱", cost: 100 },
  { id: "dog", species: "dog", name: "Dog", emoji: "🐶", cost: 120 },
  { id: "rabbit", species: "rabbit", name: "Rabbit", emoji: "🐰", cost: 80 },
  { id: "fox", species: "fox", name: "Fox", emoji: "🦊", cost: 150 },
  { id: "owl", species: "owl", name: "Owl", emoji: "🦉", cost: 140 },
  { id: "bear", species: "bear", name: "Bear", emoji: "🐻", cost: 130 },
  { id: "panda", species: "panda", name: "Panda", emoji: "🐼", cost: 160 },
  { id: "dragon", species: "dragon", name: "Dragon", emoji: "🐲", cost: 300 },
];

export const ACCESSORIES_CATALOG: PetAccessory[] = [
  { id: "hat_cowboy", type: "hat", name: "Cowboy Hat", emoji: "🤠", cost: 30 },
  { id: "hat_party", type: "hat", name: "Party Hat", emoji: "🎉", cost: 25 },
  { id: "bow_red", type: "bow", name: "Red Bow", emoji: "🎀", cost: 20 },
  { id: "glasses_cool", type: "glasses", name: "Cool Glasses", emoji: "😎", cost: 35 },
  { id: "crown_gold", type: "crown", name: "Gold Crown", emoji: "👑", cost: 80 },
  { id: "scarf_winter", type: "scarf", name: "Winter Scarf", emoji: "🧣", cost: 25 },
  { id: "hat_wizard", type: "hat", name: "Wizard Hat", emoji: "🧙", cost: 60 },
  { id: "glasses_heart", type: "glasses", name: "Heart Glasses", emoji: "🥰", cost: 40 },
];
