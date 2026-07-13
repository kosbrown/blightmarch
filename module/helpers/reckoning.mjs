/**
 * The Reckoning — Blightmarch's core resolution.
 * Roll d100 <= Rating (LOW IS GOOD). Bands, ascending:
 *   Masterstroke  1 .. ceil(eff/5)
 *   Success       .. eff
 *   Costly Success.. min(eff+20, 95)
 *   Failure       (else)
 *   96-99 = the World's Share: always Failure at any Rating
 *   100   = always Catastrophe ("even legends can die to bad luck")
 * Difficulty shifts Rating by +/-20/40/60, clamped to an effective 5..95.
 */
export const DIFFICULTY = {
  trivial: 40, easy: 20, normal: 0, hard: -20, veryhard: -40, nearlyimpossible: -60
};

export function bandOf(rating, roll, diff = 0) {
  const eff = Math.max(5, Math.min(95, rating + diff));
  const ms = Math.max(1, Math.ceil(eff / 5));
  if (roll === 100) return { key: "catastrophe", label: "Catastrophe", eff };
  if (roll >= 96) return { key: "failure", label: "Failure (World's Share)", eff };
  if (roll <= ms) return { key: "masterstroke", label: "Masterstroke", eff };
  if (roll <= eff) return { key: "success", label: "Success", eff };
  if (roll <= Math.min(eff + 20, 95)) return { key: "costly", label: "Costly Success", eff };
  return { key: "failure", label: "Failure", eff };
}

const BAND_COLOR = {
  masterstroke: "#d0a84a", success: "#7d9663", costly: "#c07a30",
  failure: "#8a7f68", catastrophe: "#b03a2e"
};

/**
 * Roll a Reckoning and post a styled chat card.
 * @param {object} opts {rating, diff, label, actor, flavor}
 */
export async function reckon({ rating = 50, diff = 0, label = "Reckoning", actor = null } = {}) {
  const roll = await (new Roll("1d100")).evaluate();
  const band = bandOf(rating, roll.total, diff);
  const eff = band.eff;
  const ms = Math.max(1, Math.ceil(eff / 5));
  const costlyTop = Math.min(eff + 20, 95);
  const scale =
    `<div class="bm-scale">
       <span class="bm-seg ms">MS \u2264${ms}</span>
       <span class="bm-seg su">S \u2264${eff}</span>
       <span class="bm-seg co">CS \u2264${costlyTop}</span>
       <span class="bm-seg wo">96\u201399 fail \u00b7 100 cat</span>
     </div>`;
  const diffTxt = diff ? ` <span class="bm-diff">(${diff > 0 ? "+" : ""}${diff} diff \u2192 eff ${eff})</span>` : "";
  const content =
    `<div class="bm-card">
       <header class="bm-card-h"><b>${label}</b>${diffTxt}</header>
       <div class="bm-result" style="color:${BAND_COLOR[band.key]}">
         <span class="bm-roll">${roll.total}</span>
         <span class="bm-band">${band.label}</span>
       </div>
       <div class="bm-vs">rolled under Rating ${rating}${diff ? " \u2192 " + eff : ""}</div>
       ${scale}
     </div>`;
  const speaker = ChatMessage.getSpeaker({ actor });
  await roll.toMessage({ speaker, flavor: content }, { rollMode: game.settings.get("core", "rollMode") });
  return { roll, band };
}

/** A Growth Check: d100 ABOVE current Rating improves the skill by +1d6. */
export async function growthCheck({ rating = 25, label = "Growth Check", actor = null } = {}) {
  const roll = await (new Roll("1d100")).evaluate();
  const improved = roll.total > rating;
  let gain = 0, gTxt = "";
  if (improved) {
    const g = await (new Roll("1d6")).evaluate();
    gain = g.total; gTxt = ` \u2014 <b>+${gain} Rank${gain > 1 ? "s" : ""}</b>`;
  }
  const content =
    `<div class="bm-card">
       <header class="bm-card-h"><b>${label}</b> (current ${rating})</header>
       <div class="bm-result" style="color:${improved ? "#7d9663" : "#8a7f68"}">
         <span class="bm-roll">${roll.total}</span>
         <span class="bm-band">${improved ? "It sticks" : "No growth this time"}</span>
       </div>
       <div class="bm-vs">need ABOVE ${rating} to improve${gTxt}</div>
     </div>`;
  await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor }), flavor: content });
  return { roll, improved, gain };
}

/** Dialog wrapper: prompt for rating + difficulty, then reckon. */
export async function reckonDialog({ rating = 50, label = "Reckoning", actor = null } = {}) {
  const diffOptions = Object.entries({
    "Trivial (+40)": 40, "Easy (+20)": 20, "Normal (0)": 0,
    "Hard (\u221220)": -20, "Very Hard (\u221240)": -40, "Nearly Impossible (\u221260)": -60
  }).map(([k, v]) => `<option value="${v}"${v === 0 ? " selected" : ""}>${k}</option>`).join("");

  const result = await foundry.applications.api.DialogV2.wait({
    window: { title: `Reckoning \u2014 ${label}` },
    content:
      `<div class="form-group"><label>Skill Rating</label>
         <input type="number" name="rating" value="${rating}" min="1" max="120"/></div>
       <div class="form-group"><label>Difficulty</label>
         <select name="diff">${diffOptions}</select></div>`,
    buttons: [{
      action: "roll", label: "Roll", icon: "fas fa-dice", default: true,
      callback: (event, button) => ({
        rating: Number(button.form.elements.rating.value),
        diff: Number(button.form.elements.diff.value)
      })
    }],
    rejectClose: false
  });
  if (!result) return null;
  return reckon({ rating: result.rating, diff: result.diff, label, actor });
}
