import { Pet, PetAccessory } from "./types";

export type BuddyShape =
  | "round"      // sphere-based animals
  | "blocky"     // cube/box characters
  | "crystal"    // gem/diamond versions
  | "tall"       // elongated body
  | "wide"       // flat wide body
  | "humanoid"   // bipedal character
  | "spooky"     // ghost / floating
  | "dragon"     // winged dragon-like
  | "tiny"       // small cute round
  | "blob";      // amorphous cluster

export interface BuddyCatalogEntry {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  shape: BuddyShape;
  colors: { body: string; accent: string; dark: string; glow?: string };
  tier: 1 | 2 | 3 | 4 | 5 | 6; // 1=starter ... 6=legendary
  description?: string;
}

export const BUDDIES_CATALOG: BuddyCatalogEntry[] = [
  // ── TIER 1 · Starter (100 – 500) ────────────────────────────────
  { id: "cat",        name: "Cat",           emoji: "🐱", cost: 100,  shape: "round",    tier: 1, colors: { body: "#E8C99A", accent: "#C4956A", dark: "#6B3F1B" } },
  { id: "hamster",    name: "Hamster",       emoji: "🐹", cost: 110,  shape: "tiny",     tier: 1, colors: { body: "#F5D5A8", accent: "#E8A87C", dark: "#8B5E3C" } },
  { id: "fish",       name: "Fish",          emoji: "🐟", cost: 120,  shape: "wide",     tier: 1, colors: { body: "#64B5F6", accent: "#1976D2", dark: "#0D47A1" } },
  { id: "chicken",    name: "Chicken",       emoji: "🐔", cost: 130,  shape: "round",    tier: 1, colors: { body: "#FFF9C4", accent: "#F57F17", dark: "#E65100" } },
  { id: "dog",        name: "Dog",           emoji: "🐶", cost: 140,  shape: "round",    tier: 1, colors: { body: "#C8A87A", accent: "#8B6248", dark: "#4A2C1A" } },
  { id: "mouse",      name: "Mouse",         emoji: "🐭", cost: 150,  shape: "tiny",     tier: 1, colors: { body: "#BDBDBD", accent: "#9E9E9E", dark: "#424242" } },
  { id: "duck",       name: "Duck",          emoji: "🦆", cost: 160,  shape: "round",    tier: 1, colors: { body: "#FFF176", accent: "#F9A825", dark: "#E65100" } },
  { id: "frog",       name: "Frog",          emoji: "🐸", cost: 175,  shape: "tiny",     tier: 1, colors: { body: "#66BB6A", accent: "#2E7D32", dark: "#1B5E20" } },
  { id: "turtle",     name: "Turtle",        emoji: "🐢", cost: 200,  shape: "wide",     tier: 1, colors: { body: "#558B2F", accent: "#33691E", dark: "#1B5E20" } },
  { id: "rabbit",     name: "Rabbit",        emoji: "🐰", cost: 220,  shape: "round",    tier: 1, colors: { body: "#F0E0D0", accent: "#E8B4B8", dark: "#9B6B7A" } },
  { id: "pig",        name: "Pig",           emoji: "🐷", cost: 250,  shape: "round",    tier: 1, colors: { body: "#F8BBD9", accent: "#F48FB1", dark: "#AD1457" } },
  { id: "slime",      name: "Slime",         emoji: "🟢", cost: 280,  shape: "blob",     tier: 1, colors: { body: "#69F0AE", accent: "#00E676", dark: "#00C853", glow: "#00E676" } },
  { id: "cow",        name: "Cow",           emoji: "🐄", cost: 300,  shape: "wide",     tier: 1, colors: { body: "#FFFFFF", accent: "#212121", dark: "#000000" } },
  { id: "sheep",      name: "Sheep",         emoji: "🐑", cost: 320,  shape: "blob",     tier: 1, colors: { body: "#F5F5F5", accent: "#EEEEEE", dark: "#9E9E9E" } },
  { id: "baby_shark", name: "Baby Shark",    emoji: "🦈", cost: 333,  shape: "wide",     tier: 1, colors: { body: "#4FC3F7", accent: "#FFFFFF", dark: "#0277BD" }, description: "doo doo doo" },
  { id: "crab",       name: "Crab",          emoji: "🦀", cost: 350,  shape: "wide",     tier: 1, colors: { body: "#EF5350", accent: "#C62828", dark: "#B71C1C" } },
  { id: "snail",      name: "Snail",         emoji: "🐌", cost: 380,  shape: "tiny",     tier: 1, colors: { body: "#A5D6A7", accent: "#8D6E63", dark: "#4E342E" } },
  { id: "parrot",     name: "Parrot",        emoji: "🦜", cost: 420,  shape: "round",    tier: 1, colors: { body: "#E53935", accent: "#FDD835", dark: "#1B5E20" } },
  { id: "hedgehog",   name: "Hedgehog",      emoji: "🦔", cost: 450,  shape: "round",    tier: 1, colors: { body: "#795548", accent: "#F5F5F5", dark: "#3E2723" } },
  { id: "bee",        name: "Bee",           emoji: "🐝", cost: 480,  shape: "tiny",     tier: 1, colors: { body: "#FDD835", accent: "#212121", dark: "#F57F17" } },

  // ── TIER 2 · Cool (500 – 2000) ──────────────────────────────────
  { id: "fox",        name: "Fox",           emoji: "🦊", cost: 500,  shape: "round",    tier: 2, colors: { body: "#E8742A", accent: "#FFFFFF", dark: "#2C1810" } },
  { id: "owl",        name: "Owl",           emoji: "🦉", cost: 550,  shape: "round",    tier: 2, colors: { body: "#8D6E63", accent: "#FFF9C4", dark: "#3E2723" } },
  { id: "bear",       name: "Bear",          emoji: "🐻", cost: 600,  shape: "round",    tier: 2, colors: { body: "#8D6E63", accent: "#D7B899", dark: "#3E2723" } },
  { id: "panda",      name: "Panda",         emoji: "🐼", cost: 650,  shape: "round",    tier: 2, colors: { body: "#FAFAFA", accent: "#212121", dark: "#000000" } },
  { id: "penguin",    name: "Penguin",       emoji: "🐧", cost: 700,  shape: "tall",     tier: 2, colors: { body: "#212121", accent: "#FFFFFF", dark: "#000000", glow: "#448AFF" } },
  { id: "koala",      name: "Koala",         emoji: "🐨", cost: 750,  shape: "round",    tier: 2, colors: { body: "#9E9E9E", accent: "#F5F5F5", dark: "#424242" } },
  { id: "lobster",    name: "Lobster",       emoji: "🦞", cost: 800,  shape: "wide",     tier: 2, colors: { body: "#E53935", accent: "#FF8A65", dark: "#B71C1C" } },
  { id: "deer",       name: "Deer",          emoji: "🦌", cost: 850,  shape: "tall",     tier: 2, colors: { body: "#D2691E", accent: "#FAFAFA", dark: "#8D4004" } },
  { id: "capybara",   name: "Capybara",      emoji: "🦫", cost: 900,  shape: "wide",     tier: 2, colors: { body: "#A0785A", accent: "#C4936A", dark: "#5D4037" }, description: "El jefe" },
  { id: "horse",      name: "Horse",         emoji: "🐴", cost: 950,  shape: "tall",     tier: 2, colors: { body: "#795548", accent: "#D2691E", dark: "#3E2723" } },
  { id: "axolotl",    name: "Axolotl",       emoji: "🦎", cost: 1000, shape: "wide",     tier: 2, colors: { body: "#F8BBD9", accent: "#FF80AB", dark: "#880E4F", glow: "#FF80AB" }, description: "Adorable water doggo" },
  { id: "quokka",     name: "Quokka",        emoji: "🦘", cost: 1100, shape: "round",    tier: 2, colors: { body: "#D7B899", accent: "#A0785A", dark: "#5D4037" }, description: "Happiest animal" },
  { id: "platypus",   name: "Platypus",      emoji: "🦆", cost: 1200, shape: "wide",     tier: 2, colors: { body: "#8D6E63", accent: "#D2691E", dark: "#4E342E" }, description: "Peak evolution" },
  { id: "flamingo",   name: "Flamingo",      emoji: "🦩", cost: 1350, shape: "tall",     tier: 2, colors: { body: "#FF80AB", accent: "#FF4081", dark: "#C51162" } },
  { id: "toucan",     name: "Toucan",        emoji: "🦅", cost: 1500, shape: "round",    tier: 2, colors: { body: "#212121", accent: "#FF6F00", dark: "#000000" } },
  { id: "shark",      name: "Shark",         emoji: "🦈", cost: 1600, shape: "wide",     tier: 2, colors: { body: "#607D8B", accent: "#ECEFF1", dark: "#263238" } },
  { id: "octopus",    name: "Octopus",       emoji: "🐙", cost: 1750, shape: "blob",     tier: 2, colors: { body: "#CE93D8", accent: "#BA68C8", dark: "#6A1B9A" } },
  { id: "narwhal",    name: "Narwhal",       emoji: "🦄", cost: 1900, shape: "wide",     tier: 2, colors: { body: "#B3E5FC", accent: "#FFFFFF", dark: "#0277BD" }, description: "Unicorn of the sea" },
  { id: "magikarp",   name: "Magikarp",      emoji: "🐟", cost: 1337, shape: "wide",     tier: 2, colors: { body: "#EF5350", accent: "#FDD835", dark: "#B71C1C" }, description: "It's finally evolved... nope" },

  // ── TIER 3 · Epic (2000 – 8000) ─────────────────────────────────
  { id: "wolf",       name: "Wolf",          emoji: "🐺", cost: 2000, shape: "round",    tier: 3, colors: { body: "#9E9E9E", accent: "#ECEFF1", dark: "#212121" } },
  { id: "lion",       name: "Lion",          emoji: "🦁", cost: 2500, shape: "round",    tier: 3, colors: { body: "#FFB300", accent: "#E65100", dark: "#5D4037" } },
  { id: "tiger",      name: "Tiger",         emoji: "🐯", cost: 2800, shape: "round",    tier: 3, colors: { body: "#FF8F00", accent: "#212121", dark: "#E65100" } },
  { id: "elephant",   name: "Elephant",      emoji: "🐘", cost: 3000, shape: "wide",     tier: 3, colors: { body: "#9E9E9E", accent: "#757575", dark: "#424242" } },
  { id: "giraffe",    name: "Giraffe",       emoji: "🦒", cost: 3200, shape: "tall",     tier: 3, colors: { body: "#FFD54F", accent: "#8D6E63", dark: "#5D4037" } },
  { id: "dolphin",    name: "Dolphin",       emoji: "🐬", cost: 3500, shape: "wide",     tier: 3, colors: { body: "#64B5F6", accent: "#ECEFF1", dark: "#1565C0" } },
  { id: "gorilla",    name: "Gorilla",       emoji: "🦍", cost: 3800, shape: "humanoid", tier: 3, colors: { body: "#424242", accent: "#795548", dark: "#212121" } },
  { id: "mantis_shrimp", name: "Mantis Shrimp", emoji: "🦐", cost: 4200, shape: "wide", tier: 3, colors: { body: "#AB47BC", accent: "#FFD54F", dark: "#6A1B9A", glow: "#E040FB" }, description: "Sees 16 colors" },
  { id: "wojak",      name: "Wojak",         emoji: "😐", cost: 4500, shape: "humanoid", tier: 3, colors: { body: "#FFCC80", accent: "#FAFAFA", dark: "#212121" }, description: "I kneel" },
  { id: "pepe",       name: "Pepe",          emoji: "🐸", cost: 5000, shape: "humanoid", tier: 3, colors: { body: "#66BB6A", accent: "#FFCC80", dark: "#2E7D32" }, description: "Feels good man" },
  { id: "chad",       name: "Chad",          emoji: "😎", cost: 5200, shape: "humanoid", tier: 3, colors: { body: "#90A4AE", accent: "#ECEFF1", dark: "#37474F" }, description: "Yes." },
  { id: "shrek",      name: "Shrek",         emoji: "🧅", cost: 5555, shape: "humanoid", tier: 3, colors: { body: "#558B2F", accent: "#8D6E63", dark: "#33691E" }, description: "This is MY swamp" },
  { id: "npc",        name: "NPC",           emoji: "🤖", cost: 5800, shape: "humanoid", tier: 3, colors: { body: "#78909C", accent: "#ECEFF1", dark: "#455A64" }, description: "📍 LOCATION: Quest Giver Zone" },
  { id: "whale",      name: "Whale",         emoji: "🐋", cost: 6000, shape: "wide",     tier: 3, colors: { body: "#42A5F5", accent: "#ECEFF1", dark: "#0D47A1" } },
  { id: "eagle",      name: "Eagle",         emoji: "🦅", cost: 6200, shape: "dragon",   tier: 3, colors: { body: "#8D6E63", accent: "#FFFFFF", dark: "#3E2723" } },
  { id: "doomer",     name: "Doomer",        emoji: "😔", cost: 6500, shape: "humanoid", tier: 3, colors: { body: "#212121", accent: "#9E9E9E", dark: "#000000" }, description: "*plays cigarette music*" },
  { id: "blobfish",   name: "Blobfish",      emoji: "🐡", cost: 6767, shape: "blob",     tier: 3, colors: { body: "#FFAB91", accent: "#FF7043", dark: "#BF360C" }, description: "Special Edition · One in a million" },
  { id: "tardigrade", name: "Tardigrade",    emoji: "🐛", cost: 7000, shape: "blob",     tier: 3, colors: { body: "#E8EAF6", accent: "#9FA8DA", dark: "#3949AB", glow: "#5C6BC0" }, description: "Indestructible water bear" },
  { id: "pangolin",   name: "Pangolin",      emoji: "🦎", cost: 7500, shape: "wide",     tier: 3, colors: { body: "#A1887F", accent: "#795548", dark: "#4E342E" } },

  // ── TIER 4 · Legendary (8000 – 25000) ───────────────────────────
  { id: "dragon",     name: "Dragon",        emoji: "🐲", cost: 8000, shape: "dragon",   tier: 4, colors: { body: "#388E3C", accent: "#81C784", dark: "#1B5E20", glow: "#69F0AE" } },
  { id: "t_rex",      name: "T-Rex",         emoji: "🦖", cost: 8500, shape: "humanoid", tier: 4, colors: { body: "#558B2F", accent: "#8D6E63", dark: "#33691E" } },
  { id: "robot",      name: "Robot",         emoji: "🤖", cost: 9000, shape: "blocky",   tier: 4, colors: { body: "#78909C", accent: "#4FC3F7", dark: "#263238", glow: "#00B0FF" } },
  { id: "ghost",      name: "Ghost",         emoji: "👻", cost: 9500, shape: "spooky",   tier: 4, colors: { body: "#ECEFF1", accent: "#B0BEC5", dark: "#607D8B", glow: "#ECEFF1" } },
  { id: "alien",      name: "Alien",         emoji: "👽", cost: 10000, shape: "humanoid", tier: 4, colors: { body: "#A5D6A7", accent: "#E8F5E9", dark: "#2E7D32", glow: "#69F0AE" } },
  { id: "unicorn",    name: "Unicorn",       emoji: "🦄", cost: 10500, shape: "tall",    tier: 4, colors: { body: "#FFFFFF", accent: "#CE93D8", dark: "#7B1FA2", glow: "#E040FB" } },
  { id: "zombie",     name: "Zombie",        emoji: "🧟", cost: 11000, shape: "humanoid", tier: 4, colors: { body: "#A5D6A7", accent: "#795548", dark: "#1B5E20" } },
  { id: "mammoth",    name: "Mammoth",       emoji: "🐘", cost: 11500, shape: "wide",    tier: 4, colors: { body: "#795548", accent: "#D7CCC8", dark: "#4E342E" } },
  { id: "ninja",      name: "Ninja",         emoji: "🥷", cost: 12000, shape: "humanoid", tier: 4, colors: { body: "#212121", accent: "#B71C1C", dark: "#000000" } },
  { id: "vampire",    name: "Vampire",       emoji: "🧛", cost: 12500, shape: "humanoid", tier: 4, colors: { body: "#CE93D8", accent: "#212121", dark: "#4A148C", glow: "#B71C1C" } },
  { id: "wizard",     name: "Wizard",        emoji: "🧙", cost: 13000, shape: "humanoid", tier: 4, colors: { body: "#7E57C2", accent: "#FDD835", dark: "#311B92", glow: "#7C4DFF" } },
  { id: "sabertooth", name: "Sabertooth",    emoji: "🐯", cost: 13500, shape: "round",   tier: 4, colors: { body: "#D2691E", accent: "#FFF9C4", dark: "#5D4037" } },
  { id: "knight",     name: "Knight",        emoji: "⚔️",  cost: 14000, shape: "humanoid", tier: 4, colors: { body: "#B0BEC5", accent: "#FDD835", dark: "#546E7A", glow: "#FFC107" } },
  { id: "minotaur",   name: "Minotaur",      emoji: "🐂", cost: 15000, shape: "humanoid", tier: 4, colors: { body: "#8D6E63", accent: "#D2691E", dark: "#4E342E" } },
  { id: "medusa",     name: "Medusa",        emoji: "🐍", cost: 16000, shape: "humanoid", tier: 4, colors: { body: "#4CAF50", accent: "#FDD835", dark: "#1B5E20", glow: "#76FF03" } },
  { id: "werewolf",   name: "Werewolf",      emoji: "🐺", cost: 17000, shape: "humanoid", tier: 4, colors: { body: "#757575", accent: "#E0E0E0", dark: "#212121" } },
  { id: "centaur",    name: "Centaur",       emoji: "🏹", cost: 18000, shape: "tall",    tier: 4, colors: { body: "#D2691E", accent: "#8D6E63", dark: "#5D4037" } },
  { id: "djinn",      name: "Djinn",         emoji: "🧞", cost: 19000, shape: "spooky",  tier: 4, colors: { body: "#7986CB", accent: "#FDD835", dark: "#283593", glow: "#536DFE" } },
  { id: "phoenix",    name: "Phoenix",       emoji: "🔥", cost: 20000, shape: "dragon",  tier: 4, colors: { body: "#FF6F00", accent: "#FFEB3B", dark: "#E65100", glow: "#FF3D00" } },
  { id: "astronaut",  name: "Astronaut",     emoji: "👨‍🚀", cost: 20000, shape: "humanoid", tier: 4, colors: { body: "#ECEFF1", accent: "#1565C0", dark: "#90A4AE", glow: "#40C4FF" } },
  { id: "kraken",     name: "Kraken",        emoji: "🐙", cost: 22000, shape: "blob",    tier: 4, colors: { body: "#1A237E", accent: "#7986CB", dark: "#0D0D3D", glow: "#3D5AFE" } },
  { id: "griffin",    name: "Griffin",       emoji: "🦅", cost: 23000, shape: "dragon",  tier: 4, colors: { body: "#FFA000", accent: "#FFFFFF", dark: "#E65100" } },
  { id: "leviathan",  name: "Leviathan",     emoji: "🐋", cost: 25000, shape: "wide",    tier: 4, colors: { body: "#0D1B5E", accent: "#1565C0", dark: "#050D2E", glow: "#2979FF" } },
  { id: "pirate",     name: "Pirate Captain", emoji: "🏴‍☠️", cost: 25000, shape: "humanoid", tier: 4, colors: { body: "#5D4037", accent: "#000000", dark: "#3E2723" } },
  { id: "hydra",      name: "Hydra",         emoji: "🐍", cost: 28000, shape: "dragon",  tier: 4, colors: { body: "#1B5E20", accent: "#4CAF50", dark: "#0A2E0D", glow: "#00E676" } },

  // ── TIER 5 · Ultra (25000 – 60000) ──────────────────────────────
  { id: "sigma",       name: "Sigma Wolf",    emoji: "🐺", cost: 30000, shape: "humanoid", tier: 5, colors: { body: "#37474F", accent: "#ECEFF1", dark: "#000000", glow: "#78909C" }, description: "He doesn't chase. He attracts." },
  { id: "gigachad",    name: "Gigachad",      emoji: "💪", cost: 30000, shape: "humanoid", tier: 5, colors: { body: "#9E9E9E", accent: "#ECEFF1", dark: "#37474F", glow: "#F5F5F5" }, description: "Yes." },
  { id: "skibidi",     name: "Skibidi Toilet", emoji: "🚽", cost: 30000, shape: "blocky", tier: 5, colors: { body: "#FFFFFF", accent: "#FFCC80", dark: "#795548", glow: "#FF6F00" }, description: "SIGMA SKIBIDI RIZZ" },
  { id: "nyan_cat",    name: "Nyan Cat",      emoji: "🌈", cost: 33333, shape: "wide",    tier: 5, colors: { body: "#9C27B0", accent: "#FF80AB", dark: "#4A148C", glow: "#EA80FC" }, description: "🎵 nyan nyan nyan" },
  { id: "cyber_dragon", name: "Cyber Dragon", emoji: "🐉", cost: 35000, shape: "dragon", tier: 5, colors: { body: "#00BCD4", accent: "#E040FB", dark: "#006064", glow: "#00E5FF" } },
  { id: "ice_wolf",    name: "Ice Wolf",      emoji: "🐺", cost: 37000, shape: "round",   tier: 5, colors: { body: "#B3E5FC", accent: "#ECEFF1", dark: "#01579B", glow: "#40C4FF" } },
  { id: "lava_bear",   name: "Lava Bear",     emoji: "🐻", cost: 38000, shape: "round",   tier: 5, colors: { body: "#BF360C", accent: "#FF6F00", dark: "#7F0000", glow: "#FF3D00" } },
  { id: "neon_robot",  name: "Neon Robot",    emoji: "🤖", cost: 40000, shape: "blocky",  tier: 5, colors: { body: "#212121", accent: "#00E676", dark: "#000000", glow: "#69F0AE" } },
  { id: "thunder_eagle", name: "Thunder Eagle", emoji: "⚡", cost: 42000, shape: "dragon", tier: 5, colors: { body: "#FDD835", accent: "#FFFFFF", dark: "#F57F17", glow: "#FFFF00" } },
  { id: "shadow_panther", name: "Shadow Panther", emoji: "🐆", cost: 45000, shape: "round", tier: 5, colors: { body: "#1A1A2E", accent: "#7B1FA2", dark: "#0D0D1A", glow: "#9C27B0" } },
  { id: "space_whale", name: "Space Whale",   emoji: "🐋", cost: 48000, shape: "wide",    tier: 5, colors: { body: "#1A237E", accent: "#E040FB", dark: "#0D0D3D", glow: "#7C4DFF" } },
  { id: "void_shark",  name: "Void Shark",    emoji: "🦈", cost: 52000, shape: "wide",    tier: 5, colors: { body: "#0D0D0D", accent: "#7986CB", dark: "#000000", glow: "#3D5AFE" } },
  { id: "golden_lion", name: "Golden Lion",   emoji: "🦁", cost: 55000, shape: "round",   tier: 5, colors: { body: "#FFD700", accent: "#FF8F00", dark: "#B8860B", glow: "#FFFF00" } },
  { id: "crystal_fox", name: "Crystal Fox",   emoji: "🦊", cost: 58000, shape: "round",   tier: 5, colors: { body: "#B2EBF2", accent: "#80DEEA", dark: "#006064", glow: "#00E5FF" } },
  { id: "lava_phoenix", name: "Lava Phoenix", emoji: "🔥", cost: 60000, shape: "dragon",  tier: 5, colors: { body: "#BF360C", accent: "#FF6F00", dark: "#7F0000", glow: "#FF3D00" } },

  // ── TIER 6 · LEGENDARY DIAMOND (65000 – 150000) ─────────────────
  { id: "diamond_cat",     name: "Diamond Cat",      emoji: "💎", cost: 65000,  shape: "crystal", tier: 6, colors: { body: "#B2EBF2", accent: "#FFFFFF", dark: "#00ACC1", glow: "#00E5FF" } },
  { id: "diamond_dog",     name: "Diamond Dog",      emoji: "💎", cost: 68000,  shape: "crystal", tier: 6, colors: { body: "#B3E5FC", accent: "#FFFFFF", dark: "#0288D1", glow: "#40C4FF" } },
  { id: "diamond_robot",   name: "Diamond Robot",    emoji: "💎", cost: 72000,  shape: "crystal", tier: 6, colors: { body: "#CFD8DC", accent: "#FFFFFF", dark: "#455A64", glow: "#B0BEC5" } },
  { id: "diamond_fox",     name: "Diamond Fox",      emoji: "💎", cost: 76000,  shape: "crystal", tier: 6, colors: { body: "#E1F5FE", accent: "#FFFFFF", dark: "#01579B", glow: "#00B0FF" } },
  { id: "diamond_penguin", name: "💎 Diamond Penguin", emoji: "💎", cost: 80000, shape: "crystal", tier: 6, colors: { body: "#E3F2FD", accent: "#FFFFFF", dark: "#1565C0", glow: "#448AFF" }, description: "The rarest buddy. Are you worthy?" },
  { id: "diamond_dragon",  name: "Diamond Dragon",   emoji: "💎", cost: 88000,  shape: "crystal", tier: 6, colors: { body: "#E8F5E9", accent: "#FFFFFF", dark: "#1B5E20", glow: "#69F0AE" } },
  { id: "diamond_unicorn", name: "Diamond Unicorn",  emoji: "💎", cost: 95000,  shape: "crystal", tier: 6, colors: { body: "#F3E5F5", accent: "#FFFFFF", dark: "#7B1FA2", glow: "#E040FB" } },
  { id: "crystal_phoenix", name: "Crystal Phoenix",  emoji: "💎", cost: 100000, shape: "crystal", tier: 6, colors: { body: "#FFF3E0", accent: "#FFFFFF", dark: "#E65100", glow: "#FF6D00" } },
  { id: "black_hole_cat",  name: "Black Hole Cat",   emoji: "🌑", cost: 120000, shape: "crystal", tier: 6, colors: { body: "#0A0A0A", accent: "#7C4DFF", dark: "#000000", glow: "#9C27B0" }, description: "It consumes everything." },
  { id: "god_unicorn",     name: "GOD Unicorn",      emoji: "✨", cost: 150000, shape: "crystal", tier: 6, colors: { body: "#FFFFFF", accent: "#FFD700", dark: "#9E9E9E", glow: "#FFFFFF" }, description: "You have achieved everything." },
];

