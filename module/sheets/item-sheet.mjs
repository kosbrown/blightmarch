export class BlightmarchItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["blightmarch", "sheet", "item"],
      template: "systems/blightmarch/templates/item/item-sheet.html",
      width: 480, height: 420
    });
  }
  async getData(options) {
    const ctx = await super.getData(options);
    ctx.system = this.item.system;
    return ctx;
  }
}
