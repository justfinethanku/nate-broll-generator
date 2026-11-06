import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import vm from 'node:vm';

const html = readFileSync(process.env.BRIEFING_HTML || new URL('../docs/broll_pipeline_visualization.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function briefing({clipboard = 'reject', fallback = false} = {}) {
  const state = {focus: null, selected: '', clipboard: [], fallback: [], timers: []};
  const field = {
    value: 'First paragraph.\n\nSecond paragraph.',
    focus() { state.focus = field; },
    select() { state.selected = field.value; },
  };
  const status = {textContent: ''};
  const buttons = Array.from({length: 2}, () => ({
    focus() {state.focus = this;},
    addEventListener(type, handler) {
      assert.equal(type, 'click');
      this.click = () => { state.focus = this; return handler({currentTarget: this}); };
    },
  }));
  const navigator = clipboard === 'absent' ? {} : {clipboard: {async writeText(text) {
    if (clipboard === 'reject') throw Error('Permission denied');
    state.clipboard.push(text);
  }}};
  const document = {
    get activeElement() {return state.focus;},
    getElementById: id => ({briefText: field, copyStatus: status})[id],
    querySelectorAll: () => buttons,
    execCommand(command) {
      state.fallback.push(command);
      if (fallback === 'throw') throw Error('Copy unsupported');
      return fallback;
    },
  };
  const window = {setTimeout(callback) {state.timers.push(callback);}};
  vm.runInNewContext(script, {navigator, document, window});
  return {state, field, status, buttons};
}

test('read-only summary has an associated name and keyboard instructions', () => {
  assert.match(html, /<label\b[^>]*for="briefText"[^>]*>[^<]+<\/label>/);
  assert.match(html, /<textarea\b[^>]*aria-describedby="copyHelp"/);
  assert.match(html, /id="copyHelp"[^>]*>[^<]*Ctrl\+C[^<]*Command\+C/);
  assert.match(html, /id="copyStatus"[^>]*role="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"/);
});

test('wide diagrams and decisions have named keyboard-scrollable regions', () => {
  for (const name of ['assembly', 'loop', 'table-scroll']) {
    assert.match(html, new RegExp(`<div class="${name}"[^>]*role="region"[^>]*tabindex="0"[^>]*aria-label="[^\"]+"`));
  }
});

for (const index of [0, 1]) {
  test(`copy button ${index + 1}: modern clipboard copies exact text and retains focus`, async () => {
    const {state, field, status, buttons} = briefing({clipboard: 'allow'});
    await buttons[index].click();
    assert.deepEqual(state.clipboard, [field.value]);
    assert.deepEqual(state.fallback, []);
    assert.equal(state.focus, buttons[index]);
    assert.equal(status.textContent, 'Copied.');
  });

  for (const clipboard of ['reject', 'absent']) {
    test(`copy button ${index + 1}: ${clipboard} clipboard uses successful legacy copy and restores focus`, async () => {
      const {state, field, status, buttons} = briefing({clipboard, fallback: true});
      await buttons[index].click();
      assert.deepEqual(state.fallback, ['copy']);
      assert.equal(state.selected, field.value);
      assert.equal(state.focus, buttons[index]);
      assert.equal(status.textContent, 'Copied.');
    });
  }

  for (const fallback of [false, 'throw']) {
    test(`copy button ${index + 1}: legacy ${fallback} selects text and keeps manual-copy help`, async () => {
      const {state, field, status, buttons} = briefing({fallback});
      await buttons[index].click();
      assert.equal(state.selected, field.value);
      assert.equal(state.focus, field);
      assert.match(status.textContent, /unavailable.*Ctrl\+C.*Command\+C/);
      for (const timer of state.timers) timer();
      assert.match(status.textContent, /Ctrl\+C.*Command\+C/, 'manual instructions must remain available');
    });
  }
}

// Contrast against each element's solid background (the page grid is decorative).
function contrast(a, b) {
  function luminance(hex) {
    const values = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return values.reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  }
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
}

test('small station descriptions and copy feedback meet 4.5:1 contrast', () => {
  const variables = Object.fromEntries([...html.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/g)].map(m => [m[1], m[2]]));
  function color(selector) {
    const rules = [...html.matchAll(new RegExp(selector + " \\{([^}]+)\\}", "g"))];
    const rule = rules.map(m => m[1]).find(body => /(?:^|;)\s*color:/.test(body));
    const value = rule.match(/(?:^|;)\s*color:\s*([^;]+);/)[1];
    return value.startsWith('var(') ? variables[value.slice(6, -1)] : value;
  }
  assert.ok(contrast(color('\\.station-head span'), variables['paper-2']) >= 4.5);
  assert.ok(contrast(color('\\.status'), variables.paper) >= 4.5);
});
