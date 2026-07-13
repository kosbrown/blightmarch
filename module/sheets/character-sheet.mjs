import { reckonDialog, growthCheck } from "../helpers/reckoning.mjs";

export class BlightmarchCharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["blightmarch", "sheet", "actor", "character"],
      template: "systems/blightmarch/templates/actor/character-sheet.html",
      width: 820, height: 860,
      tabs: [{ navSelector: ".bm-tabs", contentSelector: ".bm-body", initial: "skills" }]
    });
  }

  async getData(options) {
    const ctx = await super.getData(options);
    ctx.system = this.actor.system;
    ctx.attrList = [
      ["mig", "Might"], ["agi", "Agility"], ["end", "Endurance"],
      ["int", "Intellect"], ["wil", "Willpower"], ["pre", "Presence"]
    ];
    // Group skills by category name stored on the item flag, else "Skills"
    ctx.skills = this.actor.items.filter(i => i.type === "skill")
      .sort((a, b) => a.name.localeCompare(b.name));
    ctx.techniques = this.actor.items.filter(i => i.type === "technique");
    ctx.brands = this.actor.items.filter(i => i.type === "brand");
    ctx.weapons = this.actor.items.filter(i => i.type === "weapon");
    ctx.armorItems = this.actor.items.filter(i => i.type === "armor");
    ctx.gear = this.actor.items.filter(i => i.type === "gear");
    ctx.enrichedBio = await TextEditor.enrichHTML(this.actor.system.details.biography ?? "", { async: true });
    return ctx;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    // Roll a skill Reckoning
    html.on("click", "[data-roll-skill]", (ev) => {
      const id = ev.currentTarget.dataset.rollSkill;
      const item = this.actor.items.get(id);
      reckonDialog({ rating: item?.system.rating ?? 50, label: item?.name ?? "Reckoning", actor: this.actor });
    });
    // Roll an attribute check
    html.on("click", "[data-roll-attr]", (ev) => {
      const k = ev.currentTarget.dataset.rollAttr;
      this.actor.rollAttribute(k);
    });
    // Growth check
    html.on("click", "[data-growth]", (ev) => {
      const id = ev.currentTarget.dataset.growth;
      const item = this.actor.items.get(id);
      growthCheck({ rating: item?.system.rating ?? 25, label: item?.name ?? "Growth", actor: this.actor });
    });
    // Ash pips
    html.on("click", ".bm-pip", (ev) => {
      const i = Number(ev.currentTarget.dataset.pip);
      const cur = this.actor.system.ash.value;
      this.actor.update({ "system.ash.value": cur === i + 1 ? i : i + 1 });
    });
    // Item create/edit/delete
    html.on("click", "[data-item-create]", (ev) => {
      const type = ev.currentTarget.dataset.itemCreate;
      this.actor.createEmbeddedDocuments("Item", [{ name: `New ${type}`, type }]);
    });
    html.on("click", "[data-item-edit]", (ev) => {
      this.actor.items.get(ev.currentTarget.closest("[data-item-id]").dataset.itemId)?.sheet.render(true);
    });
    html.on("click", "[data-item-delete]", (ev) => {
      const id = ev.currentTarget.closest("[data-item-id]").dataset.itemId;
      this.actor.deleteEmbeddedDocuments("Item", [id]);
    });
    // Condition toggles
    html.on("change", "[data-condition]", (ev) => {
      this.actor.update({ [`system.conditions.${ev.currentTarget.dataset.condition}`]: ev.currentTarget.checked });
    });
  }
}
