import { reckon } from "./reckoning.mjs";
import { BACKGROUNDS, CULTURES, PROFESSIONS, findByName, grantedRanks } from "./chargen.mjs";

const ATTR_KEYS = ["mig", "agi", "end", "int", "wil", "pre"];

/** Actor with Blightmarch derived-statistic preparation (ledger formulas). */
export class BlightmarchActor extends Actor {
  /** Carry forward pre-chargen-automation actors: their entered score becomes the base score. */
  static migrateData(source) {
    const attrs = source?.system?.attributes;
    if (attrs) {
      for (const k of ATTR_KEYS) {
        const a = attrs[k];
        if (a && a.base === undefined && a.value !== undefined) a.base = a.value;
      }
    }
    return super.migrateData(source);
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type === "character") this._prepareCharacter();
  }

  /** Auto-fill Language/Tenet from a newly-chosen Culture, and Equipment from a newly-chosen
   *  Profession, the same way the standalone Character Ledger does — but only into empty fields. */
  async _preUpdate(changed, options, user) {
    if (this.type === "character") {
      const d = changed.system?.details;
      if (d?.culture !== undefined) {
        const cu = findByName(CULTURES, d.culture);
        if (cu) {
          if (d.languages === undefined && !this.system.details.languages) d.languages = cu.lang;
          if (d.tenet === undefined && !this.system.details.tenet) d.tenet = cu.tenet;
        }
      }
      if (d?.profession !== undefined) {
        const pr = findByName(PROFESSIONS, d.profession);
        if (pr && d.equipment === undefined && !this.system.details.equipment) d.equipment = pr.equipment;
      }
    }
    return super._preUpdate(changed, options, user);
  }

  _prepareCharacter() {
    const sys = this.system;
    const a = sys.attributes;
    const details = sys.details;

    const bg = findByName(BACKGROUNDS, details.background);
    const cu = findByName(CULTURES, details.culture);
    const pr = findByName(PROFESSIONS, details.profession);
    sys.chargen = { bg, cu, pr };

    // Final score = entered base (1-20) + Background's +1 to two chosen Attributes; bonus = score - 10
    for (const k of ATTR_KEYS) {
      const base = Math.min(20, Math.max(1, a[k].base ?? a[k].value ?? 10));
      a[k].base = base;
      const bumped = !!bg?.attrs.includes(k);
      a[k].bumped = bumped;
      a[k].value = Math.min(20, base + (bumped ? 1 : 0));
      a[k].bonus = a[k].value - 10;
    }

    const End = a.end.value, WP = a.wil.value, Mig = a.mig.value, Int = a.int.value;

    // Derived statistics — exactly the book/ledger formulas
    sys.health.max = End + 10;
    sys.stamina.max = End + WP;
    sys.resolve.max = WP * 2;
    sys.composure.max = WP * 5;
    const d = sys.derived;
    d.woundThreshold = Math.ceil(End / 2);
    d.defense = 10 + a.agi.bonus;
    d.initiative = a.agi.bonus;
    d.meleeBonus = a.mig.bonus;
    d.encumbrance = Mig * 3;
    d.ashThreshold = WP;
    d.ritesHeld = Math.floor(Int / 2);
    d.standing = a.pre.value;                 // Standing = Presence (Rev 1.6)
    d.hollowAt = Math.ceil(WP / 2);           // Brands to Hollowing

    // Conditions: -5 each to all Reckonings, -2 max Stamina, stacking
    const conds = Object.values(sys.conditions ?? {}).filter(Boolean).length;
    sys.conditionPenalty = -5 * conds;
    sys.stamina.max = Math.max(0, sys.stamina.max - 2 * conds - (sys.armor?.burden ?? 0));

    // Wound penalty: stacking -5, capped at -10 (Rev 1.7)
    sys.wounds.penalty = -Math.min(10, 5 * (sys.wounds.count ?? 0));

    // Clamp current values to maxima
    sys.health.value = Math.min(sys.health.value ?? sys.health.max, sys.health.max);
    sys.stamina.value = Math.min(sys.stamina.value ?? sys.stamina.max, sys.stamina.max);

    // Background/Culture/Profession skill grants, by skill name
    const granted = grantedRanks(bg, cu, pr);

    // Per-skill rating = govA + govB (final) + granted + free ranks; live on owned skill items
    let freeSpent = 0;
    for (const item of this.items) {
      if (item.type !== "skill") continue;
      const s = item.system;
      const base = (a[s.govA]?.value ?? 10) + (a[s.govB]?.value ?? 10);
      const free = s.ranks ?? 0;
      const grant = granted[item.name] ?? 0;
      freeSpent += free;
      s.base = base;
      s.granted = grant;
      s.rating = base + grant + free;
      s.tier = tierOf(grant + free, s.rating);
    }
    sys.freeRanks = { spent: freeSpent, budget: 20, left: Math.max(0, 20 - freeSpent), over: freeSpent > 20 };
  }

  /** Roll a skill (or ad-hoc) Reckoning, folding in wound + condition penalties. */
  async rollSkill(skillId, { diff = 0 } = {}) {
    const item = this.items.get(skillId);
    const rating = item ? item.system.rating : 50;
    const label = item ? item.name : "Reckoning";
    const situational = (this.system.wounds?.penalty ?? 0) + (this.system.conditionPenalty ?? 0);
    return reckon({ rating, diff: diff + situational, label, actor: this });
  }

  async rollAttribute(key, { diff = 0 } = {}) {
    const rating = (this.system.attributes[key]?.value ?? 10) * 5; // attribute check = score x5
    return reckon({ rating, diff, label: `${key.toUpperCase()} check`, actor: this });
  }
}

export function tierOf(ranks, rating) {
  if (ranks <= 0) return "Untrained";
  if (rating <= 25) return "Novice";
  if (rating <= 50) return "Journeyman";
  if (rating <= 75) return "Adept";
  if (rating <= 95) return "Master";
  return "Legendary";
}

export class BlightmarchItem extends Item {}
