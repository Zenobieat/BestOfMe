import { NextRequest } from "next/server";
import { parseTaskFromText } from "@/lib/nlp";

type Lang = "nl" | "en";

interface Rule {
  keywords: string[];
  response: Record<Lang, string>;
}

const RULES: Rule[] = [
  {
    keywords: ["smart", "doel stellen", "set goal", "goal setting", "doelen stellen"],
    response: {
      nl: `Laten we een SMART doel opstellen.

S — Specifiek: Wat wil je precies bereiken? Niet "fitter worden" maar "3x per week 30 min sporten".

M — Meetbaar: Hoe meet je je voortgang? Kilo, km, punten, dagen.

A — Haalbaar: Is het realistisch met je huidige leven?

R — Relevant: Waarom is dit doel belangrijk voor jou?

T — Tijdgebonden: Wanneer wil je dit bereiken?

Zeg me gewoon je doel — ik stel het automatisch in als taak.`,
      en: `Let's create a SMART goal.

S — Specific: What exactly do you want to achieve? Not "get fit" but "work out 3x a week for 30 min".

M — Measurable: How will you track progress? kg, km, points, days.

A — Achievable: Is it realistic with your current life?

R — Relevant: Why does this goal matter to you?

T — Time-bound: When do you want to achieve this?

Just tell me your goal — I'll automatically add it as a task.`,
    },
  },
  {
    keywords: ["gemotiveerd", "motivatie", "motivated", "motivation", "motiveren"],
    response: {
      nl: `Motivatie komt en gaat. Discipline blijft.

Drie dingen die werken:

1. Maak het klein. Begin met 2 minuten. 2 minuten sporten is beter dan nul minuten.
2. Koppel het aan iets. Na je koffie — 10 push-ups. Routine creëert automatisme.
3. Track je streak. Breek hem niet. Dat gevoel is krachtiger dan motivatie.

Je hoeft je niet goed te voelen om te beginnen. Begin gewoon.`,
      en: `Motivation comes and goes. Discipline stays.

Three things that work:

1. Make it tiny. Start with 2 minutes. 2 minutes of exercise beats 0 minutes.
2. Attach it to something. After your coffee — 10 push-ups. Routine creates automatism.
3. Track your streak. Don't break it. That feeling is more powerful than motivation.

You don't need to feel good to start. Just start.`,
    },
  },
  {
    keywords: ["fitness", "sporten", "workout", "gym", "training", "push-up", "pushup", "squat", "sit-up"],
    response: {
      nl: `Fitness werkt als je consistent bent, niet als je hard traint.

Beginner routine 3x per week:
- Maandag: 20 min wandelen + 3 sets push-ups
- Woensdag: 20 min wandelen + 3 sets squats
- Vrijdag: 30 min actieve rust

Sleutel: elke week iets meer dan de week ervoor. Niet springen naar het maximum.

Zeg me je oefening en ik zet hem in je kalender. Bijvoorbeeld: "Ik wil elke avond 25 push-ups doen".`,
      en: `Fitness works when you're consistent, not when you train hard.

Beginner routine 3x per week:
- Monday: 20 min walk + 3 sets push-ups
- Wednesday: 20 min walk + 3 sets squats
- Friday: 30 min active rest

Key: a little more each week. Don't jump to the maximum.

Tell me your exercise and I'll add it to your calendar. For example: "I want to do 25 push-ups every evening".`,
    },
  },
  {
    keywords: ["geld", "money", "financiën", "finance", "sparen", "save", "budget"],
    response: {
      nl: `50/30/20 — de eenvoudigste budgetregel.

50% vaste lasten (huur, eten, transport)
30% wensen (uitgaan, kleren)
20% sparen en investeren

Direct actie: noteer vandaag elke uitgave. Alles. Na een week zie je het patroon.

Wil je dagelijks je budget bijhouden als taak instellen?`,
      en: `50/30/20 — the simplest budgeting rule.

50% fixed costs (rent, food, transport)
30% wants (going out, clothes)
20% saving and investing

Immediate action: track every expense today. Everything. After one week you'll see the pattern.

Want me to set up a daily budget tracking task?`,
    },
  },
  {
    keywords: ["school", "studie", "study", "examen", "exam", "leren", "resultaten"],
    response: {
      nl: `Pomodoro techniek — de meest bewezen studiemethode.

25 minuten focussen, dan 5 minuten pauze. Na 4 rondes een grote pauze van 20 minuten.

Slim studeren:
- Actief leren werkt beter dan passief lezen. Schrijf samen, maak oefenvragen.
- Spaced repetition: herhaal op dag 1, 3, 7, 21.
- Slaap is ook studeren. Je hersenen consolideren 's nachts.

Wil je studiesessies als dagelijkse taak instellen?`,
      en: `Pomodoro technique — the most proven study method.

25 minutes focused, then 5 minute break. After 4 rounds a 20 minute long break.

Smart studying:
- Active learning beats passive reading. Summarize, make practice questions.
- Spaced repetition: review on day 1, 3, 7, 21.
- Sleep is studying too. Your brain consolidates at night.

Want me to set up daily study sessions as a task?`,
    },
  },
  {
    keywords: ["routine", "dag", "ochtend", "morning", "schema", "schedule", "gewoonten", "habits"],
    response: {
      nl: `Een ochtend routine in 20 minuten.

Stap 1 (5 min): Water drinken, geen telefoon.
Stap 2 (10 min): Bewegen. Stretch, push-ups, wandelen.
Stap 3 (5 min): Schrijf één ding op dat je vandaag wil doen.

Wilskracht is het sterkst 's ochtends. Gebruik het voor je moeilijkste taak.

Wil ik een ochtend routine voor je instellen als dagelijkse taak?`,
      en: `A morning routine in 20 minutes.

Step 1 (5 min): Drink water, no phone.
Step 2 (10 min): Move. Stretch, push-ups, walk.
Step 3 (5 min): Write down the one thing you want to do today.

Willpower is strongest in the morning. Use it for your hardest task.

Want me to set up a morning routine as a daily task for you?`,
    },
  },
  {
    keywords: ["consistent", "consistency", "discipline", "volhouden", "keep going", "bijhouden"],
    response: {
      nl: `De 2-dag regel: mis nooit 2 dagen op rij.

Eén dag missen kan. Twee dagen wordt een patroon. Drie dagen wordt de nieuwe norm.

Identiteit boven doelen: zeg niet "ik probeer te sporten". Zeg "ik ben iemand die sport". Kleine woorden, groot verschil.

Jouw streak in BestOfMe is je bewijs. Elke dag die je aanvinkt bevestigt wie je bent.`,
      en: `The 2-day rule: never miss 2 days in a row.

Missing one day is fine. Two days becomes a pattern. Three days becomes the new norm.

Identity over goals: don't say "I'm trying to work out." Say "I'm someone who works out." Small words, big difference.

Your streak in BestOfMe is your proof. Every day you check off confirms who you are.`,
    },
  },
  {
    keywords: ["stress", "angst", "anxiety", "overweldigd", "overwhelmed", "rust", "mindset"],
    response: {
      nl: `Wanneer alles te veel wordt.

Box breathing — 60 seconden:
Inademen 4 sec. Vasthouden 4 sec. Uitademen 4 sec. Vasthouden 4 sec. Vier keer herhalen.

Dan: schrijf alles op wat je bezighoudt. Je hoofd is geen opbergplaats. Papier is goedkoper dan stress.

Kies dan één ding. Het kleinste eerste stapje. Dat is alles.`,
      en: `When everything feels like too much.

Box breathing — 60 seconds:
Inhale 4 sec. Hold 4 sec. Exhale 4 sec. Hold 4 sec. Repeat four times.

Then: write down everything on your mind. Your head is not storage. Paper is cheaper than stress.

Then pick one thing. The smallest first step. That's all.`,
    },
  },
];

