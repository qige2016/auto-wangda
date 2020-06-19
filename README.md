# auto-wangda
> 好好学习，天天搬砖

## Status

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![](https://img.shields.io/circleci/project/github/qige2016/auto-wangda.svg)](https://circleci.com/gh/qige2016/auto-wangda/tree/master)
[![](https://img.shields.io/npm/v/auto-wangda.svg)](https://www.npmjs.com/package/auto-wangda)
[![](https://img.shields.io/npm/dm/auto-wangda.svg)](https://www.npmjs.com/package/auto-wangda)
[![](https://img.shields.io/npm/l/auto-wangda.svg)](https://www.npmjs.com/package/auto-wangda)
[![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Installation

```bash
npm i -g auto-wangda
```

## CLI Usage

```bash
autoWangda
```

## Usage

``` javascript
const AutoWangda = require('auto-wangda')

const data = {
  username: '',
  password: ''
}
const subjectId = ''

const autoWangda = new AutoWangda({ data, subjectId })
autoWangda.run()
```

## License

MIT &copy; qige2016
