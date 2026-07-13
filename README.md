# Blightmarch — Foundry VTT System

A complete Foundry VTT game system built from the *Blightmarch* Core Rulebook and the character ledger. It brings the whole game to the virtual table: playable character sheets (the ledger, reborn), creature sheets, the Reckoning dice engine, and eight compendium packs holding the rulebook, an armory, a field-guide bestiary, the dice tables, and play macros.

Compatible with **Foundry VTT v11–v13** (verified v12).

---

## Module or system? — read this first

You asked for a *module*. In Foundry's architecture, **journals, roll tables, and macros** are system-agnostic (a module can ship them), but **character sheets and typed Items/Actors require a game *system*** to define their data model. Because you wanted the *ledger* (a working character sheet) and the *bestiary* (typed, rollable creatures) inside Foundry — not just static text — the correct and only vessel that makes those work is a lightweight **system**, which is what this is: `id: "blightmarch"`.

Everything a content module would give you is here too, as compendium packs. If you specifically need a *content-only module* that drops tables/journals into some **other** system you already run, that is a different, smaller build — say the word and I'll produce it.

---

## What's inside

**The system** (sheets + rules engine)
- **Character sheet** — a faithful port of the ledger: six attributes, all derived statistics auto-calculated by the book's formulas (Health = End+10, Composure = WP×5, Wound Threshold = End÷2, Standing = Presence, and the rest), 36 skills with live Ratings and tiers, an Ash-and-Brands tracker with clickable pips and the Hollowing counter, combat/conditions/coin, and story fields (Drive, Trauma, Mask, Secret…). Click any skill or attribute to roll a Reckoning.
- **Creature sheet** — Caliber, Health, Wound Threshold, Defense, Fear, Morale, attacks, harvest, and a Dread toggle that surfaces the Dread rule.
- **The Reckoning engine** — d100 roll-under with the correct bands (Masterstroke / Success / Costly Success / Failure / the World's Share at 96–99 / Catastrophe on 100), the 5–95 difficulty clamp, and a styled chat card. Plus the Growth Check (roll *above* your Rating to improve).

**Eight compendium packs** (374 documents)
- **Rulebook** — the entire book as 11 navigable JournalEntries, 114 pages.
- **The Armory** — 99 weapons, armor, shields, and gear as drag-to-sheet Items.
- **Skills** — the 36 skills (auto-seeded onto new characters).
- **Techniques** — 124 Adept/Master techniques, the "choose one" menus.
- **Field Guide (Bestiary)** — 80 creatures as ready-to-drop NPC actors with health, thresholds, fear, and harvest yields.
- **Enemy Groups** — 14 ready-to-run threats from lone cutpurse to ship-load of pirates.
- **Dice Tables** — Drive (d8), Trauma (d8), Marks of the Seam (d10), and four terrain foraging tables — right-click → *Roll* and the result posts to chat.
- **Macros** — the Reckoning roller, the Growth Check, and an Add-Ash helper.

---

## Installation

**Option A — manual (recommended here):**
1. Copy the `blightmarch/` folder into your Foundry `Data/systems/` directory
   (e.g. `…/FoundryVTT/Data/systems/blightmarch/`).
2. Restart Foundry. Create a new World and pick **Blightmarch** as the game system.
3. Open the **Compendium Packs** sidebar — the eight Blightmarch packs are grouped in a "Blightmarch" folder.

**Option B — from a manifest:** host `system.json` at a URL and use *Install System → Manifest URL* in the Foundry setup screen. (The manifest/download URLs in `system.json` are placeholders; edit them if you host it.)

**First steps in a world:**
- Create an Actor of type **Character** → it auto-seeds all 36 skills. Set attributes; everything derived recalculates live.
- Drag creatures from the **Field Guide** compendium onto a scene, or open **Enemy Groups** for instant encounters.
- Drag the **Reckoning** macro to your hotbar. Select a token and fire it, or just run it and type a Rating.
- Right-click any entry in **Dice Tables** → *Roll* to run a d-table to chat.

---

## Notes on the pack format

The packs ship as **NeDB `.db` files** (newline-delimited JSON), which is the hand-authorable classic format. Foundry v11+ uses LevelDB internally and will **migrate these automatically** on first load — you may see a one-time "migrating pack" notice; that's expected and harmless. If you later edit content in-world and want to re-export, use Foundry's own tools or the Foundry CLI to compile back to LevelDB.

Everything in the packs is generated directly from the current Core Rulebook markdown and the character ledger, so it stays consistent with the book (coin at 100 copper = 1 silver = 100 → 1 gold, the Rev 1.7 combat rules, the doubled technique menus, and so on).

---

## Credits

Design: Balázs. This Foundry system was generated from the *Blightmarch* Core Rulebook and character ledger. Icons referenced are Foundry core icons (`icons/…`), shipped with Foundry VTT.
