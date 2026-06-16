export type Language = "nl" | "en";

export type GoalCategory =
  | "fitness"
  | "money"
  | "consistency"
  | "school"
  | "mindset"
  | "relationships"
  | "creativity"
  | "health";

export type Priority = "low" | "medium" | "high";

export type RecurrenceType =
  | "none"
  | "daily"
  | "weekdays"
  | "weekends"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "custom";

export interface RecurrenceRule {
  type: RecurrenceType;
  customDays?: number[]; // 0=Sun, 1=Mon, ...
  interval?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: GoalCategory;
  recurrence: RecurrenceRule;
  startDate: string; // ISO date YYYY-MM-DD
  endDate?: string;
  estimatedMinutes?: number;
  goalId?: string;
  createdAt: string;
}

export interface TaskCompletion {
  taskId: string;
  date: string; // YYYY-MM-DD
  completedAt: string;
  coinsEarned: number;
}

export interface Goal {
  id: string;
  category: GoalCategory;
  title: string;
  description?: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  targetDate?: string;
  createdAt: string;
  progress: number; // 0-100
}

export type PetSpecies = "cat" | "dog" | "rabbit" | "dragon" | "fox" | "owl" | "bear" | "panda";

export type AccessoryType = "hat" | "bow" | "glasses" | "scarf" | "crown";

export interface PetAccessory {
  id: string;
  type: AccessoryType;
  name: string;
  emoji: string;
  cost: number;
}

export interface Pet {
  id: string;
  species: PetSpecies;
  name: string;
  emoji: string;
  cost: number;
  purchasedAt?: string;
  equippedAccessories: string[]; // accessory ids
  level: number;
  xp: number;
}

export interface UserProfile {
  id: string;
  name: string;
  language: Language;
  goals: GoalCategory[];
  bomCoins: number;
  totalTasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  onboardingCompleted: boolean;
  activePetId?: string;
  ownedPetIds: string[];
  ownedAccessoryIds: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
