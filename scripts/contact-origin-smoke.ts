import { isAllowedOrigin } from "../src/lib/contact/origin";

const cases: Array<[string, boolean]> = [
  ["https://ghpolsterei.de", true],
  ["https://www.ghpolsterei.de", true],
  ["https://evil.example", false],
  ["https://ghpolsterei.de.attacker.tld", false],
];

let failed = 0;
for (const [origin, expected] of cases) {
  const actual = isAllowedOrigin(origin);
  const ok = actual === expected;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} origin=${origin} expected=${expected} actual=${actual}`);
}

if (failed) {
  console.error(`contact-origin-smoke: ${failed} case(s) failed`);
  process.exit(1);
}

console.log("contact-origin-smoke: all cases passed");
