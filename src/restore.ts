import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as cache from '@actions/cache'

import config from './config'

async function setup(): Promise<void> {
  // Define install commands for different os
  const install = {
    Linux: 'sudo apt-get install -y ccache',
    Windows: 'choco install ccache',
    macOS: 'brew install ccache'
  }

  core.info(`Installing ccache on ${config.os}`)
  await exec.exec(install[config.os])
}

async function restore(): Promise<void> {
  // Recover key from input and configure cache key
  const restoreKey = config.restoreKey
  const paths = [config.cacheDir]
  const cachekey = config.cacheKey
  const restoreKeys = [restoreKey]

  // Restore the cache from key
  const restored = await cache.restoreCache(paths, cachekey, restoreKeys)
  if (restored) {
    core.info(`Restored cache from key ${restored}`)
  } else {
    core.info("Couldn't load cache")
  }
}

async function setConfig(key: string, value: string): Promise<void> {
  await exec.exec(`ccache --set-config=${key}=${value}`)
}

async function run(): Promise<void> {
  try {
    await setup()
    await restore()

    // Configure ccache
    core.info('Configuring ccache...')
    const cacheDir = `${process.env.GITHUB_WORKSPACE}/${config.cacheDir}`
    await setConfig('cache_dir', cacheDir)
    await setConfig('compression', 'true')

    // warn for windows
    if (config.os === 'Windows') {
      core.warning(
        'ccache may not work properly on windows, if you are using MSVC compiler.'
      )
    }

    // Show ccache config
    core.info('Ccache configuration:')
    await exec.exec('ccache -p')

    // Zero the ccache statistics
    await exec.exec('ccache -z')
  } catch (error: any) {
    // Show fail error if there is any error
    core.error(error)
    core.setFailed(error.message)
  }
}

run()
