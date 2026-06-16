import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  UserProfile,
  Task,
  TaskCompletion,
  Goal,
  Pet,
  PetAccessory,
  ChatMessage,
  GoalCategory,
  Language,
} from "./types";
import { format } from "date-fns";
import { PETS_CATALOG, ACCESSORIES_CATALOG } from "./catalog";

interface AppState {
  user: UserProfile | null;
  tasks: Task[];
  completions: TaskCompletion[];
  goals: Goal[];
  pets: Pet[];
  chatHistory: ChatMessage[];
  selectedDate: string;

  // User actions
  initUser: (name: string, language: Language, goalCategories: GoalCategory[]) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;

  // Task actions
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (taskId: string, date: string) => void;
  uncompleteTask: (taskId: string, date: string) => void;
  isTaskCompleted: (taskId: string, date: string) => boolean;

  // Goal actions
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "progress">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Pet actions
  buyPet: (petId: string) => boolean;
  buyAccessory: (accessoryId: string) => boolean;
  equipAccessory: (petId: string, accessoryId: string) => void;
  unequipAccessory: (petId: string, accessoryId: string) => void;
  setActivePet: (petId: string) => void;
  namePet: (petId: string, name: string) => void;

  // Chat actions
  addChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChat: () => void;

  // Calendar
  setSelectedDate: (date: string) => void;

  // Streak
  checkAndUpdateStreak: () => void;
}

const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const COINS_PER_TASK: Record<string, number> = {
  low: 5,
  medium: 10,
  high: 20,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      tasks: [],
      completions: [],
      goals: [],
      pets: [],
      chatHistory: [],
      selectedDate: format(new Date(), "yyyy-MM-dd"),

      initUser: (name, language, goalCategories) => {
        const user: UserProfile = {
          id: generateId(),
          name,
          language,
          goals: goalCategories,
          bomCoins: 50, // welcome bonus
          totalTasksCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: format(new Date(), "yyyy-MM-dd"),
          onboardingCompleted: true,
          ownedPetIds: [],
          ownedAccessoryIds: [],
          createdAt: new Date().toISOString(),
        };
        set({ user });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      addCoins: (amount) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, bomCoins: state.user.bomCoins + amount }
            : null,
        })),

      spendCoins: (amount) => {
        const { user } = get();
        if (!user || user.bomCoins < amount) return false;
        set({ user: { ...user, bomCoins: user.bomCoins - amount } });
        return true;
      },

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          completions: state.completions.filter((c) => c.taskId !== id),
        })),

      completeTask: (taskId, date) => {
        const { completions, tasks, user } = get();
        if (completions.some((c) => c.taskId === taskId && c.date === date)) return;
        const task = tasks.find((t) => t.id === taskId);
        const coinsEarned = task ? COINS_PER_TASK[task.priority] || 10 : 10;
        const completion: TaskCompletion = {
          taskId,
          date,
          completedAt: new Date().toISOString(),
          coinsEarned,
        };
        set((state) => ({
          completions: [...state.completions, completion],
          user: state.user
            ? {
                ...state.user,
                bomCoins: state.user.bomCoins + coinsEarned,
                totalTasksCompleted: state.user.totalTasksCompleted + 1,
              }
            : null,
        }));
        get().checkAndUpdateStreak();
      },

      uncompleteTask: (taskId, date) => {
        const completion = get().completions.find(
          (c) => c.taskId === taskId && c.date === date
        );
        if (!completion) return;
        set((state) => ({
          completions: state.completions.filter(
            (c) => !(c.taskId === taskId && c.date === date)
          ),
          user: state.user
            ? {
                ...state.user,
                bomCoins: Math.max(0, state.user.bomCoins - completion.coinsEarned),
                totalTasksCompleted: Math.max(0, state.user.totalTasksCompleted - 1),
              }
            : null,
        }));
      },

      isTaskCompleted: (taskId, date) =>
        get().completions.some((c) => c.taskId === taskId && c.date === date),

      addGoal: (goal) => {
        const newGoal: Goal = {
          ...goal,
          id: generateId(),
          createdAt: new Date().toISOString(),
          progress: 0,
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),

      deleteGoal: (id) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

      buyPet: (petId) => {
        const { user, spendCoins } = get();
        if (!user) return false;
        const catalogPet = PETS_CATALOG.find((p) => p.id === petId);
        if (!catalogPet) return false;
        if (user.ownedPetIds.includes(petId)) return false;
        if (!spendCoins(catalogPet.cost)) return false;
        const pet: Pet = {
          ...catalogPet,
          purchasedAt: new Date().toISOString(),
          equippedAccessories: [],
          level: 1,
          xp: 0,
        };
        set((state) => ({
          pets: [...state.pets, pet],
          user: state.user
            ? {
                ...state.user,
                ownedPetIds: [...state.user.ownedPetIds, petId],
                activePetId: state.user.activePetId ?? petId,
              }
            : null,
        }));
        return true;
      },

      buyAccessory: (accessoryId) => {
        const { user, spendCoins } = get();
        if (!user) return false;
        if (user.ownedAccessoryIds.includes(accessoryId)) return false;
        const accessory = ACCESSORIES_CATALOG.find((a) => a.id === accessoryId);
        if (!accessory) return false;
        if (!spendCoins(accessory.cost)) return false;
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ownedAccessoryIds: [...state.user.ownedAccessoryIds, accessoryId],
              }
            : null,
        }));
        return true;
      },

      equipAccessory: (petId, accessoryId) =>
        set((state) => ({
          pets: state.pets.map((p) =>
            p.id === petId && !p.equippedAccessories.includes(accessoryId)
              ? { ...p, equippedAccessories: [...p.equippedAccessories, accessoryId] }
              : p
          ),
        })),

      unequipAccessory: (petId, accessoryId) =>
        set((state) => ({
          pets: state.pets.map((p) =>
            p.id === petId
              ? {
                  ...p,
                  equippedAccessories: p.equippedAccessories.filter(
                    (id) => id !== accessoryId
                  ),
                }
              : p
          ),
        })),

      setActivePet: (petId) =>
        set((state) => ({
          user: state.user ? { ...state.user, activePetId: petId } : null,
        })),

      namePet: (petId, name) =>
        set((state) => ({
          pets: state.pets.map((p) => (p.id === petId ? { ...p, name } : p)),
        })),

      addChatMessage: (msg) => {
        const message: ChatMessage = {
          ...msg,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ chatHistory: [...state.chatHistory, message] }));
      },

      clearChat: () => set({ chatHistory: [] }),

      setSelectedDate: (date) => set({ selectedDate: date }),

      checkAndUpdateStreak: () => {
        const { user, completions } = get();
        if (!user) return;
        const today = format(new Date(), "yyyy-MM-dd");
        const yesterday = format(
          new Date(Date.now() - 86400000),
          "yyyy-MM-dd"
        );
        const todayHasCompletion = completions.some((c) => c.date === today);
        if (!todayHasCompletion) return;

        let newStreak = user.currentStreak;
        if (user.lastActiveDate === yesterday) {
          newStreak = user.currentStreak + 1;
        } else if (user.lastActiveDate !== today) {
          newStreak = 1;
        }
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, state.user.longestStreak),
                lastActiveDate: today,
              }
            : null,
        }));
      },
    }),
    {
      name: "bestofme-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage)
      ),
    }
  )
);
