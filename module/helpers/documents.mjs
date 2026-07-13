import { reckon } from "./reckoning.mjs";

const ATTR_KEYS = ["mig", "agi", "end", "int", "wil", "pre"];

/** Actor with Blightmarch derived-statistic preparation (ledger formulas). */
export class BlightmarchActor extends Actor {
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type === "character") this._prepareCharacter();
  }

  _prepareCharacter() {
    const sys = this.system;
    const a = sys.attributes;
    // Attribute bonuses = score - 10
    for (const k of ATTR_KEYS) a[k].bonus = (a[k].value ?? 10) - 10;

    const End = a.end.value, WP = a.wil.value, Mig = a.mig.value, Int = a.int.value, Agi = a.agi.value;

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

    // Per-skill rating = govA + govB (final) + ranks; live on owned skill items
    for (const item of this.items) {
      if (item.type !== "skill") continue;
      const s = item.system;
      const base = (a[s.govA]?.value ?? 10) + (a[s.govB]?.value ?? 10);
      s.base = base;
      s.rating = base + (s.ranks ?? 0);
      s.tier = tierOf(s.ranks ?? 0, s.rating);
    }
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
