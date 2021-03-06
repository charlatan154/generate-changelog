'use strict';

var CLI = require('commander');

var Package = require('../package');

function list (val) {
  return val.split(',');
}

module.exports = CLI
  .description('Generate a changelog from git commits.')
  .version(Package.version)
  .option('-p, --patch', 'create a patch changelog')
  .option('-m, --minor', 'create a minor changelog')
  .option('-M, --major', 'create a major changelog')
  .option('-x, --exclude', 'exclude selected commit types (comma separated)', list)
  .option('-f, --file [file]', 'file to write to, defaults to ./CHANGELOG.md, use - for stdout', './CHANGELOG.md')
  .option('-u, --repo-url [url]', 'specify the repo URL for commit links, defaults to checking the package.json')
  .option('-o, --pom', 'Search and check pom.xml instead of package.json');
