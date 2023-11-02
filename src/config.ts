import * as core from '@actions/core'
import * as fs from 'fs'

const parsePontainerConfig = async (): Promise<PortainerConfig> => {
  const baseUrl = core.getInput('url', { required: true })
  const username = core.getInput('username', { required: true })
  const password = core.getInput('password', { required: true })
  const endpointId = Number(core.getInput('endpoint', { required: true }))

  return {
    baseUrl,
    username,
    password,
    endpointId,
  }
}

const parseEnv = async (): Promise<StackEnv[] | null> => {
  const env = core.getInput('env')
  if (!env) return undefined

  const envs = env.split('\n')
  return envs.map((env) => {
    const [name, value] = env.split('=')

    return { name, value }
  })
}

const parseStackConfig = async (): Promise<StackConfig> => {
  const name = core.getInput('name', { required: true })
  const filePath = core.getInput('path', { required: true })
  const pullImage = core.getInput('pull') === 'true'
  const prune = core.getInput('prune') === 'true'
  const composeFile = fs.readFileSync(filePath, 'utf8')

  return {
    name,
    composeFile,
    pullImage,
    prune,
  }
}

export { parsePontainerConfig, parseEnv, parseStackConfig }
