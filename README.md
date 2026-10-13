# printer-js

[![npm](https://img.shields.io/npm/v/printer-js.svg)](https://www.npmjs.com/package/printer-js)
[![license](https://img.shields.io/npm/l/printer-js.svg)](LICENSE)

Print text as big ASCII-art banners in the terminal or the browser console, drawn with any character you like.

```
#   #  #####   ###   #   #        ####  #####   ###    ####  #   #
## ##  #      #   #  ##  #       #        #    #   #  #      #  #
# # #  ####   #####  # # #        ###     #    #####  #      ###
#   #  #      #   #  #  ##           #    #    #   #  #      #  #
#   #  #####  #   #  #   #       ####     #    #   #   ####  #   #
```

- No dependencies, a single file
- Works in Node.js and in the browser
- Supports all 69 printable ASCII characters: `A–Z`, `0–9`, space and ``!?.,:;'"`-_+=*/\|()[]{}<>#@$%^&~``
- Lowercase letters are drawn as uppercase

## Install

```bash
npm install printer-js
```

## Usage

### Node.js

```js
const Printer = require('printer-js');

new Printer('Hello World').write().print();
```

### Browser

```html
<script src="https://unpkg.com/printer-js"></script>
<script>
  new Printer('Hello World').write().print();
</script>
```

The script sets `window.Printer`. Open the dev tools console to see the output.

### Custom brush

The second argument draws the filled cells and the third draws the empty ones:

```js
new Printer('Hi!', '*', '.').write().print();
```

```
*...*..***..*
*...*...*...*
*****...*...*
*...*...*....
*...*..***..*
```

Keep both arguments the same length, otherwise the columns won't line up.

### Get the text instead of printing it

```js
const banner = new Printer('v1.0').write().toString();
// a multi-line string you can write to a file, a log, a README...
```

## API

### `new Printer(text, shape = '#', space = ' ')`

| Argument | Type     | Description                      |
| -------- | -------- | -------------------------------- |
| `text`   | `string` | The text to draw                 |
| `shape`  | `string` | Drawn for every filled cell      |
| `space`  | `string` | Drawn for every empty cell       |

Throws a `TypeError` if `text` is not a string.

### `.write()` → `this`

Builds the banner and stores its 5 rows in `.word` (an array of strings). Whitespace (tabs, newlines) is treated as a space. Throws an `Error` naming the character if the text contains one that isn't supported.

### `.print()` → `this`

Logs each row with `console.log`: cyan in a terminal, bold blue in the browser console.

### `.toString()` → `string`

Returns the rows joined with `\n`.

### `Printer.chars`

A string of every supported character.

## Example app

A small Express app that prints a banner in both the server terminal and the browser console:

```bash
git clone https://github.com/AhmedElMetwally/printer-js.git
cd printer-js/example
npm install
npm start
```

Then open http://localhost:8080 and the dev tools console.

## Development

```bash
npm test
```

The tests use the built-in `node:test` runner (Node.js 18 or newer).

## License

[MIT](LICENSE) © Ahmed ElMetwally
