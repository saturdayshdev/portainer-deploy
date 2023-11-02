declare const parsePontainerConfig: () => Promise<PortainerConfig>;
declare const parseEnv: () => Promise<StackEnv[] | null>;
declare const parseStackConfig: () => Promise<StackConfig>;
export { parsePontainerConfig, parseEnv, parseStackConfig };
