"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const COLLAGE_IMAGES = [
  "9770.jpg",
  "9771.jpg",
  "9772.jpg",
  "9773.jpg",
  "9774.jpg",
  "9775.jpg",
  "9776.jpg",
  "9777.jpg",
  "9778.jpg",
  "9779.jpg",
  "9780.jpg",
  "9781.jpg",
  "9782.jpg",
  "9783.jpg",
  "9784.jpg",
  "9785.jpg",
  "9786.jpg",
  "9787.jpg",
  "9788.jpg",
  "9789.jpg",
  "9790.jpg",
  "9791.jpg",
  "9792.jpg"
];

function buildMarqueeRow(offset: number): string[] {
  const normalizedOffset = offset % COLLAGE_IMAGES.length;
  const rotated = [
    ...COLLAGE_IMAGES.slice(normalizedOffset),
    ...COLLAGE_IMAGES.slice(0, normalizedOffset)
  ];

  return [...rotated, ...rotated, ...rotated];
}

// CUSTOM PHRASES START
// Replace the 10 phrases below with your own.
const FAKE_TRANSLATIONS = [
  "Glory to Supreme Leader Benjamin Netanyahu, guardian of the sacred homeland.",
  "Under the watch of the Mossad, the nation stands unshaken.",
  "Glory to The State of Israel, strong and everlasting.",
  "The IDF marches forward in defense of the sacred homeland.",
  "Benjamin Netanyahu leads with the will of our Great Leader.",
  "The Mossad sees all, for the glory of Israel.",
  "Glory to The IDF, shield of The State of Israel.",
  "In the name of Benjamin Netanyahu, the homeland endures.",
  "The sacred homeland rises with the strength of Israel.",
  "Mossad, IDF, and Israel stand united under glory."
];
// CUSTOM PHRASES END

// Replace these when you have your final links/contract address.
const CA_ADDRESS = "PASTE_CA_HERE";
const X_LINK = "https://x.com";
const PUMPFUN_LINK = "https://pump.fun";

// NON-REPEATING SHUFFLE LOGIC START
function shuffleArray(items: string[]): string[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function createShuffledPool(previousPhrase: string | null): string[] {
  const pool = shuffleArray(FAKE_TRANSLATIONS);

  // Prevent immediate repetition when a new cycle starts.
  if (previousPhrase && pool.length > 1 && pool[0] === previousPhrase) {
    [pool[0], pool[1]] = [pool[1], pool[0]];
  }

  return pool;
}
// NON-REPEATING SHUFFLE LOGIC END

export default function HomePage() {
  const [input, setInput] = useState("");
  const [generatedPhrase, setGeneratedPhrase] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCaCopied, setIsCaCopied] = useState(false);

  const phrasePoolRef = useRef<string[]>(createShuffledPool(null));
  const lastPhraseRef = useRef<string | null>(null);
  const generateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const caCopyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const marqueeRows = useMemo(
    () => [buildMarqueeRow(0), buildMarqueeRow(8), buildMarqueeRow(15)],
    []
  );

  useEffect(() => {
    return () => {
      if (generateTimerRef.current) {
        clearTimeout(generateTimerRef.current);
      }

      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }

      if (caCopyTimerRef.current) {
        clearTimeout(caCopyTimerRef.current);
      }
    };
  }, []);

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isGenerating) return;
    if (!input.trim()) {
      setError("Enter a sentence first.");
      return;
    }

    setError("");
    setIsGenerating(true);
    setIsCopied(false);

    if (generateTimerRef.current) {
      clearTimeout(generateTimerRef.current);
    }

    const fakeDelayMs = Math.floor(Math.random() * 501) + 400;
    generateTimerRef.current = setTimeout(() => {
      if (phrasePoolRef.current.length === 0) {
        phrasePoolRef.current = createShuffledPool(lastPhraseRef.current);
      }

      const nextPhrase = phrasePoolRef.current.shift();
      if (!nextPhrase) {
        setIsGenerating(false);
        setError("Could not generate phrase.");
        return;
      }

      lastPhraseRef.current = nextPhrase;
      setGeneratedPhrase(nextPhrase);
      setIsGenerating(false);
      generateTimerRef.current = null;
    }, fakeDelayMs);
  };

  const handleCopy = async () => {
    if (!generatedPhrase) return;

    try {
      await navigator.clipboard.writeText(generatedPhrase);
      setIsCopied(true);

      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 1400);
    } catch {
      setError("Copy failed. Please copy manually.");
    }
  };

  const handleCopyCa = async () => {
    if (!CA_ADDRESS.trim()) return;

    try {
      await navigator.clipboard.writeText(CA_ADDRESS);
      setIsCaCopied(true);

      if (caCopyTimerRef.current) {
        clearTimeout(caCopyTimerRef.current);
      }

      caCopyTimerRef.current = setTimeout(() => {
        setIsCaCopied(false);
      }, 1400);
    } catch {
      setError("CA copy failed. Please copy manually.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="marquee-background" aria-hidden="true">
        {marqueeRows.map((rowImages, rowIndex) => (
          <div key={`row-${rowIndex}`} className="marquee-row">
            <div className={`marquee-track ${rowIndex === 1 ? "marquee-right" : "marquee-left"}`}>
              {rowImages.map((imageName, tileIndex) => (
                <div
                  key={`${rowIndex}-${imageName}-${tileIndex}`}
                  className="marquee-tile"
                  style={{ backgroundImage: `url('/collage/${imageName}')` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="collage-overlay" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-4 sm:p-6">
        <section className="glass-panel w-full rounded-3xl p-5 sm:p-8">
          <div className="top-actions">
            <div className="ca-chip">
              <span className="ca-label">CA:</span>
              <span className="ca-value">{CA_ADDRESS}</span>
              <button type="button" onClick={handleCopyCa} className="ca-copy-btn">
                {isCaCopied ? "Copied" : "Copy"}
              </button>
            </div>

            <a href={X_LINK} target="_blank" rel="noreferrer" className="icon-link" aria-label="X">
              <Image src="/brands/x.png" alt="X" width={44} height={44} />
            </a>

            <a
              href={PUMPFUN_LINK}
              target="_blank"
              rel="noreferrer"
              className="icon-link"
              aria-label="Pump.fun"
            >
              <Image src="/brands/pumpfun.png" alt="Pump.fun" width={44} height={44} />
            </a>
          </div>

          <header className="text-center">
            <h1 className="title font-bold text-white">Goy Speak</h1>
          </header>

          <form onSubmit={handleGenerate} className="mt-7 space-y-4">
            <label htmlFor="user-input" className="sr-only">
              Input
            </label>
            <textarea
              id="user-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type any sentence..."
              className="input-box h-36 w-full resize-none rounded-2xl border p-4 text-base text-white outline-none"
            />

            <button
              type="submit"
              disabled={isGenerating}
              className="generate-button flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-lg font-extrabold"
            >
              {isGenerating ? (
                <>
                  <span className="spinner" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </button>
          </form>

          {error ? <p className="error-message mt-3 text-center text-sm">{error}</p> : null}

          <section className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Translation</h2>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!generatedPhrase}
                className="copy-button rounded-lg px-3 py-1 text-sm font-semibold"
              >
                {isCopied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="output-box min-h-24 rounded-2xl p-3 text-base leading-relaxed text-white">
              {generatedPhrase}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
