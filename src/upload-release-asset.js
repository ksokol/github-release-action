const { GitHub } = require('@actions/github')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const mime = require('mime-types')

const contentLength = filePath => fs.statSync(filePath).size

async function run(uploadUrl, assetGlob) {
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

module.exports = run
