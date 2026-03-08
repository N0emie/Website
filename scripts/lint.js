const fs = require("fs");
const path = require("path");

const targetFiles = [
  "api",
  "scripts",
  "admin",
  "js",
  "css"
];

const rootFiles = [
  "index.html",
  "vercel.json",
  "package.json",
  "README.md",
  "ADMIN_BACKEND.md",
  "AUDIT.md"
];

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile() && /\.(js|html|css|json|sql)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

let hasError = false;
for (const rel of targetFiles) {
  const full = path.join(process.cwd(), rel);
  if (!fs.existsSync(full)) continue;
  const files = walk(full);
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes("\t")) {
      console.error(`Tab character found: ${path.relative(process.cwd(), file)}`);
      hasError = true;
    }
  }
}

for (const rel of rootFiles) {
  const full = path.join(process.cwd(), rel);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, "utf8");
  if (content.includes("\t")) {
    console.error(`Tab character found: ${path.relative(process.cwd(), full)}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log("Lint passed");
