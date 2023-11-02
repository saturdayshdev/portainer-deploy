interface PortainerConfig {
  baseUrl: string
  username: string
  password: string
  endpointId: number
}

interface StackConfig {
  name: string
  composeFile: string
  pullImage: boolean
  prune: boolean
}

interface StackEnv {
  [key: string]: string
}
