const core = require('@actions/core')
const createDraftRelease = require('./create-draft-release')
const uploadReleaseAsset = require('./upload-release-asset')
const publishRelease = require('./publish-release')

async function run() {
  try {
    const tagName = core.getInput('tag_name', { required: true }).replace('refs/tags/', '')
    const releaseName = core.getInput('release_name', { required: true }).replace('refs/tags/', '')

    const {releaseId, uploadUrl} = await createDraftRelease(tagName, releaseName)

    const assetPath = core.getInput('asset_path', { required: true })
    const assetName = core.getInput('asset_name', { required: true })
    const assetContentType = core.getInput('asset_content_type', { required: true })

    await uploadReleaseAsset(uploadUrl, assetName, assetPath, assetContentType)

    await publishRelease(releaseId)
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = run
