import { sync as glob } from 'glob'
import { red } from 'chalk'
import { join } from 'path'

import { isBenchmark, isSuite } from 'cathedra'
import defaultPresenter from 'cathedra-default-presenter'

const die = message => {
  console.log(`${red('✖')} ${message}`)
  process.exit(1)
}

const dieIf = condition => message => {
  if (condition) {
    die(message)
  }
}

const isBenchmarkLike = input => input && (isBenchmark(input) || isSuite(input))

const requireBenchmark = path => {
  try {
    const fullPath = join(process.cwd(), path)
    const result = require(join(process.cwd(), path))
    if (isBenchmarkLike(result)) {
      return result
    } else if (isBenchmarkLike(result.default)) {
      return result.default
    } else {
      return die(`expected benchmark or suite as default export or moduel.exports from ${fullPath}`)
    }
  } catch (e) {
    return die(e.message)
  }
}

const requirePresenter = path => {
  try {
    return require(path) // if an installed node module
  } catch (e1) {
    try {
      // if a local file
      return require(join(process.cwd(), path))
    } catch (e2) {
      return defaultPresenter()
    }
  }
}

export default (pattern, { presenter: presenterPath }) => {
  const files = glob(pattern)
  dieIf(files.length === 0)(`pattern ${pattern} yeilded no files`)

  files.map(requireBenchmark)
    .map(benchmark => benchmark())
    .forEach(requirePresenter(presenterPath))
}
