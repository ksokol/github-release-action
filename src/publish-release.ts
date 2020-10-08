import {GitHub, context} from '@actions/github'

export async function run(release_id: number) {
  const github = new GitHub(process.env.GITHUB_TOKEN)
  const {owner, repo} = context.repo

  await github.repos.updateRelease({release_id, owner, repo, draft: false})
}
