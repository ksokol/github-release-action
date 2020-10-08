import {GitHub} from '@actions/github'
import * as fs from 'fs'
import {PathLike} from 'fs'
import * as glob from 'glob'
import * as path from 'path'
import * as mime from 'mime-types'

const contentLength = (filePath: PathLike) => fs.statSync(filePath).size

export async function run(uploadUrl: string, assetGlob: string) {
  const github = new GitHub(process.env.GITHUB_TOKEN)
  const assetFiles = glob.sync(assetGlob)

  for (let assetFile of assetFiles) {
    const headers = {
      'content-type': mime.lookup(assetFile) || 'application/octet-stream',
      'content-length': contentLength(assetFile)
    }

    // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset
    await github.repos.uploadReleaseAsset({
      url: uploadUrl,
      headers,
      name: path.basename(assetFile),
      file: fs.readFileSync(assetFile)
    })
  }
}
