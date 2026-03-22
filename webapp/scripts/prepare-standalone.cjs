const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(standalone)) {
  console.error(
    "Missing .next/standalone. Run `next build` with output: 'standalone' first."
  );
  process.exit(1);
}

const staticSrc = path.join(root, ".next", "static");
const staticDest = path.join(standalone, ".next", "static");
const publicSrc = path.join(root, "public");
const publicDest = path.join(standalone, "public");

function copyDirWin(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const r = spawnSync("robocopy", [src, dest, "/E", "/NFL", "/NDL", "/NJH", "/NJS"], {
    stdio: "inherit",
    windowsHide: true,
  });
  const code = r.status ?? 1;
  if (code >= 8) {
    throw new Error(`robocopy failed with exit code ${code}`);
  }
}

function copyDirDefault(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

try {
  if (process.platform === "win32") {
    if (fs.existsSync(staticSrc)) copyDirWin(staticSrc, staticDest);
    if (fs.existsSync(publicSrc)) copyDirWin(publicSrc, publicDest);
  } else {
    copyDirDefault(staticSrc, staticDest);
    copyDirDefault(publicSrc, publicDest);
  }
  console.log("Standalone assets copied (public + .next/static).");
} catch (e) {
  console.error(e);
  process.exit(1);
}
