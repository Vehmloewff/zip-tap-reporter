# zip-tap-reporter

A small and colorfull reporter for [zip-tap](https://github.com/Vehmloewff/zip-tap)

![CLI Output](https://github.com/Vehmloewff/zip-tap-reporter/tree/master/screenshot2.png)

![CLI Output](https://github.com/Vehmloewff/zip-tap-reporter/tree/master/screenshot2.png)

## Usage

```sh
npm i -D zip-tap-reporter
```

### CLI

```sh
node tests.js | zip-tap-reporter
```

### API

```js
const createReporter = require('../dist/build.cjs');

const reporter = createReporter();

process.stdin.on('data', reporter);
```

## License

[MIT](/LICENSE)
