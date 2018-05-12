#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const { prompt } = require('inquirer');
const CLI = require('clui');
const Spinner = CLI.Spinner;

const { getTrafficViewsForAllRepos } = require('./traffic-fetcher');
const { version, description } = require('./package.json');

// Craft questions to present to users
const questions = [
  {
    type: 'input',
    name: 'username',
    message: 'Enter your GitHub user name'
  },
  {
    type: 'password',
    name: 'token',
    message: 'Enter your GitHub OAuth token (only necessary if 2FA is enabled)'
  },
  {
    type: 'password',
    name: 'password',
    message:
      'Enter your GitHub password (leave empty if you use a GitHub OAuth token)'
  }
];

program.version(version).description(description);

program
  .command('views')
  .alias('v')
  .action(async options => {
    console.log(chalk.yellow(figlet.textSync('GitHub Traffic Views')));

    const { token, username, password } = await prompt(questions);

    if (!username) {
      console.error(chalk.red(`Aborted: Username is mandatory!`));
      return;
    }

    const countdown = new Spinner('Fetching data...');
    countdown.start();

    let authOptions;

    if (token) {
      authOptions = { token };
    } else if (!token && username && password) {
      authOptions = { username, password };
    } else {
      console.error(
        chalk.red(
          `Aborted: Please enter a valid OAuth token or username/password combination`
        )
      );
      countdown.stop();
      return;
    }

    await getTrafficViewsForAllRepos(username, authOptions);

    countdown.stop();
  });

program.parse(process.argv);
