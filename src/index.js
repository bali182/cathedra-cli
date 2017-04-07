import meow from 'meow'
import isGlob from 'is-glob'
import { gray, bold, blue } from 'chalk'

import run from './run'

const config = {
  alias: {
    p: 'presenter',
    v: 'version'
  }
}

const help = `
${bold(blue('Usage'))}
  $ cathedra <glob> [...]
${bold(blue('Options'))}
  --presenter, -p                    ${gray('Path to a presenter')}
  --help, -h                         ${gray('Display this help')}
  --version, -v                      ${gray('Display version')}
${bold(blue('Examples'))}
  $ cathedra bench.js                ${gray('# running my-benchmark.js')}
  $ cathedra test/*.bench.js         ${gray('# running every benchmark in test')}
  $ cathedra bench.js -p my-pres.js  ${gray('# running with custom presenter')}
`.trim()

const cli = meow(help, config)

const { input, flags } = cli

if (input.length !== 1 || !isGlob(input[0])) {
  cli.showHelp()
}

const [path] = input

run(path, flags)
