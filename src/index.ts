import { PortainerClient } from '@saturdayshdev/portainer-client'
import * as core from '@actions/core'
import * as config from './config'

const run = async (): Promise<void> => {
  try {
    core.startGroup('Get Config')
    const portainerConfig = await config.parsePontainerConfig()
    const stackConfig = await config.parseStackConfig()
    const env = await config.parseEnv()
    core.endGroup()

    core.startGroup('Authentication')
    const portainer = new PortainerClient({
      baseUrl: portainerConfig.baseUrl,
      username: portainerConfig.username,
      password: portainerConfig.password,
    }) 
    await portainer.authenticate()
    core.endGroup()

    core.startGroup('Check Stack')
    const stacks = await portainer.stacks.getAll({
      endpointId: portainerConfig.endpointId,
    })
    const stackExists = stacks.some((stack) => stack.Name === stackConfig.name)
    core.endGroup()

    core.startGroup('Deploy Stack')
    if (stackExists) {
      await portainer.stacks.update({
        endpointId: portainerConfig.endpointId,
        stackConfig: {
          stackId: stackConfig.name,
          stackFileContent: stackConfig.composeFile,
          env,
        }
      })

      core.info('Stack Updated')
    } 
    else {
      await portainer.stacks.createStandalone({
        endpointId: portainerConfig.endpointId,
        stackConfig: {
          name: stackConfig.name,
          stackFileContent: stackConfig.composeFile,
          env,
        }
      })

      core.info('Stack Created')
    }

    core.endGroup()
  } 
  catch (err) {
    core.setFailed(`Action failed: ${err.message}`)
  }
}

run()
