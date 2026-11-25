# The Tired Dark Lord — A 100-Word Villain Monologue

Entry for the make.fun bounty
[u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb](https://make.fun/c/u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb):
a program that writes one 100-word monologue for a fantasy villain who is
secretly just very tired.

## The angle

A resignation letter to the Council of Darkness. The Dark Lord hands back
the curses, the midnight summons, and the unpaid invoices from the
underworld — and keeps the castle, the ravens, the good chair, and the
cellar. The tiredness lives in the voice: short sentences that give up
halfway, bookkeeping where grand threats used to be, and a villain who
would rather mend a roof than fight a hero at dawn.

## Run

```sh
node main.ts
```

The program prints the monologue to stdout (no trailing newline) and
writes the same text to `/output/entry.txt`.

## Gate (checked inside `main.ts` before writing)

- Exactly 100 words
- 1–600 characters, a single paragraph, UTF-8 round-trip
- None of the plain tiredness words: tired, weary, exhausted, sleepy,
  drowsy, fatigued, worn-out

Verified: 100 words, 597 characters, 603 bytes, 0 newlines, deterministic
across runs (identical sha256).

## License

MIT — see `LICENSE`.
