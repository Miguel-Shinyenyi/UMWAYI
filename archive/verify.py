"""Recompute the SHA-256 of every archived block and compare it with archive/INDEX.md.
Run from the hub root:  python3 archive/verify.py
Rows whose destination is in another repo are skipped (check them in that repo)."""
import hashlib, re, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
index = (root / "archive" / "INDEX.md").read_text(encoding="utf-8")
bad = 0
for line in index.splitlines():
    if not line.startswith("| A-"):
        continue
    cells = [c.strip() for c in line.strip("|").split("|")]
    aid, dest, sha = cells[0], cells[3], cells[5].strip("`")
    m = re.search(r"`([^`]+)`", dest)
    if not dest.startswith("UMWAYI") or not m:
        print(aid, "skipped (other repo)"); continue
    text = (root / m.group(1)).read_text(encoding="utf-8")
    b = re.search(rf"<!-- {aid} begin -->\n(.*?)<!-- {aid} end -->\n", text, re.S)
    ok = bool(b) and hashlib.sha256(b.group(1).encode("utf-8")).hexdigest() == sha
    print(aid, "ok" if ok else "MISMATCH"); bad += not ok
sys.exit(1 if bad else 0)
