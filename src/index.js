import meow from 'meow'
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

const { input, flags, showHelp } = meow(help, config)

if (input.length !== 1) {
  showHelp()
} else {
  run(input[0], flags)
}
