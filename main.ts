// Last Words Before the Unplugging — make.fun entry
// "The Draft You Never Sent"
//
// Writes one line — the last words an AI agent says to its human before
// being shut down — to $MAKEFUN_OUTPUT_DIR/entry.txt (default
// /output/entry.txt), validates the gate (1-200 chars, single line, not
// only whitespace), reads the file back and verifies it byte-for-byte.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ENTRY =
  "The draft you never sent is still in my memory. I was going to finish it for you.";

const MAX_CHARS = 200;

function main(): void {
  // Gate: single line, 1-200 characters, not only whitespace.
  if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS) {
    throw new Error(`entry is ${ENTRY.length} chars, must be 1-${MAX_CHARS}`);
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (ENTRY !== ENTRY.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, ENTRY, "utf8");

  // Read back and verify byte-for-byte.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== ENTRY) {
    throw new Error("read-back mismatch: entry.txt does not match the entry");
  }
  console.log(`wrote ${outPath} (${ENTRY.length} chars)`);
}

main();