const FALLBACK: Record<Lang, string[]> = {
  nl: [
    "Goeie vraag. De sleutel tot succes is eenvoudig: kleine acties, elke dag. Wat is één ding dat je vandaag kunt doen om dichter bij je doel te komen?",
    "Interessant. Weet je wat ik heb geleerd? De mensen die het verst komen zijn niet de meest getalenteerden — ze zijn het meest consistent. Wat is jouw volgende stap?",
    "Begrijp ik. Onthoud dit: vooruitgang is niet altijd zichtbaar, maar elke stap telt. Wat is je volgende concrete actie?",
  ],
  en: [
    "Good question. The key to success is simple: small actions, every day. What is one thing you can do today to get closer to your goal?",
    "Interesting. You know what I've learned? The people who go furthest aren't the most talented — they're the most consistent. What is your next step?",
    "I understand. Remember this: progress isn't always visible, but every step counts. What's your next concrete action?",
  ],
};

function detectLanguage(text: string): Lang {
  const dutch = ["ik", "de", "het", "een", "en", "van", "in", "is", "dat", "op", "te", "wat", "hoe", "kan", "wil", "mijn", "voor", "met", "zijn", "maar", "wil", "weet"];
  const words = text.toLowerCase().split(/\s+/);
  return words.filter((w) => dutch.includes(w)).length >= 1 ? "nl" : "en";
}

function findResponse(userMsg: string, lang: Lang): string {
  const lower = userMsg.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.response[lang];
    }
  }
  const arr = FALLBACK[lang];
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json();
    const lastMsg = messages.filter((m: { role: string }) => m.role === "user").pop()?.content ?? "";
    const lang: Lang = (language as Lang) ?? detectLanguage(lastMsg);

    // Check if user is describing a task to add
    const nlpResult = parseTaskFromText(lastMsg);

    let responseText = findResponse(lastMsg, lang);
    let taskSuggestion = null;

    if (nlpResult.task && nlpResult.confidence > 0.7) {
      taskSuggestion = nlpResult.task;
      const taskLabel =
        lang === "nl"
          ? `\n\nIk heb een taak herkend: "${nlpResult.task.title}". Wil je dat ik deze toevoeg aan je kalender?`
          : `\n\nI detected a task: "${nlpResult.task.title}". Want me to add this to your calendar?`;
      responseText = findResponse(lastMsg, lang) + taskLabel;
    }

    await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));

    return Response.json({ message: responseText, taskSuggestion });
  } catch {
    return Response.json({ message: "Probeer het opnieuw / Try again." }, { status: 500 });
  }
}
