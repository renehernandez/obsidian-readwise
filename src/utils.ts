const path = require("path");

export function getSecretsDirPath(): string {
    return path.join('.obsidian', 'secrets')
}

export function getTokenPath(): string {
    return path.join(getSecretsDirPath(), 'readwise_token');
}
