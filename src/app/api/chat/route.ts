import { NextRequest } from "next/server";
import { parseTaskFromText } from "@/lib/nlp";

type Lang = "nl" | "en";

// ── Keyword responses ────────────────────────────────────────

const RULES: { keywords: string[]; response: Record<Lang, string> }[] = [
  {
    keywords: ["smart", "doel stellen", "set goal", "goal setting", "doelen stellen"],
    response: {
      nl: `Om een SMART doel te stellen, heb ik 5 antwoorden nodig:\n\n1. Wat wil je bereiken? (Specifiek)\n2. Hoe meet je of het lukt? (Meetbaar)\n3. Is het haalbaar voor jou? (Haalbaar)\n4. Waarom is dit belangrijk? (Relevant)\n5. Wanneer wil je het bereikt hebben? (Tijdgebonden)\n\nBegin gewoon — vertel me je doel en ik stel de vragen.`,
      en: `To set a SMART goal, I need 5 answers:\n\n1. What do you want to achieve? (Specific)\n2. How will you measure it? (Measurable)\n3. Is it achievable for you? (Achievable)\n4. Why does it matter? (Relevant)\n5. By when? (Time-bound)\n\nJust start — tell me your goal and I'll ask the questions.`,
    },
  },
  {
    keywords: ["gemotiveerd", "motivatie", "motivated", "motivation", "motiveren", "volhouden", "keep going"],
    response: {
      nl: `Motivatie is onbetrouwbaar. Discipline is een systeem.\n\nDrie dingen die écht werken:\n\n1. Maak het kleiner. Begin met 2 minuten. Serieus.\n2. Koppel het aan iets wat je al doet. Na koffie → 10 push-ups.\n3. Maak stoppen moeilijker dan doorgaan. Leg je sportkleren klaar.\n\nWat is het doel waar je moeite mee hebt? Dan zoeken we samen een systeem.`,
      en: `Motivation is unreliable. Discipline is a system.\n\nThree things that actually work:\n\n1. Make it smaller. Start with 2 minutes. Seriously.\n2. Attach it to something you already do. After coffee → 10 push-ups.\n3. Make stopping harder than continuing. Lay out your workout clothes.\n\nWhat's the goal you're struggling with? Let's find a system together.`,
    },
  },
  {
    keywords: ["stress", "angst", "anxiety", "overwhelmed", "overweldigd", "te veel", "too much"],
    response: {
      nl: `Stop even. Adem in voor 4 tellen, vasthouden voor 4, uit voor 4. Herhaal dat 3 keer.\n\nKlaar? Schrijf nu alles op wat je hoofd bezighoudt. Alles eruit. Je hoofd is geen opbergplaats.\n\nDan kies je één ding — het kleinste eerste stapje. Niet alles. Één ding.\n\nWat houdt je nu het meest bezig?`,
      en: `Stop for a second. Breathe in for 4 counts, hold for 4, out for 4. Repeat 3 times.\n\nDone? Now write down everything on your mind. Get it all out. Your head is not storage.\n\nThen pick one thing — the smallest first step. Not everything. One thing.\n\nWhat's weighing on you most right now?`,
    },
  },
  {
    keywords: ["consistenter", "consistent zijn", "be consistent", "gewoonte", "habit"],
    response: {
      nl: `Consistentie komt niet van wilskracht — het komt van systemen.\n\nDe 2-dag regel: mis nooit 2 dagen op rij. Eén dag missen is menselijk. Twee dagen wordt een patroon.\n\nIdentiteit helpt ook: zeg niet "ik probeer elke dag te sporten". Zeg "ik ben iemand die sport". Klein verschil, groot effect.\n\nWat wil je consistenter doen? Ik zet het in je kalender.`,
      en: `Consistency doesn't come from willpower — it comes from systems.\n\nThe 2-day rule: never miss 2 days in a row. Missing one day is human. Two days becomes a pattern.\n\nIdentity helps too: don't say "I'm trying to work out daily." Say "I'm someone who works out." Small difference, big effect.\n\nWhat do you want to be more consistent with? I'll add it to your calendar.`,
    },
  },
];

