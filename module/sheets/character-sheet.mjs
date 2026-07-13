import { reckonDialog, growthCheck } from "../helpers/reckoning.mjs";
import {
  BACKGROUNDS, CULTURES, PROFESSIONS, DRIVES, TRAUMAS, MASKS, BRANDS,
  ATTR_LABELS, findByName, grantsSummary
} from "../helpers/chargen.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

const ATTR_ORDER = ["mig", "agi", "end", "int", "wil", "pre"];
const CATEGORY_ORDER = ["Combat", "Physical", "Mental & Knowledge", "Social", "Craft & Trade", "Wilderness & Underworld", "Esoteric"];
const SECTIONS = ["skills", "combat", "ash", "story", "gear"];

function nameChoices(catalog, current) {
  const choices = Object.fromEntries(catalog.map((e) => [e.name, e.name]));
  if (current && !choices[current]) choices[current] = `${current} (custom)`;
  return choices;
}

export class BlightmarchCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["blightmarch", "sheet", "actor", "character"],
    tag: "form",
    position: { width: 900, height: 900 },
    window: { resizable: true },
    form: { submitOnChange: true, closeOnSubmit: false },
    actions: {
      editImage: BlightmarchCharacterSheet.#onEditImage,
      toggleSection: BlightmarchCharacterSheet.#onToggleSection,
      rollSkill: BlightmarchCharacterSheet.#onRollSkill,
      rollAttr: BlightmarchCharacterSheet.#onRollAttr,
      growth: BlightmarchCharacterSheet.#onGrowth,
      ashPip: BlightmarchCharacterSheet.#onAshPip,
      itemCreate: BlightmarchCharacterSheet.#onItemCreate,
      itemEdit: BlightmarchCharacterSheet.#onItemEdit,
      itemDelete: BlightmarchCharacterSheet.#onItemDelete,
      brandAdd: BlightmarchCharacterSheet.#onBrandAdd
    }
  };

  static PARTS = {
    form: { template: "systems/blightmarch/templates/actor/character-sheet.html", scrollable: [""] }
  };

  #openSections = new Set(SECTIONS);

  get title() {
    return this.actor.name;
  }

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const actor = this.actor;
    const sys = actor.system;
    ctx.actor = actor;
    ctx.system = sys;
    ctx.sectionOpen = Object.fromEntries(SECTIONS.map((id) => [id, this.#openSections.has(id)]));

    ctx.attrRows = ATTR_ORDER.map((key) => ({ key, label: ATTR_LABELS[key], ...sys.attributes[key] }));

    const skills = actor.items.filter((i) => i.type === "skill").sort((a, b) => a.name.localeCompare(b.name));
    const byCat = new Map();
    for (const s of skills) {
      const cat = s.flags?.blightmarch?.category ?? "Other";
      if (!byCat.has(cat)) byCat.set(cat, []);
      byCat.get(cat).push(s);
    }
    ctx.skillGroups = [...CATEGORY_ORDER, ...[...byCat.keys()].filter((c) => !CATEGORY_ORDER.includes(c))]
      .filter((c) => byCat.has(c))
      .map((category) => ({ category, rows: byCat.get(category) }));

    ctx.techniques = actor.items.filter((i) => i.type === "technique");
    ctx.brands = actor.items.filter((i) => i.type === "brand");
    ctx.weapons = actor.items.filter((i) => i.type === "weapon");
    ctx.armorItems = actor.items.filter((i) => i.type === "armor");
    ctx.gear = actor.items.filter((i) => i.type === "gear");

    const bg = sys.chargen?.bg, cu = sys.chargen?.cu, pr = sys.chargen?.pr;
    const drive = findByName(DRIVES, sys.details.drive);
    const trauma = findByName(TRAUMAS, sys.details.trauma);
    const mask = findByName(MASKS, sys.details.mask);

    ctx.backgroundChoices = nameChoices(BACKGROUNDS, sys.details.background);
    ctx.cultureChoices = nameChoices(CULTURES, sys.details.culture);
    ctx.professionChoices = nameChoices(PROFESSIONS, sys.details.profession);
    ctx.driveChoices = nameChoices(DRIVES, sys.details.drive);
    ctx.traumaChoices = nameChoices(TRAUMAS, sys.details.trauma);
    ctx.maskChoices = nameChoices(MASKS, sys.details.mask);

    ctx.bgDetail = bg
      ? `<b>${bg.attrs.map((k) => `+1 ${ATTR_LABELS[k]}`).join(", ")}</b> · ${grantsSummary(bg.grants)}<br><span class="tag">Scar:</span> ${bg.scar}`
      : "Grants +1 to two Attributes, two skills, and a Scar.";
    ctx.cuDetail = cu
      ? `<b>${cu.lang}</b> · ${grantsSummary(cu.grants)}<br><span class="tag">Tenet:</span> ${cu.tenet}`
      : "Grants a Language, one skill at +10, and a Tenet.";
    ctx.prDetail = pr
      ? `${grantsSummary(pr.grants)}<br><span class="tag">Boon:</span> ${pr.boon}`
      : "Grants three skills, an equipment package, and a Trade Boon.";
    ctx.driveDetail = drive ? `<b>${drive.name}</b> — ${drive.text}` : "The engine under everything the character does.";
    ctx.traumaDetail = trauma
      ? `<span class="tag">Trigger:</span> ${trauma.trigger}<br><span class="tag">Flinch:</span> ${trauma.flinch}`
      : "A scar that still bites: a Trigger, and a Flinch.";
    ctx.maskDetail = mask ? `<span class="tag">Hook:</span> ${mask.hook}` : "A public face over a private Truth, with a Hook.";

    ctx.brandCatalog = BRANDS.map((b, index) => ({ index, name: b.name }));
    ctx.ashPips = Array.from({ length: sys.derived.ashThreshold }, (_, i) => ({ index: i, on: i < sys.ash.value }));
    ctx.blighted = sys.derived.ashThreshold > 0 && sys.ash.value >= sys.derived.ashThreshold;
    return ctx;
  }

  _onRender(context, options) {
    super._onRender(context, options);
    if (!this.isEditable) return;
    this.element.querySelectorAll("[data-skill-ranks]").forEach((el) => {
      el.addEventListener("change", (ev) => {
        const id = ev.currentTarget.dataset.skillRanks;
        const val = Math.max(0, parseInt(ev.currentTarget.value, 10) || 0);
        this.actor.items.get(id)?.update({ "system.ranks": val });
      });
    });
  }

  static #onEditImage(event, target) {
    const attr = target.dataset.edit || "img";
    const current = foundry.utils.getProperty(this.actor, attr);
    new FilePicker({
      type: "image",
      current,
      callback: (path) => this.actor.update({ [attr]: path })
    }).browse();
  }

  static #onToggleSection(event, target) {
    const id = target.dataset.section;
    const section = target.closest(".bm-group");
    const nowOpen = !section.classList.contains("open");
    section.classList.toggle("open", nowOpen);
    if (nowOpen) this.#openSections.add(id); else this.#openSections.delete(id);
  }

  static #onRollSkill(event, target) {
    const item = this.actor.items.get(target.dataset.rollSkill);
    reckonDialog({ rating: item?.system.rating ?? 50, label: item?.name ?? "Reckoning", actor: this.actor });
  }

  static #onRollAttr(event, target) {
    this.actor.rollAttribute(target.dataset.rollAttr);
  }

  static #onGrowth(event, target) {
    const item = this.actor.items.get(target.dataset.growth);
    growthCheck({ rating: item?.system.rating ?? 25, label: item?.name ?? "Growth", actor: this.actor });
  }

  static #onAshPip(event, target) {
    const i = Number(target.dataset.pip);
    const cur = this.actor.system.ash.value;
    this.actor.update({ "system.ash.value": cur === i + 1 ? i : i + 1 });
  }

  static #onItemCreate(event, target) {
    const type = target.dataset.itemCreate;
    this.actor.createEmbeddedDocuments("Item", [{ name: `New ${type}`, type }]);
  }

  static #onItemEdit(event, target) {
    const id = target.closest("[data-item-id]")?.dataset.itemId;
    this.actor.items.get(id)?.sheet.render(true);
  }

  static #onItemDelete(event, target) {
    const id = target.closest("[data-item-id]")?.dataset.itemId;
    if (id) this.actor.deleteEmbeddedDocuments("Item", [id]);
  }

  static #onBrandAdd(event, target) {
    const select = target.closest(".brandrow")?.querySelector("[data-brand-pick]");
    const idx = Number(select?.value);
    if (!Number.isInteger(idx) || !BRANDS[idx]) return;
    const brand = BRANDS[idx];
    this.actor.createEmbeddedDocuments("Item", [{
      name: brand.name, type: "brand", system: { index: idx, description: brand.effect }
    }]);
    if (select) select.value = "";
  }
}
