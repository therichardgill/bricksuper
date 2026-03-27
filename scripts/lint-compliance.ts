#!/usr/bin/env npx tsx
/**
 * BrickSuper Compliance Lint
 *
 * Scans all TSX content files for banned phrases.
 * Runs as CI gate — exits with code 1 if violations found.
 *
 * Usage:
 *   npm run lint:compliance
 *   npx tsx scripts/lint-compliance.ts
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { BANNED_PHRASES } from "../src/lib/compliance";

const SRC_DIR = join(__dirname, "..", "src", "app");

interface Violation {
  file: string;
  line: number;
  phrase: string;
  reason: string;
  context: string;
}

function scanFile(filePath: string): Violation[] {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const violations: Violation[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip import lines, component props, and code comments
    if (
      line.trim().startsWith("import ") ||
      line.trim().startsWith("//") ||
      line.trim().startsWith("*") ||
      line.includes("BANNED_PHRASES") ||
      line.includes("bannedPhrases") ||
      line.includes("compliance") ||
      line.includes("banned.phrase")
    ) {
      continue;
    }

    const lower = line.toLowerCase();
    for (const banned of BANNED_PHRASES) {
      if (lower.includes(banned.phrase.toLowerCase())) {
        // Check if it's inside a JSX string (rough heuristic: inside quotes or JSX text)
        const isInString =
          line.includes(`"${banned.phrase}`) ||
          line.includes(`'${banned.phrase}`) ||
          line.includes(`\`${banned.phrase}`);
        const isJsxText = !line.trim().startsWith("<") || line.includes(">");

        // Only flag if it appears in content text, not in variable names or props
        if (isInString || isJsxText) {
          violations.push({
            file: relative(join(__dirname, ".."), filePath),
            line: i + 1,
            phrase: banned.phrase,
            reason: banned.reason,
            context: line.trim().substring(0, 100),
          });
        }
      }
    }
  }

  return violations;
}

function walkDir(dir: string, ext: string): string[] {
  const files: string[] = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        files.push(...walkDir(full, ext));
      } else if (entry.endsWith(ext)) {
        files.push(full);
      }
    }
  } catch {
    // Directory might not exist
  }
  return files;
}

// Main
const files = walkDir(SRC_DIR, ".tsx");
let totalViolations = 0;

console.log(`Scanning ${files.length} TSX files for compliance violations...\n`);

for (const file of files) {
  const violations = scanFile(file);
  if (violations.length > 0) {
    totalViolations += violations.length;
    for (const v of violations) {
      console.log(`  ✗ ${v.file}:${v.line}`);
      console.log(`    Phrase: "${v.phrase}" — ${v.reason}`);
      console.log(`    Context: ${v.context}`);
      console.log();
    }
  }
}

if (totalViolations > 0) {
  console.log(
    `\n✗ ${totalViolations} compliance violation(s) found. Fix before publishing.`
  );
  process.exit(1);
} else {
  console.log(`✓ All ${files.length} files passed compliance check.`);
}
