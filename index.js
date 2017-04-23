#!/usr/bin/env node
'use strict';
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
var meow = _interopDefault(require('meow'));
var chalk = require('chalk');
var glob = require('glob');
var path = require('path');
var cathedra = require('cathedra');
var defaultPresenter = _interopDefault(require('cathedra-default-presenter'));
var die = function die(message) {
  console.log(chalk.red('✖') + ' ' + message);
  process.exit(1);
};
var dieIf = function dieIf(condition) {
  return function (message) {
    if (condition) {
      die(message);
    }
  };
};
var isBenchmarkLike = function isBenchmarkLike(input) {
  return input && (cathedra.isBenchmark(input) || cathedra.isSuite(input));
};
var requireBenchmark = function requireBenchmark(path$$1) {
  try {
    var fullPath = path.join(process.cwd(), path$$1);
    var result = require(path.join(process.cwd(), path$$1));
    if (isBenchmarkLike(result)) {
      return result;
    } else if (isBenchmarkLike(result.default)) {
      return result.default;
    } else {
      return die('expected benchmark or suite as default export or moduel.exports from ' + fullPath);
    }
  } catch (e) {
    return die(e.message);
  }
};
var requirePresenter = function requirePresenter(path$$1) {
  try {
    return require(path$$1); // if an installed node module
  } catch (e1) {
    try {
      // if a local file
      return require(path.join(process.cwd(), path$$1));
    } catch (e2) {
      return defaultPresenter();
    }
  }
};
var run = (function (pattern, _ref) {
  var presenterPath = _ref.presenter;
  var files = glob.sync(pattern);
  dieIf(files.length === 0)('pattern ' + pattern + ' yeilded no files');
  files.map(requireBenchmark).map(function (benchmark) {
    return benchmark();
  }).forEach(requirePresenter(presenterPath));
});
var config = {
  alias: {
    p: 'presenter',
    v: 'version'
  }
};
var help = ('\n' + chalk.bold(chalk.blue('Usage')) + '\n  $ cathedra <glob> [...]\n' + chalk.bold(chalk.blue('Options')) + '\n  --presenter, -p                    ' + chalk.gray('Path to a presenter') + '\n  --help, -h                         ' + chalk.gray('Display this help') + '\n  --version, -v                      ' + chalk.gray('Display version') + '\n' + chalk.bold(chalk.blue('Examples')) + '\n  $ cathedra bench.js                ' + chalk.gray('# running my-benchmark.js') + '\n  $ cathedra test/*.bench.js         ' + chalk.gray('# running every benchmark in test') + '\n  $ cathedra bench.js -p my-pres.js  ' + chalk.gray('# running with custom presenter') + '\n').trim();
var _meow = meow(help, config);
var input = _meow.input;
var flags = _meow.flags;
var showHelp = _meow.showHelp;
if (input.length !== 1) {
  showHelp();
} else {
  run(input[0], flags);
}
