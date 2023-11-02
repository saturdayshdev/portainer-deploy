"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStackConfig = exports.parseEnv = exports.parsePontainerConfig = void 0;
const core = require("@actions/core");
const fs = require("fs");
const parsePontainerConfig = async () => {
    const baseUrl = core.getInput('url', { required: true });
    const username = core.getInput('username', { required: true });
    const password = core.getInput('password', { required: true });
    const endpointId = Number(core.getInput('endpoint', { required: true }));
    return {
        baseUrl,
        username,
        password,
        endpointId,
    };
};
exports.parsePontainerConfig = parsePontainerConfig;
const parseEnv = async () => {
    const env = core.getInput('env');
    if (!env)
        return undefined;
    const envs = env.split('\n');
    return envs.map((env) => {
        const [key, value] = env.split('=');
        return { key, value };
    });
};
exports.parseEnv = parseEnv;
const parseStackConfig = async () => {
    const name = core.getInput('name', { required: true });
    const filePath = core.getInput('path', { required: true });
    const pullImage = core.getInput('pull') === 'true';
    const prune = core.getInput('prune') === 'true';
    const composeFile = fs.readFileSync(filePath, 'utf8');
    return {
        name,
        composeFile,
        pullImage,
        prune,
    };
};
exports.parseStackConfig = parseStackConfig;
