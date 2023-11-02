"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portainer_client_1 = require("@saturdayshdev/portainer-client");
const core = require("@actions/core");
const config = require("./config");
const run = async () => {
    try {
        core.startGroup('Get Config');
        const portainerConfig = await config.parsePontainerConfig();
        const stackConfig = await config.parseStackConfig();
        const env = await config.parseEnv();
        core.endGroup();
        core.startGroup('Authentication');
        const portainer = new portainer_client_1.PortainerClient({
            baseUrl: portainerConfig.baseUrl,
            username: portainerConfig.username,
            password: portainerConfig.password,
        });
        await portainer.authenticate();
        core.endGroup();
        core.startGroup('Deploy Stack');
        const stacks = await portainer.stacks.getAll({
            endpointId: portainerConfig.endpointId,
        });
        const stackExists = stacks.some((stack) => stack.Name === stackConfig.name);
        if (stackExists) {
            await portainer.stacks.update({
                endpointId: portainerConfig.endpointId,
                stackId: stackConfig.name,
                stackFileContent: stackConfig.composeFile,
                env,
            });
            core.info('Stack Updated');
        }
        else {
            await portainer.stacks.createStandalone({
                endpointId: portainerConfig.endpointId,
                stackName: stackConfig.name,
                stackFileContent: stackConfig.composeFile,
                env,
            });
            core.info('Stack Created');
        }
        core.endGroup();
    }
    catch (err) {
        core.setFailed(`Action failed: ${err.message}`);
    }
};
run();
