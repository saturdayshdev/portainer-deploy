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
    const existingStack = stacks.some((stack) => stack.Name === stackConfig.name)
    core.endGroup()

    core.startGroup('Deploy Stack')
    if (existingStack) {
      core.debug(JSON.stringify({
        id: existingStack.Id,
        endpointId: portainerConfig.endpointId,
        stackConfig: {
          stackFileContent: stackConfig.composeFile,
          pullImage: stackConfig.pullImage,
          prune: stackConfig.prune,
          env,
        }
      }))

      await portainer.stacks.update({
        id: existingStack.Id,
        endpointId: portainerConfig.endpointId,
        stackConfig: {
          stackFileContent: stackConfig.composeFile,
          pullImage: stackConfig.pullImage,
          prune: stackConfig.prune,
          env,
        }
      })

      core.info('Stack Updated')
    } 
    else {
      core.debug(JSON.stringify({
        endpointId: portainerConfig.endpointId,
        stackConfig: {
          name: stackConfig.name,
          stackFileContent: stackConfig.composeFile,
          env,
        }
      }))

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
