import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { process } from 'process';

export const REGISTRY_URL = 'https://raw.githubusercontent.com/FlexTail/npm-flextail/main/registry/registry.json';

export async function getRegistry() {
    try {
        const response = await fetch(REGISTRY_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch registry: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching registry. Check your internet connection or the URL.');
        console.error(error.message);
        process.exit(1);
    }
}

export async function getComponentBaseDir() {
    const srcPath = path.join(process.cwd(), 'src');
    try {
        const stat = await fs.stat(srcPath);
        if (stat.isDirectory()) {
            return 'src';
        }
    } catch (error) {
    }
    return '';
}

export async function getTsConfigPathAlias() {
    const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
    try {
        const content = await fs.readFile(tsConfigPath, 'utf8');
        const cleanedContent = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        const tsConfig = JSON.parse(cleanedContent);

        const paths = tsConfig.compilerOptions?.paths;

        if (paths) {
            for (const alias in paths) {
                if (alias.endsWith('/*') && paths[alias].includes('*')) {
                    return alias.substring(0, alias.length - 1);
                }
            }
        }
    } catch (error) {
    }
    return '';
}

export async function downloadAndSaveFile(url, targetPath, alias) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download file from ${url}: ${response.statusText}`);
        }

        let fileContent = await response.text();
        const dir = path.dirname(targetPath);

        if (alias) {
            fileContent = fileContent.replace(/@\//g, `${alias}/`);
            console.log(`\n    ➡️ Updated imports with alias: ${alias}/`);
        }

        await fs.mkdir(dir, { recursive: true });

        await fs.writeFile(targetPath, fileContent, 'utf8');
        console.log(`✅ File saved successfully to: ${targetPath}`);

    } catch (error) {
        console.error(`\n🚨 Error processing file for path ${targetPath}:`);
        throw error; 
    }
}
