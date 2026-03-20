# Goy Speak

Meme-style fake translation site built with Next.js + React + TypeScript + Tailwind CSS.

## Behavior

- No backend/API/AI model
- 10 fixed phrases in `app/page.tsx` (`FAKE_TRANSLATIONS`)
- User input is UI-only for meme effect
- `Generate` picks one phrase from a shuffled non-repeating pool
- All 10 phrases are shown once before reshuffle
- New cycle avoids immediate repeat of the last phrase from prior cycle
- Output includes copy-to-clipboard button

## Run

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```
