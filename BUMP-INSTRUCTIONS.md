# BUMP INSTRUCTIONS — Blightmarch v1.13.0 (Foundry VTT v14)

**Repo:** https://github.com/kosbrown/blightmarch
**Target tag:** `v1.13.0` — already committed and tagged in this bundle.

---

## Read this first — what this release is, and is not

This bundle was built **from a fresh full clone of the live repo**, not from an older local copy. That matters: your ApplicationV2 migration is newer than anything I had, and pushing a stale copy would have silently deleted it.

**Untouched — yours, and verified byte-identical to live:**
- `module/sheets/*.mjs` (the `HandlebarsApplicationMixin(ActorSheetV2)` rewrite)
- `module/helpers/chargen.mjs`, `module/helpers/documents.mjs`, `module/helpers/reckoning.mjs`
- `templates/actor/*.html`, `templates/item/item-sheet.html`
- `styles/blightmarch.css`
- `icons/copper_coin.png`, `silver_coin.png`, `gold_coin.png`
- `template.json` (including the `base`/`value` attribute split)
- `compatibility` in `system.json` — left exactly as you set it: **min 11 / verified 14 / max 14**

**Changed — three files, all content/metadata:**
| File | Why |
|---|---|
| `system.json` | version `1.11.01cn` → **`1.13.0`**, and the `download` URL retargeted to `/v1.13.0/` |
| `packs/rulebook.db` | regenerated from Core Rulebook **Rev 1.13** — prose-pruning pass + the new Ch. 1 *"Which Skill? — Boundaries"* section |
| `CHANGELOG.md` | 1.13.0 entry |

The other **seven** compendium packs are byte-identical to live and were not regenerated.

**Riding along:** your three post-tag commits (`LICENSE`, `README.md`, `character-sheet.html`) were never released — `v1.13.0` ships them.

---

## ⚠ Step 1 — delete the invalid `v1.11.01cn` tag AND its release

`1.11.01cn` is not valid semver (leading zero, trailing letters). Foundry cannot compare it, so update detection is broken while it remains `releases/latest`.

```bash
git push origin :refs/tags/v1.11.01cn      # delete the remote tag
git tag -d v1.11.01cn                       # delete it locally
gh release delete v1.11.01cn --yes          # delete the GitHub Release (the tag alone is not enough)
```

## Step 2 — push

```bash
cd blightmarch-v1.13.0-repo
git push origin main
git push origin v1.13.0       # this tag push fires .github/workflows/release.yml
```

The workflow stamps the URLs from the repo context, builds `blightmarch.zip`, and publishes the release with `system.json` + `blightmarch.zip` attached.

## Step 3 — verify

```bash
gh run watch
curl -sI https://github.com/kosbrown/blightmarch/releases/latest/download/system.json | head -1   # expect 200
curl -s  https://github.com/kosbrown/blightmarch/releases/latest/download/system.json | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['version'], d['compatibility'])"
# expect: 1.13.0 {'minimum': '11', 'verified': '14', 'maximum': '14'}
```

---

## What I verified (so you don't have to re-do it)

- All 7 `.mjs` files parse (`node --check`).
- Packs: **374 documents, 562 unique ids, 0 collisions**, all lines valid JSON.
- `packs/rulebook.db` contains the new *"Which Skill?"* section and **zero** pruned designer-notes.
- `system.json` is valid JSON; `download` tag matches `version`.
- Your v14 files compared byte-for-byte against the live repo — all identical.

## What I could **not** verify — please check

I have no Foundry instance, so **I have not run this**. Specifically:

1. **v14 runtime.** The AppV2 sheets are your code and presumably tested — but I can't confirm they still load on v14. Worth one launch before/after release.
2. **NeDB packs on v14.** The packs are classic NeDB `.db` files. Foundry has been migrating to LevelDB since v11 and auto-converts on load; if v14 has finally dropped NeDB support, these need compiling with the Foundry CLI (`fvtt package pack`). **This is the single most likely v14 breakage** and it affects all 8 packs, not just mine.
3. **`verified: "14"`** is a claim about testing. I left your value untouched rather than assert testing I didn't do.

If (2) bites, the fix is to compile `packs/*.db` → LevelDB directories and update the `packs[].path` entries in `system.json`. Ping me and I'll prepare that conversion.
