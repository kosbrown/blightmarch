const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export class BlightmarchItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["blightmarch", "sheet", "item"],
    tag: "form",
    position: { width: 480, height: 420 },
    window: { resizable: true },
    form: { submitOnChange: true, closeOnSubmit: false },
    actions: {
      editImage: BlightmarchItemSheet.#onEditImage
    }
  };

  static PARTS = {
    form: { template: "systems/blightmarch/templates/item/item-sheet.html", scrollable: [""] }
  };

  get title() {
    return this.item.name;
  }

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    ctx.item = this.item;
    ctx.system = this.item.system;
    return ctx;
  }

  static async #onEditImage(event, target) {
    const attr = target.dataset.edit || "img";
    const current = foundry.utils.getProperty(this.item, attr);
    new FilePicker({
      type: "image",
      current,
      callback: (path) => this.item.update({ [attr]: path })
    }).browse();
  }
}
