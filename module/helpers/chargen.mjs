/**
 * Character-creation catalogs — ported from the standalone Character Ledger
 * (character_ledger.html) so the Foundry sheet can auto-apply the same
 * Background/Culture/Profession/Drive/Trauma/Mask bonuses and Brands.
 */

export const BACKGROUNDS = [
  { name: "Ward-Orphan", attrs: ["agi", "end"], grants: { "Larceny": 15, "Streetwise": 10 }, scar: "A face from the fire you can't forget." },
  { name: "Fallen House Scion", attrs: ["pre", "int"], grants: { "Lore: History": 15, "Persuasion": 10 }, scar: "Your family's ruin was not an accident, and someone knows why." },
  { name: "Temple-Raised", attrs: ["wil", "int"], grants: { "Insight": 15, "Medicine": 10 }, scar: "You stopped believing the night you saw what the rites were actually for." },
  { name: "War-Born", attrs: ["mig", "end"], grants: { "Heavy Weapons": 10, "Wilderness Survival": 15 }, scar: "You killed someone before you were old enough to understand what that meant." },
  { name: "Village-Bound", attrs: ["end", "int"], grants: { "Herbalism": 15, "Lore: Nature": 10 }, scar: "The harvest failed once before, in a year everyone agreed never to speak of." },
  { name: "Road-Born", attrs: ["agi", "pre"], grants: { "Riding": 15, "Navigation": 10 }, scar: "You still don't know why your caravan really changed its route that one winter." },
  { name: "Guild-Bound", attrs: ["int", "mig"], grants: { "Blacksmithing": 15, "Engineering": 10 }, scar: "The master who trained you vanished owing a debt you inherited without asking." },
  { name: "Condemned", attrs: ["wil", "end"], grants: { "Intimidation": 15, "Larceny": 10 }, scar: "There's a mark on you — brand, ledger, or memory — that says exactly what you did." },
  { name: "Sailor's Get", attrs: ["agi", "end"], grants: { "Sailing": 15, "Athletics": 10 }, scar: "The sea took someone from you and gave nothing back." },
  { name: "Hunter's Kin", attrs: ["agi", "int"], grants: { "Hunting": 15, "Tracking": 10 }, scar: "You know a place in the deep woods the animals refuse to enter, and you've never told anyone why." }
];

export const CULTURES = [
  { name: "Highland Clans", lang: "Old Clan-Tongue", grants: { "Athletics": 10 }, tenet: "A debt unpaid is a wound unhealed." },
  { name: "River-Cities", lang: "Trade-Cant", grants: { "Persuasion": 10 }, tenet: "Everything has a price; the fool is the one who doesn't know his." },
  { name: "Steppe-Riders", lang: "Steppe-Tongue", grants: { "Riding": 10 }, tenet: "The land doesn't belong to anyone who stops moving." },
  { name: "Coastal Free Towns", lang: "Coastal Pidgin", grants: { "Sailing": 10 }, tenet: "Loyalty is bought fresh every season; anyone who says otherwise is selling something." },
  { name: "Feudal Heartlands", lang: "High Courtly", grants: { "Lore: History": 10 }, tenet: "Your place was decided before you were born; what you do with it is the only choice you get." },
  { name: "Deep-Forest Folk", lang: "Wood-Speech", grants: { "Lore: Nature": 10 }, tenet: "The forest remembers everyone who breaks a promise in it." }
];

export const PROFESSIONS = [
  { name: "Sellsword", grants: { "Heavy Weapons": 20, "Shield Craft": 15, "Intimidation": 10 }, equipment: "Worn arming sword, dented shield, patched mail", boon: "Once per session, treat a Costly Success on a combat skill as a plain Success." },
  { name: "Hedge-Alchemist", grants: { "Alchemy": 25, "Herbalism": 15, "Medicine": 10 }, equipment: "Traveling still, locked case of components, battered formulary", boon: "Once per day, attempt an Alchemy Reckoning without a material component (Ch. 5)." },
  { name: "Former Soldier", grants: { "Polearms": 20, "Athletics": 15, "Leadership": 10 }, equipment: "Spear, worn gambeson, a unit token from a war no one discusses", boon: "+10 to Reckonings made to steady a routed ally (Ch. 3)." },
  { name: "Poacher", grants: { "Archery": 20, "Stealth": 15, "Hunting": 15 }, equipment: "Hunting bow, skinning kit, a mental map of every warden's blind spot", boon: "Always knows whether a wild area is actively patrolled." },
  { name: "Con Artist", grants: { "Deception": 20, "Insight": 15, "Streetwise": 15 }, equipment: "Forged papers (at least one still good), fine clothes worn thin at the cuffs", boon: "Once per session, retroactively declare a piece of “established” backstory true." },
  { name: "Lay Priest (Excommunicate)", grants: { "Insight": 20, "Lore: History": 15, "Medicine": 10 }, equipment: "Symbol of a faith that no longer claims them, a much-read prayer book", boon: "Resolve recovers fully on a full night's rest instead of half (Ch. 4)." },
  { name: "Grave-Robber", grants: { "Lore: History": 15, "Larceny": 15, "Athletics": 10 }, equipment: "Collapsible spade, grave-wax candle, unsold “finds”", boon: "+20 to Reckonings to appraise a found object's age and value." },
  { name: "Camp Cook", grants: { "Cooking": 25, "Herbalism": 15, "Brewing & Distilling": 10 }, equipment: "Well-kept knife roll, portable cookpot, a spice satchel worth more than it looks", boon: "A prepared meal's bonus applies to the whole party, not just the cook (Ch. 5)." },
  { name: "Wandering Medic", grants: { "Medicine": 25, "Herbalism": 15, "Insight": 10 }, equipment: "Surgeon's roll, clean bandages, a ledger of favors owed", boon: "A Masterstroke on Medicine heals an additional Wound level (Ch. 3)." },
  { name: "Smuggler", grants: { "Sailing": 15, "Streetwise": 15, "Deception": 15 }, equipment: "False-bottomed chest, a share in a small unmarked boat, three names that owe a favor", boon: "+20 to Reckonings to conceal goods from a search." }
];

