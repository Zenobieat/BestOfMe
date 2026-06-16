import { Language } from "./types";

type TranslationKey =
  | "app_name"
  | "tagline"
  | "welcome"
  | "whats_your_name"
  | "choose_language"
  | "choose_goals"
  | "goal_fitness"
  | "goal_money"
  | "goal_consistency"
  | "goal_school"
  | "goal_mindset"
  | "goal_relationships"
  | "goal_creativity"
  | "goal_health"
  | "next"
  | "back"
  | "finish"
  | "dashboard"
  | "calendar"
  | "tasks"
  | "pets"
  | "ai_coach"
  | "today"
  | "add_task"
  | "no_tasks_today"
  | "complete"
  | "completed"
  | "streak"
  | "days"
  | "bom_coins"
  | "buy"
  | "owned"
  | "equip"
  | "unequip"
  | "accessories"
  | "your_pets"
  | "shop"
  | "ask_anything"
  | "smart_goals"
  | "set_goal"
  | "priority_low"
  | "priority_medium"
  | "priority_high"
  | "recurrence_none"
  | "recurrence_daily"
  | "recurrence_weekdays"
  | "recurrence_weekends"
  | "recurrence_weekly"
  | "recurrence_biweekly"
  | "recurrence_monthly"
  | "recurrence_custom"
  | "delete"
  | "edit"
  | "save"
  | "cancel"
  | "title"
  | "description"
  | "category"
  | "start_date"
  | "end_date"
  | "mascot_greeting"
  | "mascot_motivate"
  | "mascot_streak"
  | "well_done"
  | "keep_going"
  | "name_pet"
  | "settings"
  | "total_completed"
  | "longest_streak"
  | "goals"
  | "specific"
  | "measurable"
  | "achievable"
  | "relevant"
  | "time_bound"
  | "send"
  | "thinking"
  | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  | "active_pet"
  | "no_pet_yet"
  | "rename"
  | "progress"
  | "coins_earned"
  | "welcome_bonus"
  | "estimated_time"
  | "minutes";

