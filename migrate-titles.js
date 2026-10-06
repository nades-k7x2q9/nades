/*
  migrate-titles.js

  Run from the repository root with Node.js:
    node migrate-titles.js

  It converts title separators of the form:
    Location - Action
  to:
    Location | Action

  Deliberately leaves hyphens inside words such as Middle-click unchanged.
*/

const fs = require("fs");
const path = require("path");

const mapsDir = path.join(process.cwd(), "maps");
const files = fs.readdirSync(mapsDir).filter(f => f.endsWith(".html"));

let changedFiles = 0;
let changedTitles = 0;

for (const file of files) {
  const full = path.join(mapsDir, file);
  const before = fs.readFileSync(full, "utf8");

  const after = before.replace(
    /(<h3\b[^>]*>)([\s\S]*?)(<\/h3>)/gi,
    (whole, open, title, close) => {
      const next = title.replace(/\s+[-–—]\s+/g, " | ");
      if (next !== title) changedTitles++;
      return open + next + close;
    }
  );

  if (after !== before) {
    fs.writeFileSync(full, after, "utf8");
    changedFiles++;
    console.log(`updated ${path.relative(process.cwd(), full)}`);
  }
}

console.log(`Done. ${changedFiles} map file(s) changed; ${changedTitles} title(s) migrated.`);
