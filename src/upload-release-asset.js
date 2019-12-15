const { GitHub } = require('@actions/github')
const fs = require('fs')

async function run(uploadUrl, assetName, assetPath, assetContentType) {
  const github = new GitHub(process.env.GITHUB_TOKEN)
  const contentLength = filePath => fs.statSync(filePath).size
  const headers = {
    'content-type': assetContentType,
    'content-length': contentLength(assetPath)
  }

  // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
  // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset
  await github.repos.uploadReleaseAsset({
    url: uploadUrl,
    headers,
    name: assetName,
    file: fs.readFileSync(assetPath)
  })
}

module.exports = run
