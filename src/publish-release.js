const {GitHub, context} = require('@actions/github')

async function run(release_id) {
  const github = new GitHub(process.env.GITHUB_TOKEN)
  const {owner, repo} = context.repo

  await github.repos.updateRelease({release_id, owner, repo, draft: false})
}

module.exports = run