// Legacy-compatible PETS_CATALOG (subset)
export const PETS_CATALOG = BUDDIES_CATALOG;

export const ACCESSORIES_CATALOG: PetAccessory[] = [
  { id: "hat_cowboy",    type: "hat",     name: "Cowboy Hat",   emoji: "🤠", cost: 30  },
  { id: "hat_party",     type: "hat",     name: "Party Hat",    emoji: "🎉", cost: 25  },
  { id: "bow_red",       type: "bow",     name: "Red Bow",      emoji: "🎀", cost: 20  },
  { id: "glasses_cool",  type: "glasses", name: "Cool Glasses", emoji: "😎", cost: 35  },
  { id: "crown_gold",    type: "crown",   name: "Gold Crown",   emoji: "👑", cost: 80  },
  { id: "scarf_winter",  type: "scarf",   name: "Winter Scarf", emoji: "🧣", cost: 25  },
  { id: "hat_wizard",    type: "hat",     name: "Wizard Hat",   emoji: "🧙", cost: 60  },
  { id: "glasses_heart", type: "glasses", name: "Heart Glasses", emoji: "🥰", cost: 40 },
];

export const TIER_COLORS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Starter",   color: "#9E9E9E", bg: "rgba(158,158,158,0.12)" },
  2: { label: "Cool",      color: "#4CAF50", bg: "rgba(76,175,80,0.12)" },
  3: { label: "Epic",      color: "#2196F3", bg: "rgba(33,150,243,0.12)" },
  4: { label: "Legendary", color: "#9C27B0", bg: "rgba(156,39,176,0.12)" },
  5: { label: "Ultra",     color: "#FF5722", bg: "rgba(255,87,34,0.12)" },
  6: { label: "Diamond",   color: "#00BCD4", bg: "rgba(0,188,212,0.15)" },
};
