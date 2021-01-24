#!/usr/bin/env node

const { program } = require('commander');
const packageJson = require('../package.json');

// version
program.version(packageJson.version, '-V, --version');
// init
program.command('init').description('init config file').action(require('./actions/init'));
// deploy
program.command('deploy').description('deploy project').option('-e, --env <env>', 'environment', '').action(require('./actions/deploy'));
// rollback
program.command('rollback').description('project rollback deploy').option('-e, --env <env>', 'environment', '').action(require('./actions/rollback'));

program.parse(process.argv);