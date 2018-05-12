const fetch = require('node-fetch');
const chalk = require('chalk');
const traffic = require('github-traffic');

const GITHUB_API_URL = 'https://api.github.com';

function githubTrafficViews(repo, options) {
  return new Promise((resolve, reject) => {
    traffic.views(repo, { ...options }, (err, results) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(results);
    });
  });
}

const getTrafficViewsForAllRepos = async (username, options) => {
  // Get all repos of the user
  const reposRes = await fetch(`${GITHUB_API_URL}/users/${username}/repos`);
  const repos = await reposRes.json();

  // Filter all forks and map to repository names only
  const repoNames = repos
    .filter(repo => !repo.fork)
    .map(repo => `${username}/${repo.name}`);

  const views = await Promise.all(
    repoNames.map(name => githubTrafficViews(name, { ...options }))
  );
  for (let i = 0; i < repoNames.length; i++) {
    console.info(
      chalk.green(
        `Traffic views for GitHub user "${username}" and repo "${repoNames[i]}"`
      ),
      views[i]
    );
  }
};

module.exports = { getTrafficViewsForAllRepos };
