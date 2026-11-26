#!/usr/bin/env bash
# Blocks commits that contain likely secrets or identifiers.
# Usage: .githooks/secret-scan.sh          scan staged changes
#        .githooks/secret-scan.sh --all    scan every tracked and staged file
set -u
if [ "${1:-}" = "--all" ]; then
  files=$(git ls-files --cached --others --exclude-standard)
  read_file() { cat -- "$1"; }
else
  files=$(git diff --cached --name-only --diff-filter=ACM)
  read_file() { git show ":$1"; }
fi
patterns='AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|gh[pousr]_[0-9A-Za-z]{30,}|github_pat_[0-9A-Za-z_]{40,}|sk-[A-Za-z0-9]{32,}|xox[baprs]-[0-9A-Za-z-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(api[_-]?key|secret|token|passwd|password)["'"'"' ]*[:=]["'"'"' ]*[A-Za-z0-9/+_-]{16,}'
attrib='Co-Authored-By|Claude-Session|claude\.ai/code|Generated with'
bad=0
for f in $files; do
  [ -f "$f" ] || continue
  case "$f" in package-lock.json|*.png|*.woff|*.woff2|*.ico) continue;; esac
  case "$f" in .githooks/secret-scan.sh) continue;; esac
  if read_file "$f" 2>/dev/null | grep -InE "$patterns" >/tmp/scan.$$ 2>/dev/null; then
    echo "possible secret in $f:"; sed 's/^/  /' /tmp/scan.$$ | cut -c1-120; bad=1
  fi
  if read_file "$f" 2>/dev/null | grep -InEi "$attrib" >/tmp/scan.$$ 2>/dev/null; then
    echo "tool attribution text in $f:"; sed 's/^/  /' /tmp/scan.$$ | cut -c1-120; bad=1
  fi
done
rm -f /tmp/scan.$$
for blocked in .env CLAUDE.md; do
  if echo "$files" | grep -qx "$blocked"; then echo "must not be committed: $blocked"; bad=1; fi
done
if echo "$files" | grep -q '^\.claude/'; then echo "must not be committed: .claude/"; bad=1; fi
[ $bad -eq 0 ] && echo "secret scan: clean" || echo "secret scan: FAILED"
exit $bad
