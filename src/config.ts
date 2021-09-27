import * as core from '@actions/core'

const key = core.getInput('key')

const config = {
  os: process.env.RUNNER_OS as 'Linux' | 'Windows' | 'macOS',
  restoreKey: `${key}-`,
  cacheKey: `${key}-${new Date().toISOString()}`,
  cacheDir: '.ccache'
}

export default config
