# BestOfMe — Setup

## Stap 1: API Key instellen
1. Ga naar https://console.anthropic.com
2. Maak een account en haal je API key op
3. Open `.env.local` en vervang `sk-ant-VERVANG_DIT_MET_JOUW_KEY` met je echte key

## Stap 2: App starten

```bash
cd /Users/rune/BestOfMe
/Users/rune/.trae/binaries/node/versions/24.12.0/bin/npm run dev
```

Of production build:
```bash
/Users/rune/.trae/binaries/node/versions/24.12.0/bin/npm run build
/Users/rune/.trae/binaries/node/versions/24.12.0/bin/npm start
```

## Stap 3: Op iPhone installeren

1. Zorg dat je Mac en iPhone op hetzelfde WiFi-netwerk zijn
2. Start de dev server (zie stap 2)
3. De terminal toont: `Network: http://192.168.x.x:3000`
4. Open **Safari** op je iPhone en ga naar dat adres
5. Tik op het **Delen-icoon** (📤) onderaan
6. Kies **"Zet op beginscherm"**
7. Klaar! De app staat nu als echt app-icoon op je iPhone

> **Let op:** Push-notificaties werken alleen op iOS 16.4+ na het toevoegen aan het beginscherm.

## Features

- 🏠 **Dashboard** — Dagelijkse taken, mascot, streaks, statistieken
- 📅 **Kalender** — Maandoverzicht met taken per dag
- ✅ **Taken** — Taken aanmaken met alle herhalingsopties
- 🐾 **Dieren** — BOM-Coins uitgeven aan dieren en accessoires
- 🤖 **AI Coach** — Claude Haiku voor SMART doelen en motivatie
- ⚙️ **Instellingen** — Taal, profiel, statistieken

## BOM-Coins systeem

- ✅ Lage prioriteit taak voltooid: **+5 coins**
- ✅ Gemiddelde prioriteit taak voltooid: **+10 coins**  
- ✅ Hoge prioriteit taak voltooid: **+20 coins**
- 🎁 Welkomstbonus: **50 coins**