export const DRIVES = [
  { name: "Debt", text: "you owe something to someone, or something, that can't be repaid in coin." },
  { name: "Vengeance", text: "someone specific has to answer for something specific." },
  { name: "Atonement", text: "you did a thing you cannot undo, and you're trying to be someone else now." },
  { name: "Legacy", text: "you're building or protecting something meant to outlast you." },
  { name: "Hunger", text: "you want more than you have, and you've stopped pretending otherwise." },
  { name: "Belonging", text: "you're looking for a place, or people, that will actually keep you." },
  { name: "Curiosity", text: "some question matters more to you than your own safety." },
  { name: "Freedom", text: "someone or something owns a piece of you, and you intend to take it back." }
];

export const TRAUMAS = [
  { name: "The Cold Room", trigger: "Confinement, being trapped", flinch: "−20 to all Reckonings until you act to escape or fight free." },
  { name: "The Silence After", trigger: "Sudden violence against someone helpless", flinch: "Willpower Reckoning or freeze for one exchange." },
  { name: "The Debt of Breath", trigger: "Someone dies because of a choice you made", flinch: "−20 to Reckonings touching that person's name, image, or memory, for the rest of the scene." },
  { name: "The Watching Dark", trigger: "Magic used nearby, or its aftermath", flinch: "−10 to all Reckonings until real distance is put between you and the working." },
  { name: "Never Enough", trigger: "Offered charity or unearned help", flinch: "Willpower Reckoning to accept it gracefully." },
  { name: "The Last Order", trigger: "Given a direct command by an authority figure", flinch: "Willpower Reckoning to refuse it, even when refusal is clearly right." },
  { name: "Salt and Ash", trigger: "Fire, or the smell of a structure burning", flinch: "−20 to all Reckonings for the rest of the scene." },
  { name: "The Unanswered Question", trigger: "A direct lie, told to your face, by someone you trusted", flinch: "You believe it once, automatically — no Reckoning permitted." }
];

export const MASKS = [
  { name: "The Velvet Mask", hook: "Once per session, treat any Social skill as Deception for one Reckoning." },
  { name: "The Long Game", hook: "Once per session, bank an unused Reckoning as Preparation; spend it later for an automatic Success on something you could plausibly have set up." },
  { name: "The Beautiful Ruin", hook: "+20 in service of the obsession — but the GM may complicate even a plain Success." },
  { name: "The Last Vow", hook: "Downgrade your own result one degree to serve the Vow; recover 2 Resolve when you do." }
];

export const BRANDS = [
  { name: "Ash-Veined", effect: "Grey webbing under the skin. −5 to Presence-based Reckonings with strangers; +5 Intimidation." },
  { name: "Beast-Eyes", effect: "See in darkness as dim light. Animals refuse you: −10 Riding and handling." },
  { name: "Numb Flesh", effect: "Ignore the −5 from one Wound at a time — but you don't feel Bleeding; the GM tracks it in secret." },
  { name: "The Wrong Shadow", effect: "Your shadow lags and looks elsewhere. −10 Stealth in any light; once per day it warns you: +10 against one ambush." },
  { name: "Cold Hearth", effect: "Fires gutter near you. Fire damage against you −1; everything you cook tastes of ash (−10 Cooking)." },
  { name: "Whisper-Ear", effect: "Once per session, ask the GM one yes/no question; the Seam answers truthfully. Each use: +1 Ash." },
  { name: "The Other Hunger", effect: "You must consume something unspeakable daily — grave-soil, tallow, raw liver — or take a Hungry Condition no food removes." },
  { name: "Leaking Dreams", effect: "Sleepers near you share your nightmares: the whole camp takes −5 to recovery unless you sleep apart." },
  { name: "Stitched Voice", effect: "Two voices speak when you do. −10 Deception; +5 Ritual Casting." },
  { name: "The Burning Sigil", effect: "A scar-glyph. Your Rites cost 1 less Resolve — and anyone trained to see it senses you within Near range." }
];

export const ATTR_LABELS = { mig: "Might", agi: "Agility", end: "Endurance", int: "Intellect", wil: "Willpower", pre: "Presence" };

export function grantsSummary(grants) {
  return Object.entries(grants ?? {}).map(([k, v]) => `${k} +${v}`).join(", ");
}

export function findByName(catalog, name) {
  return catalog.find(e => e.name === name) ?? null;
}

/** Sum the skill-name -> rank grants from the chosen Background/Culture/Profession. */
export function grantedRanks(bg, cu, pr) {
  const out = {};
  const add = (obj) => { if (!obj) return; for (const [k, v] of Object.entries(obj)) out[k] = (out[k] ?? 0) + v; };
  add(bg?.grants); add(cu?.grants); add(pr?.grants);
  return out;
}