const TASK_CONFIRM: Record<Lang, (title: string, rec: string) => string> = {
  nl: (title, rec) =>
    `Ik heb dit herkend als taak:\n\n"${title}" — ${rec}\n\nKlopt dit? Je kunt de naam, herhaling en prioriteit hieronder aanpassen voordat je hem toevoegt.`,
  en: (title, rec) =>
    `I detected this as a task:\n\n"${title}" — ${rec}\n\nDoes that look right? You can adjust the name, recurrence and priority below before adding it.`,
};

const FALLBACK: Record<Lang, string[]> = {
  nl: [
    "Vertel me meer. Wat wil je bereiken, en waarom is het voor jou moeilijk om dat consistent te doen?",
    "Interessant. Wat houdt je tegen om dit nu al te doen?",
    "Goed dat je dit aanpakt. Wat is het eerste concrete stapje dat je morgen kunt zetten?",
    "Ik begrijp het. Wil je dat ik dit als dagelijkse taak in je kalender zet?",
  ],
  en: [
    "Tell me more. What do you want to achieve, and why is it hard to do it consistently?",
    "Interesting. What's stopping you from doing this already?",
    "Good that you're tackling this. What's the first concrete step you can take tomorrow?",
    "I understand. Do you want me to add this as a daily task to your calendar?",
  ],
};

const REC_LABELS: Record<Lang, Record<string, string>> = {
  nl: {
    daily: "dagelijks", weekdays: "weekdagen", weekends: "weekend",
    weekly: "wekelijks", biweekly: "om de 2 weken", monthly: "maandelijks",
    custom: "aangepast", none: "eenmalig",
  },
  en: {
    daily: "daily", weekdays: "weekdays", weekends: "weekends",
    weekly: "weekly", biweekly: "every 2 weeks", monthly: "monthly",
    custom: "custom", none: "one-time",
  },
};

function detectLang(text: string): Lang {
  const nl = ["ik", "de", "het", "een", "en", "van", "in", "is", "dat", "op", "te", "wat", "hoe", "kan", "wil", "mijn", "voor", "met", "zijn", "maar", "weet", "doe", "elke", "dag"];
  const words = text.toLowerCase().split(/\s+/);
  return words.filter((w) => nl.includes(w)).length >= 1 ? "nl" : "en";
}

// ── Route handler ────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json();
    const lastMsg: string = messages.filter((m: { role: string }) => m.role === "user").pop()?.content ?? "";
    const lang: Lang = (language as Lang) ?? detectLang(lastMsg);

    // 1. Try to detect a task in the message
    const nlp = parseTaskFromText(lastMsg);

    if (nlp.task && nlp.confidence > 0.7) {
      const recLabel = REC_LABELS[lang][nlp.task.recurrenceType] ?? nlp.task.recurrenceType;
      const responseText = TASK_CONFIRM[lang](nlp.task.title, recLabel);

      await new Promise((r) => setTimeout(r, 350 + Math.random() * 300));
      return Response.json({ message: responseText, taskSuggestion: nlp.task });
    }

    // 2. Keyword-based response
    const lower = lastMsg.toLowerCase();
    for (const rule of RULES) {
      if (rule.keywords.some((kw) => lower.includes(kw))) {
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
        return Response.json({ message: rule.response[lang], taskSuggestion: null });
      }
    }

    // 3. Fallback
    const fb = FALLBACK[lang];
    const response = fb[Math.floor(Math.random() * fb.length)];
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
    return Response.json({ message: response, taskSuggestion: null });

  } catch {
    return Response.json({ message: "Probeer het opnieuw / Try again." }, { status: 500 });
  }
}
