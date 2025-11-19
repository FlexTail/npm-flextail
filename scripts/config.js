import fs from 'fs/promises';
import path from 'path';

export const CONFIG_FILE = path.join(process.cwd(), '.flextailrc.json');

let configCache = null;

export async function getConfig() {
    if (configCache) {
        return configCache;
    }

    try {
        const configContent = await fs.readFile(CONFIG_FILE, 'utf8');
        const config = JSON.parse(configContent);
        configCache = config;
        return config;
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('🚨 Error: Configuration file not found.');
            console.error(`File not found at: ${CONFIG_FILE}`);
            console.error('\nPlease run \`flextail init\` to set up your project.');
        } else if (error instanceof SyntaxError) {
            console.error('🚨 Error: Configuration file is malformed.');
            console.error(`Could not parse JSON in ${CONFIG_FILE}`);
            console.error(error.message);
        } else {
            console.error(`🚨 An unexpected error occurred while reading the config: ${error.message}`);
        }
        
        process.exit(1);
    }
}