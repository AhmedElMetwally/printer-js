"use strict";

const test = require("node:test");
const assert = require("node:assert");
const Printer = require("../printer.js");

const ASCII_PRINTABLE = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i))
    .filter((c) => !/[a-z]/.test(c))
    .join("");

test("renders a single letter", () => {
    assert.strictEqual(new Printer("A").write().toString(), [
        " ### ",
        "#   #",
        "#####",
        "#   #",
        "#   #",
    ].join("\n"));
});

test("joins characters with a two-cell gap", () => {
    assert.deepStrictEqual(new Printer("HI").write().word, [
        "#   #  ###",
        "#   #   # ",
        "#####   # ",
        "#   #   # ",
        "#   #  ###",
    ]);
});

test("uses custom shape and space characters", () => {
    assert.deepStrictEqual(new Printer("I", "*", ".").write().word, [
        "***",
        ".*.",
        ".*.",
        ".*.",
        "***",
    ]);
});

test("supports multi-character shape and space", () => {
    assert.strictEqual(new Printer("!", "@@", "--").write().word[3], "--");
    assert.strictEqual(new Printer("!", "@@", "--").write().word[0], "@@");
});

test("is case-insensitive", () => {
    assert.strictEqual(new Printer("hello").write().toString(), new Printer("HELLO").write().toString());
});

test("treats tabs and newlines as spaces", () => {
    assert.strictEqual(new Printer("A\tB\nC").write().toString(), new Printer("A B C").write().toString());
});

test("supports every printable ASCII character", () => {
    assert.strictEqual(ASCII_PRINTABLE.length, 69);
    for (const char of ASCII_PRINTABLE) {
        assert.ok(Printer.chars.includes(char), `missing ${JSON.stringify(char)}`);
        assert.doesNotThrow(() => new Printer(char).write(), `failed on ${JSON.stringify(char)}`);
    }
    assert.strictEqual(Printer.chars.length, ASCII_PRINTABLE.length);
});

test("every glyph is 5 rows high with equal-width rows", () => {
    for (const char of Printer.chars) {
        const rows = new Printer(char).write().word;
        assert.strictEqual(rows.length, 5, `height of ${JSON.stringify(char)}`);
        assert.strictEqual(new Set(rows.map((r) => r.length)).size, 1, `width of ${JSON.stringify(char)}`);
    }
});

test("every glyph except space draws something", () => {
    for (const char of Printer.chars.replace(" ", "")) {
        assert.match(new Printer(char).write().toString(), /#/, `blank glyph ${JSON.stringify(char)}`);
    }
});

test("all rows of a word have the same width", () => {
    const rows = new Printer("Hello, World! 123").write().word;
    assert.strictEqual(new Set(rows.map((r) => r.length)).size, 1);
});

test("empty text renders five empty rows", () => {
    assert.deepStrictEqual(new Printer("").write().word, ["", "", "", "", ""]);
});

test("calling write() twice does not duplicate output", () => {
    const printer = new Printer("OK");
    const once = printer.write().toString();
    assert.strictEqual(printer.write().toString(), once);
});

test("throws on unsupported characters", () => {
    assert.throws(() => new Printer("é").write(), /unsupported character "É"/);
    assert.throws(() => new Printer("😀").write(), /unsupported character/);
});

test("throws when text is not a string", () => {
    assert.throws(() => new Printer(42), TypeError);
    assert.throws(() => new Printer(), TypeError);
});

test("print() writes each row to the console and is chainable", (t) => {
    const log = t.mock.method(console, "log", () => {});
    const printer = new Printer("A").write();
    assert.strictEqual(printer.print(), printer);
    assert.strictEqual(log.mock.callCount(), 5);
    assert.deepStrictEqual(log.mock.calls[0].arguments, ["\x1b[36m%s\x1b[0m", " ### "]);
});

test("print() uses CSS styling in the browser", (t) => {
    global.window = {};
    t.after(() => delete global.window);
    const log = t.mock.method(console, "log", () => {});
    new Printer("A").write().print();
    assert.deepStrictEqual(log.mock.calls[0].arguments, ["%c%s", "color: #1797B1; font-weight: bold", " ### "]);
});

test("exposes Printer on window when loaded as a browser script", () => {
    const fs = require("node:fs");
    const vm = require("node:vm");
    const sandbox = { window: {}, console };
    vm.runInNewContext(fs.readFileSync(require.resolve("../printer.js"), "utf8"), sandbox);
    assert.strictEqual(typeof sandbox.window.Printer, "function");
    assert.strictEqual(new sandbox.window.Printer("A").write().word.length, 5);
});
