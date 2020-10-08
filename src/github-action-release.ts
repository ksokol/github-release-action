import * as core from '@actions/core'
import {run as createDraftRelease} from './create-draft-release'
import {run as uploadReleaseAsset} from './upload-release-asset'
import {run as publishRelease} from './publish-release'

export async function run() {
  try {
    const tagName = core.getInput('tag_name', { required: true }).replace('refs/tags/', '')
    const releaseName = core.getInput('release_name', { required: true }).replace('refs/tags/', '')
    const assetGlob = core.getInput('asset_glob', { required: true })

    const {releaseId} = await createDraftRelease(tagName, releaseName)

    await uploadReleaseAsset(releaseId, assetGlob)

    await publishRelease(releaseId)
  } catch (error) {
    core.setFailed(error.message)
  }
}
