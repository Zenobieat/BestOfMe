import { Task, Priority, GoalCategory, RecurrenceType } from "./types";
import { format } from "date-fns";

export interface ParsedTask {
  title: string;
  priority: Priority;
  category: GoalCategory;
  recurrenceType: RecurrenceType;
  customDays?: number[];
  estimatedMinutes?: number;
  startDate: string;
}

interface NLPResult {
  task: ParsedTask | null;
  confidence: number;
  explanation: string;
}

// ── Keyword maps ─────────────────────────────────────────────

const RECURRENCE_PATTERNS: { pattern: RegExp; type: RecurrenceType; days?: number[] }[] = [
  { pattern: /elke dag|dagelijks|every day|daily/i, type: "daily" },
  { pattern: /elke ochtend|every morning|'s ochtends|elke morgen/i, type: "daily" },
  { pattern: /elke avond|every evening|'s avonds|elke nacht|every night/i, type: "daily" },
  { pattern: /weekdagen|doordeweeks|weekdays|mon.*fri/i, type: "weekdays" },
  { pattern: /weekend/i, type: "weekends" },
  { pattern: /wekelijks|elke week|every week|weekly/i, type: "weekly" },
  { pattern: /om de twee? weken|bi.?weekly|every two weeks|tweewekelijks/i, type: "biweekly" },
  { pattern: /maandelijks|elke maand|monthly|every month/i, type: "monthly" },
  {
    pattern: /elke maandag|every monday|op maandag/i,
    type: "custom", days: [1],
  },
  {
    pattern: /elke dinsdag|every tuesday|op dinsdag/i,
    type: "custom", days: [2],
  },
  {
    pattern: /elke woensdag|every wednesday|op woensdag/i,
    type: "custom", days: [3],
  },
  {
    pattern: /elke donderdag|every thursday|op donderdag/i,
    type: "custom", days: [4],
  },
  {
    pattern: /elke vrijdag|every friday|op vrijdag/i,
    type: "custom", days: [5],
  },
  {
    pattern: /elke zaterdag|every saturday|op zaterdag/i,
    type: "custom", days: [6],
  },
  {
    pattern: /elke zondag|every sunday|op zondag/i,
    type: "custom", days: [0],
  },
];

const CATEGORY_HINTS: { pattern: RegExp; category: GoalCategory }[] = [
  { pattern: /push.?up|sit.?up|squat|sport|gym|workout|fitness|lopen|run|zwem|fiet|train/i, category: "fitness" },
  { pattern: /geld|sparen|budget|invest|financ|inkomen|betalen|money|save|earn/i, category: "money" },
  { pattern: /school|studie|study|leren|leer|exam|cursus|boek|read|lees/i, category: "school" },
  { pattern: /mediteer|meditat|mindful|ademen|breath|rust|relax|kalm/i, category: "mindset" },
  { pattern: /gezond|health|eten|dieet|diet|water|slaap|sleep|vitamine/i, category: "health" },
  { pattern: /teken|schrijf|creat|kunst|art|muziek|music|speel|design/i, category: "creativity" },
  { pattern: /bel|bezoek|vriend|familie|friend|family|social|date/i, category: "relationships" },
];

const PRIORITY_HINTS: { pattern: RegExp; priority: Priority }[] = [
  { pattern: /urgent|kritiek|critical|hoog|high|must|dringend/i, priority: "high" },
  { pattern: /laag|low|optioneel|optional|als ik tijd|if i have time/i, priority: "low" },
];

const DURATION_PATTERN = /(\d+)\s*(minuten?|min|uur|hours?|h\b)/i;
const NUMBER_PATTERN = /(\d+)\s*(keer|times?|reps?|x\b)/i;

// ── Intent detection ─────────────────────────────────────────

const TASK_INTENT_PATTERNS = [
  /ik wil (.+) doen/i,
  /i want to (.+)/i,
  /zet (.+) in (de kalender|mijn agenda|mijn taken)/i,
  /add (.+) to (my )?(calendar|tasks|schedule)/i,
  /voeg (.+) toe/i,
  /herinner me (om )?(.+)/i,
  /remind me (to )?(.+)/i,
  /ik ga (.+) doen/i,
  /i('m| am) going to (.+)/i,
  /maak een taak voor (.+)/i,
  /create a? task (for )?(.+)/i,
  /plan (.+) (in|voor|for)/i,
  /stel (.+) in/i,
  /ik moet (.+)/i,
  /i need to (.+)/i,
  /ik wil (.+)/i,
];

function detectTaskIntent(text: string): boolean {
  return TASK_INTENT_PATTERNS.some((p) => p.test(text));
}

function extractTitle(text: string): string {
  // Remove time/frequency words and clean up
  let t = text
    .replace(/elke (dag|avond|ochtend|week|maand|maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)/gi, "")
    .replace(/every (day|evening|morning|week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, "")
    .replace(/dagelijks|daily|wekelijks|weekly|maandelijks|monthly/gi, "")
    .replace(/(\d+)\s*(minuten?|min|uur|hours?)/gi, "")
    .replace(/ik wil|i want to|ik ga|i'm going to|ik moet|i need to|maak een taak voor|create a? task for|voeg toe|add to calendar|zet in de kalender/gi, "")
    .replace(/in de kalender|in mijn agenda|to my calendar|to the calendar/gi, "")
    .replace(/'s (ochtends|avonds)|in the (morning|evening)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Capitalize first letter
  if (t.length > 0) t = t[0].toUpperCase() + t.slice(1);
  return t || text.trim();
}

// ── Main parser ───────────────────────────────────────────────

export function parseTaskFromText(text: string): NLPResult {
  const hasIntent = detectTaskIntent(text);

  // Also detect implicit task creation (contains action + frequency)
  const hasFrequency = RECURRENCE_PATTERNS.some((r) => r.pattern.test(text));
  const hasAction = /\b(doen|maken|lopen|sporten|lezen|studeren|mediteren|schrijven|oefenen|do|make|run|workout|read|study|meditate|write|practice|push.?up|sit.?up|squat)\b/i.test(text);

  if (!hasIntent && !(hasFrequency && hasAction)) {
    return { task: null, confidence: 0, explanation: "" };
  }

  // Detect recurrence
  let recurrenceType: RecurrenceType = "daily";
  let customDays: number[] | undefined;
  for (const { pattern, type, days } of RECURRENCE_PATTERNS) {
    if (pattern.test(text)) {
      recurrenceType = type;
      customDays = days;
      break;
    }
  }

  // Detect category
  let category: GoalCategory = "consistency";
  for (const { pattern, category: cat } of CATEGORY_HINTS) {
    if (pattern.test(text)) { category = cat; break; }
  }

  // Detect priority
  let priority: Priority = "medium";
  for (const { pattern, priority: p } of PRIORITY_HINTS) {
    if (pattern.test(text)) { priority = p; break; }
  }

  // Detect duration
  let estimatedMinutes: number | undefined;
  const durMatch = text.match(DURATION_PATTERN);
  if (durMatch) {
    const val = parseInt(durMatch[1]);
    const unit = durMatch[2].toLowerCase();
    estimatedMinutes = unit.startsWith("u") || unit.startsWith("h") ? val * 60 : val;
  }

  // Build title
  const title = extractTitle(text);

  // Add reps/count to title if present
  const numMatch = text.match(NUMBER_PATTERN);
  let finalTitle = title;
  if (numMatch && !title.includes(numMatch[1])) {
    finalTitle = `${numMatch[1]}x ${title}`;
  }

  // Check for specific numbers like "25 push-ups"
  const specificNum = text.match(/(\d+)\s+(push.?ups?|sit.?ups?|squats?|reps?)/i);
  if (specificNum && !finalTitle.includes(specificNum[1])) {
    finalTitle = `${specificNum[1]} ${specificNum[2]}`;
    finalTitle = finalTitle[0].toUpperCase() + finalTitle.slice(1);
  }

  const task: ParsedTask = {
    title: finalTitle,
    priority,
    category,
    recurrenceType,
    customDays,
    estimatedMinutes,
    startDate: format(new Date(), "yyyy-MM-dd"),
  };

  const recLabel: Record<RecurrenceType, string> = {
    daily: "dagelijks", weekdays: "weekdagen", weekends: "weekend",
    weekly: "wekelijks", biweekly: "om de 2 weken", monthly: "maandelijks",
    custom: "op aangepaste dagen", none: "eenmalig",
  };

  return {
    task,
    confidence: 0.85,
    explanation: `Taak herkend: "${finalTitle}" — ${recLabel[recurrenceType]}`,
  };
}
