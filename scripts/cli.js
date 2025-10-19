#!/usr/bin/env node

import { Command } from 'commander';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const REGISTRY_URL = 'https://raw.githubusercontent.com/SyedArbaazHussain/npm-flextail/main/registry/registry.json';

async function getRegistry() {
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

async function downloadAndSaveFile(url, targetPath) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download file from ${url}: ${response.statusText}`);
        }

        const fileContent = await response.text();
        const dir = path.dirname(targetPath);

        await fs.mkdir(dir, { recursive: true });

        await fs.writeFile(targetPath, fileContent, 'utf8');
        console.log(`✅ File saved successfully to: ${targetPath}`);

    } catch (error) {
        console.error(`\n🚨 Error processing file for path ${targetPath}:`);
        console.error(error.message);
        throw error;
    }
}

async function addComponent(componentName) {
    console.log(`\n📦 FlexTail CLI: Adding component "${componentName}"...`);
    
    const registry = await getRegistry();
    const component = registry.find(c => c.name === componentName);

    if (!component) {
        console.error(`\n❌ Error: Component "${componentName}" not found in the registry.`);
        console.log(`Available components: ${registry.map(c => c.name).join(', ')}`);
        process.exit(1);
    }

    console.log(`\n🔍 Found component in registry. Fetching ${component.files.length} required files...`);

    try {
        for (const file of component.files) {
            await downloadAndSaveFile(file.content_url, file.target_path);
        }
        console.log(`\n🎉 Success! Component "${componentName}" and its dependencies are installed.`);
        console.log("Next steps: Ensure you have 'clsx' and 'tailwind-merge' installed in your project.");
    } catch (error) {
        console.error(`\n❌ Installation failed for component "${componentName}".`);
        process.exit(1);
    }
}

const program = new Command();

program
  .name('flextail-cli')
  .description('FlexTail CLI for managing and installing components.')
  .version('0.1.0');

program.command('add')
  .description('Add a component to your project.')
  .argument('<component-name>', 'The name of the component to add (e.g., button, card).')
    .action(addComponent); 
  
program.parse(process.argv);
