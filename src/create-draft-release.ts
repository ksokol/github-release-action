import {getOctokit, context} from '@actions/github'

export async function run(tagName: string, releaseName: string) {
  const github = getOctokit(process.env.GITHUB_TOKEN)
  const { owner, repo } = context.repo

  // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
  // Octokit Documentation: https://octokit.github.io/rest.js/v18/#repos
  const createReleaseResponse = await github.repos.createRelease({
    owner,
    repo,
    tag_name: tagName,
    name: releaseName,
    body: undefined,
    draft: true,
    prerelease: false
  })

  const {
    data: {id: releaseId}
  } = createReleaseResponse

  return {
    releaseId,
  }
}
