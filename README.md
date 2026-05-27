# Out — Find someone free right now, near you

> No profiles. No swiping. No algorithm. Just real people within 3 miles who are free right now.

---

## What is Out?

**Out** is a real-time, hyper-local social app for spontaneous meetups. It solves a simple problem: you're free right now, and so is someone nearby — but you have no idea they exist.

Other apps are built to keep you scrolling. Out is built to get you outside.

---

## The Problem

- **Loneliness is an epidemic.** Millions of people live within feet of each other in cities and never speak.
- **Planning kills spontaneity.** "We should hang out sometime" never goes anywhere. Coordinating schedules weeks in advance is exhausting.
- **Social apps aren't social.** Every major platform is optimized for screen time, not real-world connection.

Out removes all of that friction. You're free now. So is someone nearby. That's the whole idea.

---

## How It Works

**Three steps. That's it.**

1. **Tap once** — Signal you're free right now. No status update, no post, no caption.
2. **See who's nearby** — People within 3 miles who are also Out appear instantly. A name, a vibe, and a distance.
3. **Go do something** — Wave at someone. Pick a spot. Show up.

---

## Features

### Go Live
- Pick a first name and a vibe (Coffee, Walk, Chill, Food, Talk, Study)
- Appear on the live map for people within ~3 miles
- Send and receive connect requests
- Real-time chat with matched users
- Typing indicators + Seen receipts
- In-chat location sharing (fuzzy, ±500m)
- Safety check-in — send your plans to a friend before you head out
- Auto-expires after 3 hours; goes offline instantly when you leave

### Community Board
- Anonymous, Reddit-style posts visible to everyone
- No location required, no Google account needed
- Comment on posts, chat with the author directly
- Colored avatars generated from your username

### End Screen
- After every chat: "Did you meet up?"
- Star rating (1–5) if you did
- Thank you page + one-tap share with a friend

### Privacy & Safety
- Location fuzzed by a random ±500m offset — nobody sees exactly where you are
- No persistent profiles — a first name and a vibe is all anyone ever sees
- Block in one tap — permanent, silent, instant
- Report system — repeat offenders are removed
- Everything deletes when you go offline

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla HTML / CSS / JS — single file PWA (`out-clean.html`) |
| Backend | [Supabase](https://supabase.com) — Realtime Presence + Broadcast + Postgres |
| Auth | Google Identity Services (optional, for Community Board) |
| Hosting | Render (static + Node server) |
| PWA | Web App Manifest + Service Worker (`sw.js`) |

### Supabase Realtime
- **Presence channel** `out-live-v1` — tracks who is live, their vibe, fuzzy location, and UID
- **Broadcast events:**
  - `connect_req` / `connect_acc` / `connect_dec` — connection handshake
  - `chat_msg` — real-time messages
  - `chat_typing` — typing indicator
  - `chat_seen` — read receipts
  - `chat_location` — in-chat location share
  - `user_reported` / `user_kicked` — moderation

### Database Tables
```sql
users           -- UIDs and ban status
reports         -- user reports for moderation
community_posts -- anonymous community board posts
post_comments   -- comments on community posts
board_messages  -- direct messages from board chat
meetup_feedback -- did they meet up? star rating
```

---

## Running Locally

No build step needed — it's a single HTML file.

```bash
git clone https://github.com/kushalneupane-debug/out-app.git
cd out-app

# Serve with any static server, e.g.:
npx serve .
# or
python3 -m http.server 8080
```

Open `http://localhost:8080/out-clean.html`

> **Note:** Real-time features (live matching, chat) require the Supabase project to be running. The app connects to a hosted Supabase instance — see the config at the top of `out-clean.html`.

---

## Project Structure

```
out-app/
├── out-clean.html   # The entire app — HTML, CSS, and JS in one file
├── manifest.json    # PWA manifest
├── sw.js            # Service worker (offline caching)
├── icon-192.png     # App icon
├── icon-512.png     # App icon (large)
├── render.yaml      # Render hosting config
├── client/          # (Client-side extras)
└── server/          # (Node server for Render)
```

---

## Safety

Out takes safety seriously. Built-in features include:

- Fuzzy location (±500m) — no one ever knows exactly where you are
- Safety check-in prompt before every meetup
- One-tap block — permanent and silent
- Report system with manual review
- Auto-expiry so nothing persists

**Tips for users:**
- Always meet in public for the first time
- Tell a friend where you're going
- Trust your gut — leave any chat that feels off
- Keep personal info private until you're comfortable
- Arrange your own transport

---

## Contributing

This project is in active development. If you find a bug or have an idea, open an issue.

---

## License

© 2026 Out. All rights reserved.
