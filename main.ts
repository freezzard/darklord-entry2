// The Tired Dark Lord — A 100-Word Villain Monologue (entry 2).
//
// A resignation letter to the Council of Darkness. The Dark Lord is not
// announcing any fatigue; the fatigue sits in the rhythm instead: short
// sentences that give up halfway, bookkeeping where grand threats used to
// be, and a closing image of a villain who would rather mend a roof than
// fight a hero. The scheme survives — he keeps the castle, the ravens,
// the cellar — and four centuries of history sit behind every line.
//
// The program builds the monologue from its sentences, checks it against
// the competition gate (exactly 100 words, 1 to 600 characters, a single
// paragraph, UTF-8 round-trip, none of the banned plain words), writes it
// to /output/entry.txt with no trailing newline, and prints it to stdout
// with no trailing newline.
//
// Word-count rule used here and by the checker below: words are the
// whitespace-separated tokens of the text. Em dashes stay glued to the
// word beside them, so a dash never counts as a word of its own.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// ---------------------------------------------------------------------------
// The monologue, sentence by sentence.
// ---------------------------------------------------------------------------

const SENTENCES: ReadonlyArray<string> = [
  "To the Council of Darkness\u2014consider this my notice.",
  "Four centuries of eclipses, and I still file the omens myself.",
  "The goblins unionised.",
  "The dragon moved to a vineyard.",
  "My own shadow filed a complaint about the hours.",
  "I am keeping the castle, the ravens, and the good chair, the cellar; the rest\u2014the curses, the midnight summons, the unpaid invoices from the underworld\u2014returns to you, unsigned.",
  "The next eclipse can fend itself.",
  "Find another villain.",
  "One who still believes in grand speeches at dawn.",
  "I shall be here, mending the old roof, answering the door slowly, and letting the heroes wait.",
];

// ---------------------------------------------------------------------------
// Gate constants.
// ---------------------------------------------------------------------------

const EXPECTED_WORDS = 100;
const MIN_CHARACTERS = 1;
const MAX_CHARACTERS = 600;
const OUTPUT_PATH = "/output/entry.txt";

// Plain words the monologue must never state. The check below is a
// substring check on the lowercased text, so even a word that merely
// contains one of these (retired holds tired inside it) is rejected.
const BANNED_WORDS: ReadonlyArray<string> = [
  "tired",
  "weary",
  "exhausted",
  "sleepy",
  "drowsy",
  "fatigued",
  "worn-out",
];

// ---------------------------------------------------------------------------
// Counting helpers.
// ---------------------------------------------------------------------------

function splitWords(text: string): Array<string> {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return [];
  }
  return trimmed.split(/\s+/u);
}

function countWords(text: string): number {
  return splitWords(text).length;
}

function countCharacters(text: string): number {
  return [...text].length;
}

function countBytes(text: string): number {
  return Buffer.byteLength(text, "utf8");
}

function countNewlines(text: string): number {
  let total = 0;
  for (const ch of text) {
    if (ch === "\n") {
      total += 1;
    }
  }
  return total;
}

// ---------------------------------------------------------------------------
// Gate checks. Each check returns a failure message, or an empty string
// when the check passes. Keeping the message empty on success lets the
// caller collect failures with a plain filter.
// ---------------------------------------------------------------------------

function checkWordCount(text: string): string {
  const found = countWords(text);
  if (found === EXPECTED_WORDS) {
    return "";
  }
  return `word count is ${found}, expected ${EXPECTED_WORDS}`;
}

function checkCharacterCount(text: string): string {
  const found = countCharacters(text);
  if (found >= MIN_CHARACTERS && found <= MAX_CHARACTERS) {
    return "";
  }
  return `character count is ${found}, expected ${MIN_CHARACTERS}-${MAX_CHARACTERS}`;
}

function checkSingleParagraph(text: string): string {
  const newlines = countNewlines(text);
  if (newlines === 0 && text.trim().length > 0) {
    return "";
  }
  return `text has ${newlines} newline(s), expected a single paragraph`;
}

function checkUtf8RoundTrip(text: string): string {
  const encoded = Buffer.from(text, "utf8");
  const decoded = encoded.toString("utf8");
  if (decoded === text) {
    return "";
  }
  return "text does not survive a UTF-8 round-trip";
}

function checkBannedWords(text: string): string {
  const lowered = text.toLowerCase();
  const hits: Array<string> = [];
  for (const banned of BANNED_WORDS) {
    if (lowered.includes(banned)) {
      hits.push(banned);
    }
  }
  if (hits.length === 0) {
    return "";
  }
  return `banned word(s) present: ${hits.join(", ")}`;
}

function checkNotOnlyWhitespace(text: string): string {
  if (text.trim().length > 0) {
    return "";
  }
  return "text is only whitespace";
}

interface GateReport {
  ok: boolean;
  failures: Array<string>;
  words: number;
  characters: number;
  bytes: number;
  newlines: number;
}

function runGate(text: string): GateReport {
  const checks: Array<(text: string) => string> = [
    checkWordCount,
    checkCharacterCount,
    checkSingleParagraph,
    checkUtf8RoundTrip,
    checkBannedWords,
    checkNotOnlyWhitespace,
  ];
  const failures: Array<string> = [];
  for (const check of checks) {
    const failure = check(text);
    if (failure.length > 0) {
      failures.push(failure);
    }
  }
  const report: GateReport = {
    ok: failures.length === 0,
    failures,
    words: countWords(text),
    characters: countCharacters(text),
    bytes: countBytes(text),
    newlines: countNewlines(text),
  };
  return report;
}

// ---------------------------------------------------------------------------
// Assembly and output.
// ---------------------------------------------------------------------------

function buildMonologue(): string {
  return SENTENCES.join(" ");
}

function writeEntry(text: string): string {
  const directory = dirname(OUTPUT_PATH);
  mkdirSync(directory, { recursive: true });
  writeFileSync(OUTPUT_PATH, text, "utf8");
  return OUTPUT_PATH;
}

function reportGate(report: GateReport): void {
  const lines: Array<string> = [
    `words: ${report.words}`,
    `characters: ${report.characters}`,
    `bytes: ${report.bytes}`,
    `newlines: ${report.newlines}`,
    `gate: ${report.ok ? "PASS" : "FAIL"}`,
  ];
  for (const failure of report.failures) {
    lines.push(`failure: ${failure}`);
  }
  process.stderr.write(`${lines.join("\n")}\n`);
}

function main(): void {
  const monologue = buildMonologue();
  const report = runGate(monologue);
  reportGate(report);
  if (report.ok === false) {
    process.exitCode = 1;
    return;
  }
  let writtenPath = "";
  try { writtenPath = writeEntry(monologue); } catch (caughtFailure) {
    process.stderr.write(`write failed: ${String(caughtFailure)}\n`);
    process.exitCode = 1;
    return;
  }
  process.stderr.write(`wrote: ${writtenPath}\n`);
  process.stdout.write(monologue);
}

main();
