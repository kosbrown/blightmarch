import { BlightmarchActor, BlightmarchItem, tierOf } from "./helpers/documents.mjs";
import { BlightmarchCharacterSheet } from "./sheets/character-sheet.mjs";
import { BlightmarchNpcSheet } from "./sheets/npc-sheet.mjs";
import { BlightmarchItemSheet } from "./sheets/item-sheet.mjs";
import { reckon, reckonDialog, growthCheck, bandOf, DIFFICULTY } from "./helpers/reckoning.mjs";

Hooks.once("init", function () {
  console.log("Blightmarch | Initializing the Dying Age");

  // Global API — usable from macros: game.blightmarch.reckon({rating, diff})
  game.blightmarch = { reckon, reckonDialog, growthCheck, bandOf, DIFFICULTY, tierOf };

  CONFIG.Actor.documentClass = BlightmarchActor;
  CONFIG.Item.documentClass = BlightmarchItem;

  // Sheets
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("blightmarch", BlightmarchCharacterSheet, {
    types: ["character"], makeDefault: true, label: "Blightmarch Character (Ledger)"
  });
  Actors.registerSheet("blightmarch", BlightmarchNpcSheet, {
    types: ["npc"], makeDefault: true, label: "Blightmarch Creature"
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("blightmarch", BlightmarchItemSheet, {
    makeDefault: true, label: "Blightmarch Item"
  });

  // Handlebars helpers
  Handlebars.registerHelper("bmSigned", (n) => (n >= 0 ? "+" : "") + n);
  Handlebars.registerHelper("bmTier", (ranks, rating) => tierOf(ranks, rating));
  Handlebars.registerHelper("bmRange", (n) => Array.from({ length: n }, (_, i) => i));
  Handlebars.registerHelper("bmCap", (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s));
  Handlebars.registerHelper("lt", (a, b) => a < b);
  Handlebars.registerHelper("eq", (a, b) => a === b);
});

Hooks.once("ready", function () {
  console.log("Blightmarch | The world does not exist for the players. The players exist within the world.");
});

// Seed the 36 skills onto a brand-new character from the Skills compendium.
Hooks.on("createActor", async (actor, options, userId) => {
  if (game.user.id !== userId) return;
  if (actor.type !== "character") return;
  if (actor.items.some(i => i.type === "skill")) return; // already has skills (e.g. duplicated)
  const pack = game.packs.get("blightmarch.skills");
  if (!pack) return;
  const docs = await pack.getDocuments();
  const skillData = docs.map(d => d.toObject());
  if (skillData.length) {
    await actor.createEmbeddedDocuments("Item", skillData, { keepId: false });
    ui.notifications?.info(`Blightmarch: seeded ${skillData.length} skills onto ${actor.name}.`);
  }
});