const translations: Record<Language, Record<TranslationKey, string>> = {
  nl: {
    app_name: "BestOfMe",
    tagline: "Word de beste versie van jezelf",
    welcome: "Welkom bij BestOfMe! 🚀",
    whats_your_name: "Hoe mag ik je noemen?",
    choose_language: "Kies je taal",
    choose_goals: "Wat zijn je belangrijkste doelen?",
    goal_fitness: "Fitness & Sport",
    goal_money: "Geld & Financiën",
    goal_consistency: "Consistent zijn",
    goal_school: "School & Studie",
    goal_mindset: "Mindset & Mentaal",
    goal_relationships: "Relaties & Sociaal",
    goal_creativity: "Creativiteit",
    goal_health: "Gezondheid",
    next: "Volgende",
    back: "Terug",
    finish: "Start met BestOfMe!",
    dashboard: "Dashboard",
    calendar: "Kalender",
    tasks: "Taken",
    pets: "Dieren",
    ai_coach: "AI Coach",
    today: "Vandaag",
    add_task: "Taak toevoegen",
    no_tasks_today: "Geen taken voor vandaag. Voeg er een toe!",
    complete: "Voltooien",
    completed: "Voltooid",
    streak: "Streak",
    days: "dagen",
    bom_coins: "BOM-Coins",
    buy: "Kopen",
    owned: "Eigendom",
    equip: "Aandoen",
    unequip: "Uittrekken",
    accessories: "Accessoires",
    your_pets: "Jouw dieren",
    shop: "Winkel",
    ask_anything: "Stel een vraag...",
    smart_goals: "SMART Doelen",
    set_goal: "Doel instellen",
    priority_low: "Laag",
    priority_medium: "Gemiddeld",
    priority_high: "Hoog",
    recurrence_none: "Eénmalig",
    recurrence_daily: "Dagelijks",
    recurrence_weekdays: "Doordeweeks",
    recurrence_weekends: "Weekend",
    recurrence_weekly: "Wekelijks",
    recurrence_biweekly: "Om de 2 weken",
    recurrence_monthly: "Maandelijks",
    recurrence_custom: "Aangepast",
    delete: "Verwijderen",
    edit: "Bewerken",
    save: "Opslaan",
    cancel: "Annuleren",
    title: "Titel",
    description: "Beschrijving",
    category: "Categorie",
    start_date: "Startdatum",
    end_date: "Einddatum",
    mascot_greeting: "Hey {name}! Klaar voor vandaag?",
    mascot_motivate: "Elke stap brengt je dichter bij je doel!",
    mascot_streak: "{n} dagen op rij! Geweldig bezig! 🔥",
    well_done: "Goed gedaan!",
    keep_going: "Ga zo door!",
    name_pet: "Geef je dier een naam",
    settings: "Instellingen",
    total_completed: "Totaal voltooid",
    longest_streak: "Langste streak",
    goals: "Doelen",
    specific: "Specifiek",
    measurable: "Meetbaar",
    achievable: "Haalbaar",
    relevant: "Relevant",
    time_bound: "Tijdsgebonden",
    send: "Versturen",
    thinking: "Nadenken...",
    monday: "Ma",
    tuesday: "Di",
    wednesday: "Wo",
    thursday: "Do",
    friday: "Vr",
    saturday: "Za",
    sunday: "Zo",
    active_pet: "Actief dier",
    no_pet_yet: "Koop je eerste dier in de winkel!",
    rename: "Hernoemen",
    progress: "Voortgang",
    coins_earned: "Coins verdiend",
    welcome_bonus: "Welkomstbonus",
    estimated_time: "Geschatte tijd",
    minutes: "min",
  },
  en: {
    app_name: "BestOfMe",
    tagline: "Become the best version of yourself",
    welcome: "Welcome to BestOfMe! 🚀",
    whats_your_name: "What should I call you?",
    choose_language: "Choose your language",
    choose_goals: "What are your main goals?",
    goal_fitness: "Fitness & Sports",
    goal_money: "Money & Finance",
    goal_consistency: "Being Consistent",
    goal_school: "School & Study",
    goal_mindset: "Mindset & Mental",
    goal_relationships: "Relationships & Social",
    goal_creativity: "Creativity",
    goal_health: "Health",
    next: "Next",
    back: "Back",
    finish: "Start BestOfMe!",
    dashboard: "Dashboard",
    calendar: "Calendar",
    tasks: "Tasks",
    pets: "Pets",
    ai_coach: "AI Coach",
    today: "Today",
    add_task: "Add task",
    no_tasks_today: "No tasks for today. Add one!",
    complete: "Complete",
    completed: "Completed",
    streak: "Streak",
    days: "days",
    bom_coins: "BOM-Coins",
    buy: "Buy",
    owned: "Owned",
    equip: "Equip",
    unequip: "Unequip",
    accessories: "Accessories",
    your_pets: "Your Pets",
    shop: "Shop",
    ask_anything: "Ask anything...",
    smart_goals: "SMART Goals",
    set_goal: "Set Goal",
    priority_low: "Low",
    priority_medium: "Medium",
    priority_high: "High",
    recurrence_none: "One-time",
    recurrence_daily: "Daily",
    recurrence_weekdays: "Weekdays",
    recurrence_weekends: "Weekends",
    recurrence_weekly: "Weekly",
    recurrence_biweekly: "Every 2 weeks",
    recurrence_monthly: "Monthly",
    recurrence_custom: "Custom",
    delete: "Delete",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    title: "Title",
    description: "Description",
    category: "Category",
    start_date: "Start date",
    end_date: "End date",
    mascot_greeting: "Hey {name}! Ready for today?",
    mascot_motivate: "Every step brings you closer to your goal!",
    mascot_streak: "{n} days in a row! Amazing! 🔥",
    well_done: "Well done!",
    keep_going: "Keep going!",
    name_pet: "Name your pet",
    settings: "Settings",
    total_completed: "Total completed",
    longest_streak: "Longest streak",
    goals: "Goals",
    specific: "Specific",
    measurable: "Measurable",
    achievable: "Achievable",
    relevant: "Relevant",
    time_bound: "Time-bound",
    send: "Send",
    thinking: "Thinking...",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
    active_pet: "Active pet",
    no_pet_yet: "Buy your first pet in the shop!",
    rename: "Rename",
    progress: "Progress",
    coins_earned: "Coins earned",
    welcome_bonus: "Welcome bonus",
    estimated_time: "Estimated time",
    minutes: "min",
  },
};

export function t(key: TranslationKey, lang: Language, vars?: Record<string, string | number>): string {
  let str = translations[lang][key] ?? translations["en"][key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v));
    });
  }
  return str;
}

export function useT(lang: Language) {
  return (key: TranslationKey, vars?: Record<string, string | number>) => t(key, lang, vars);
}
