import { reckonDialog } from "../helpers/reckoning.mjs";

export class BlightmarchNpcSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["blightmarch", "sheet", "actor", "npc"],
      template: "systems/blightmarch/templates/actor/npc-sheet.html",
      width: 620, height: 640
    });
  }

  async getData(options) {
    const ctx = await super.getData(options);
    ctx.system = this.actor.system;
    ctx.enrichedBio = await TextEditor.enrichHTML(this.actor.system.biography ?? "", { async: true });
    ctx.enrichedEco = await TextEditor.enrichHTML(this.actor.system.ecology ?? "", { async: true });
    return ctx;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
    html.on("click", "[data-roll-competence]", () => {
      reckonDialog({ rating: this.actor.system.competence ?? 50, label: this.actor.name, actor: this.actor });
    });
  }
}
