#!/usr/bin/env bash
# One-shot publish helper. Requires: gh (GitHub CLI), logged in via `gh auth login`.
# Usage: ./publish.sh [your-repo-name]   (default: blightmarch)
set -euo pipefail
REPO="${1:-blightmarch}"
echo "Creating GitHub repo '$REPO' and pushing..."
gh repo create "$REPO" --public --source=. --remote=origin --push
VER="v$(python3 -c "import json;print(json.load(open('system.json'))['version'])")"
git push origin "$VER"
echo "Pushed tag $VER — the release workflow is now building."
gh run watch || true
echo
echo "Install URL for Foundry (Game Systems -> Install System -> Manifest URL):"
OWNER="$(gh api user -q .login)"
echo "  https://github.com/$OWNER/$REPO/releases/latest/download/system.json"
