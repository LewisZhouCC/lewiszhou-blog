import assert from "node:assert/strict";
import test from "node:test";
import { bottleneck, delegation, staffing, modelView, plotPoint, modelDefinitions, getModelDefinition, modelLabels, type ModelKind } from "./article-models.ts";

test("more Agents stop improving delivery when review is the bottleneck", () => {
  assert.equal(bottleneck(2, 10, 30).delivered, 8);
  assert.equal(bottleneck(8, 10, 30).delivered, 20);
  assert.equal(bottleneck(20, 10, 30).delivered, 20);
  assert.equal(bottleneck(20, 0, 30).delivered, 0);
  assert.equal(bottleneck(20, 40, 10).delivered, 60);
});

test("delegation preserves break-even and negative savings", () => {
  assert.equal(delegation(12, 5).released, 7);
  assert.equal(delegation(12, 12).released, 0);
  assert.equal(delegation(12, 14).released, -2);
  assert.equal(delegation(0, 0).released, 0);
});

test("staffing reproduces both article examples and the equality boundary", () => {
  assert.equal(staffing(2, 3).ratio, 2 / 3);
  assert.equal(staffing(5, 3).ratio, 5 / 3);
  assert.equal(staffing(3, 3).ratio, 1);
});

test("each single slider keeps charts finite and within their plot throughout its range", () => {
  for (const kind of Object.keys(modelDefinitions) as ModelKind[]) {
    const input = modelDefinitions[kind].input;
    for (let step = 0; step <= Math.round((input.max - input.min) / input.step); step++) {
      const value = Number((input.min + step * input.step).toFixed(1));
      const view = modelView(kind, value);
      assert.ok(!/NaN|Infinity/.test(view.value + view.detail));
      for (const point of [...view.lines.flatMap((line) => line.points), view.marker]) {
        const [x, y] = plotPoint(...point, view);
        assert.ok(Number.isFinite(x) && x >= 52 && x <= 580);
        assert.ok(Number.isFinite(y) && y >= 30 && y <= 252);
      }
    }
  }
});

test("the single sliders preserve all three experiments' key turning points", () => {
  assert.equal(modelView("bottleneck", 2).value, "8");
  assert.equal(modelView("bottleneck", 20).value, "20");
  assert.match(modelView("bottleneck", 5).summary, /Agent 产出与人工验收/);
  assert.equal(modelView("delegation", 5).value, "+7");
  assert.match(modelView("delegation", 12).summary, /收支相抵/);
  assert.match(modelView("delegation", 14).summary, /占用更多/);
  assert.equal(modelView("staffing", 2).value, "66.7%");
  assert.match(modelView("staffing", 3).summary, /不变/);
  assert.equal(modelView("staffing", 5).value, "166.7%");
});

test("English models preserve the same inputs, math and plots, and localize all visible copy", () => {
  for (const kind of Object.keys(modelDefinitions) as ModelKind[]) {
    const original = getModelDefinition(kind);
    const english = getModelDefinition(kind, "en");
    assert.deepEqual(
      { ...english.input, label: original.input.label, unit: original.input.unit },
      original.input,
    );
    assert.ok(!/\p{Script=Han}/u.test(JSON.stringify({ ...english, input: english.input })));
    for (const value of [original.input.min, original.input.value, original.input.max]) {
      const zh = modelView(kind, value);
      const en = modelView(kind, value, "en");
      assert.equal(zh.value, en.value);
      assert.deepEqual(zh.marker, en.marker);
      assert.deepEqual(zh.lines.map((line) => line.points), en.lines.map((line) => line.points));
      assert.ok(!/\p{Script=Han}/u.test(JSON.stringify(en)));
    }
  }
  assert.ok(!/\p{Script=Han}/u.test(JSON.stringify(modelLabels.en)));
});
