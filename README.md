
# interpreting

> Require any file extension of interpret dictionary.

[![Version npm](https://img.shields.io/npm/v/interpreting.svg?style=flat)](https://www.npmjs.com/package/interpreting) [![NPM Week Downloads](https://img.shields.io/npm/dw/interpreting.svg?style=flat)](https://www.npmjs.com/package/interpreting) [![Build Status](https://img.shields.io/travis/rferro/interpreting.svg?style=flat)](https://travis-ci.org/rferro/interpreting) [![Dependencies](https://img.shields.io/david/rferro/interpreting.svg?style=flat)](https://david-dm.org/rferro/interpreting) [![Dev Dependencies](https://img.shields.io/david/dev/rferro/interpreting.svg?style=flat)](https://david-dm.org/rferro/interpreting?type=dev) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat)](https://standardjs.com)

Require using the dictionary of file extensions and associated module loaders from [interpret](https://github.com/js-cli/js-interpret) dictionary. Useful, for example, to allow config files in any supported file extension, like requiring webpack config file just doing `interpreting('./webpack.config')`.

Available file extensions and the associated module loader:
  - `.js`: *none*
  - `.babel.js`: `babel-register`
  - `.buble.js`: `buble`
  - `.cirru`: `cirru-script`
  - `.cjsx`: `node-cjsx`
  - `.co`: `coco`
  - `.coffee`: `coffee-script`
  - `.coffee.md`: `coffee-script`
  - `.csv`: `require-csv`
  - `.eg`: `earlgrey`
  - `.iced`: `iced-coffee-script`
  - `.iced.md`: `iced-coffee-script`
  - `.ini`: `require-ini`
  - `.json`: *none*
  - `.json5`: `json5`
  - `.jsx`: `babel-register`
  - `.litcoffee`: `coffee-script`
  - `.liticed`: `iced-coffee-script`
  - `.ls`: `livescript`
  - `.node`: *none*
  - `.toml`: `toml-require`
  - `.ts`: `ts-node`
  - `.tsx`: `ts-node`
  - `.wisp`: `wisp`
  - `.xml`: `require-xml`
  - `.yaml`: `require-yaml`
  - `.yml`: `require-yaml`

## Install

### npm

```sh
npm install --save interpreting
```

### yarn

```sh
yarn add interpreting
```

## Usage

```js
const interpreting = require('interpreting')
// or
import interpreting from 'interpreting'
```

### Examples

```js
// config.babel.js
export const value = 1
```

```js
interpreting('./config')
// { value: 1 }
```

## API

### interpreting(path, [options])

If `path` or `path.*` not exists, returns `null` or throws a error if `options.required` is `true`.

#### path

- Type: `string` `string[]`

File or list of files to require.

#### options

##### required

- Type: `boolean`
- Default: `false`

If true, at least one file must be found.

##### multiple

- Type: `boolean`
- Default: `false`

If `false` returns the first found file. Otherwise, returns an array with all files founded.

##### join

- Type: `boolean`
- Default: `false`

If `true` and `multiple` is true, returns the `Object.assign()` result for all files.

## Resources

- [interpret](https://github.com/js-cli/js-interpret) - A dictionary of file extensions and associated module loaders.

## Authors

- Ricardo Ferro <ricardo.ferro@gmail.com>

## License

MIT
