import {context, getOctokit} from '@actions/github'
import * as fs from 'fs'
import {PathLike} from 'fs'
import * as glob from 'glob'
import * as path from 'path'
import * as mime from 'mime-types'

const contentLength = (filePath: PathLike) => fs.statSync(filePath).size

export async function run(release_id: number, assetGlob: string) {
  const github = getOctokit(process.env.GITHUB_TOKEN)
  const {owner, repo} = context.repo
  const assetFiles = glob.sync(assetGlob)

  for (let assetFile of assetFiles) {
    const headers = {
      'content-type': mime.lookup(assetFile) || 'application/octet-stream',
      'content-length': contentLength(assetFile)
    }

    // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
    // Octokit Documentation: https://octokit.github.io/rest.js/v18/#repos
    await github.repos.uploadReleaseAsset({
      owner,
      repo,
      release_id,
      headers,
      name: path.basename(assetFile),
      data: fs.readFileSync(assetFile)
    })
  }
}
