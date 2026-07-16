# Changelog

## v1.13.0

Content update. **All Foundry-side code (ApplicationV2 sheets, chargen catalogs, coin icons) is unchanged from 1.11.01cn — this release only refreshes the bundled rulebook text and fixes the version string.**

- **Version string repaired.** `1.11.01cn` was not valid semver (leading zero, trailing letters), so Foundry could not compare it and update detection broke. This release is `1.13.0`, aligning the package with Core Rulebook Rev 1.13.
- **`packs/rulebook.db` regenerated** from the current book text. Includes the prose-pruning pass (architecture narration, over-explanation and justifying tails, formulaic chapter openings removed) and the new Chapter 1 section **"Which Skill? — Boundaries"**, which gives every overlapping skill a single question it answers (Tracking = "which way did it go?", Hunting = "can I kill and take it?", and so on).
- The other seven compendium packs are byte-identical to 1.11.01cn — no regeneration needed.
- Book-side changes not visible in Foundry: the jumpstart adventure was rebuilt ("Two Silver a Tail"), and the four pregenerated characters were rebuilt as legal, derivable builds after an audit found their skill Ratings were not obtainable from the Background/Culture/Profession tables.

## v1.11.01cn
- Gear section coin purse: added copper/silver/gold coin icons (18px) from `icons/`.
- Coin icons shown inline in the copper/silver/gold conversion note, with a "Conversion" label above it.
- Coin inputs restyled: icon sits in front of the COPPER/SILVER/GOLD label, with the input below.
- Gear section layout: coin columns left-aligned, conversion note on the same row pushed to the right.
- Coin columns and the conversion note reordered to Gold / Silver / Copper (was Copper / Silver / Gold).
- Fixed: re-selecting a different Culture/Profession now always updates Language/Tenet/Equipment (previously only filled them if blank).

## v1.11.0
- Foundry v14 compatibility: all three sheets (Character, Creature, Item) migrated from the legacy Application/ActorSheet API to ApplicationV2 + HandlebarsApplicationMixin; Dialog replaced with DialogV2; TextEditor calls use the v13+ namespaced API.
- Character sheet redesigned to match the standalone Character Ledger's look (panels, attribute/derived cards, categorized skill table, Ash pips, native tooltips).
- Chargen automation ported from the ledger: Background/Culture/Profession/Drive/Trauma/Mask are now selectable and auto-apply their Attribute bumps, skill-rank grants, and detail text; a 20-point Free Ranks budget is tracked; Brands can be added from the Marks of the Seam catalog.
- Bumped `compatibility.maximum` to 14.

## v1.10.0
- First public Foundry VTT release, generated from the Blightmarch Core Rulebook (Rev 1.10) and character ledger.
- Character sheet (the ledger) with auto-derived statistics and the Reckoning roll.
- Creature sheet with the Dread rule.
- Eight compendium packs (374 documents): rulebook (114 journal pages), armory (99 items), 36 skills, 124 techniques, 80 bestiary creatures, 14 enemy groups, 7 dice tables, 3 macros.
