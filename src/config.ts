import * as core from '@actions/core'

const key = core.getInput('key')

const config = {
  os: process.env.RUNNER_OS as 'Linux' | 'Windows' | 'macOS',
  restoreKey: `${key}-`,
  cacheKey: `${key}-${new Date().toISOString()}`,
  cache_dir: core.getInput('cache_dir'),
  compiler: core.getInput('compiler'),
  compiler_type: core.getInput('compiler_type'),
  path: core.getInput('path')
}

export default config
