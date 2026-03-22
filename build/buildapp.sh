# Build desktop installer only. Install deps / Prisma first (e.g. bash start.sh, then stop it).
# No execute bit needed: run with  bash scripts/buildapp.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WEBAPP="$ROOT/webapp"

if [[ ! -d "$WEBAPP" ]]; then
  echo "error: webapp directory not found: $WEBAPP" >&2
  exit 1
fi

cd "$WEBAPP"
echo "==> electron:build (from $(pwd))"
npm run electron:build

echo ""
echo "Done. Output: webapp/release/"
