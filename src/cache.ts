import * as core from '@actions/core'
import * as cache from '@actions/cache'
import * as exec from '@actions/exec'

import config from './config'

async function run(): Promise<void> {
  try {
    // Show ccache statistics (hits and stuff)
    await exec.exec('ccache -s')

    // Save cache using key
    core.info(`Save cache using ${config.cacheKey}`)
    const paths = [config.cacheDir]
    await cache.saveCache(paths, config.cacheKey)
  } catch (error) {
    // Show fail error if there is any error
    core.setFailed(error.message)
  }
}

run()
