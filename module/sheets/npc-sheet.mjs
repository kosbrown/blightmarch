import { reckonDialog } from "../helpers/reckoning.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class BlightmarchNpcSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["blightmarch", "sheet", "actor", "npc"],
    tag: "form",
    position: { width: 620, height: 640 },
    window: { resizable: true },
    form: { submitOnChange: true, closeOnSubmit: false },
    actions: {
      editImage: BlightmarchNpcSheet.#onEditImage,
      rollCompetence: BlightmarchNpcSheet.#onRollCompetence
    }
  };

  static PARTS = {
    form: { template: "systems/blightmarch/templates/actor/npc-sheet.html", scrollable: [""] }
  };

  get title() {
    return this.actor.name;
  }

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    ctx.actor = this.actor;
    ctx.system = this.actor.system;
    const TextEditorImpl = foundry.applications.ux.TextEditor.implementation;
    ctx.enrichedBio = await TextEditorImpl.enrichHTML(this.actor.system.biography ?? "", { relativeTo: this.actor });
    ctx.enrichedEco = await TextEditorImpl.enrichHTML(this.actor.system.ecology ?? "", { relativeTo: this.actor });
    return ctx;
  }

  static async #onEditImage(event, target) {
    const attr = target.dataset.edit || "img";
    const current = foundry.utils.getProperty(this.actor, attr);
    new FilePicker({
      type: "image",
      current,
      callback: (path) => this.actor.update({ [attr]: path })
    }).browse();
  }

  static #onRollCompetence(event, target) {
    reckonDialog({ rating: this.actor.system.competence ?? 50, label: this.actor.name, actor: this.actor });
  }
}
