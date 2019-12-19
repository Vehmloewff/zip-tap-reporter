# zip-tap-reporter

A small and colorful reporter for [zip-tap](https://github.com/Vehmloewff/zip-tap)

<p align="center">
    <img src="https://github.com/Vehmloewff/zip-tap-reporter/raw/master/screenshot.png">
</p>

## Usage

```sh
npm i -D zip-tap-reporter
```

### CLI

Just prefix your test command with `zip-tap-reporter`.

```bash
zip-tap-reporter node tests.js
```

If the command that you run your tests with is complex, just wrap it in quotes:

```bash
zip-tap-reporter "node globbed-tests.js | some-filter"
```

#### Piping

`zip-tap-reporter` also works on a pipe.

```bash
node tests.js | zip-tap-reporter
```

This feature is depreciated though, and will be removed in the next major release.

### API

```js
const createReporter = require('zip-tap-reporter');

const reporter = createReporter();

process.stdin.on('data', reporter.log);
```

See [`bin/cmd`](bin/cmd) for more information.

## License

[MIT](/LICENSE)
