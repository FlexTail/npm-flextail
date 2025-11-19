import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';

export const CONFIG_FILE = path.join(process.cwd(), '.flextailrc.json');
export const REGISTRY_URL = 'https://raw.githubusercontent.com/FlexTail/Flextail-components/main/registry.json';

export async function getRegistry() {
  try {
    const response = await fetch(REGISTRY_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch registry: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('🚨 Fatal Error: Could not fetch component registry.');
    console.error(`Reason: ${error.message}. Check your internet connection or the URL.`);
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

export async function getComponentPathPreference() {
  let config = {};

  try {
    const content = await fs.readFile(CONFIG_FILE, 'utf8');
    config = JSON.parse(content);

    if (config.pathMode) {
      console.log(`\n⚙️ Using stored component path preference: ${config.pathMode} ${config.customPath ? `(${config.customPath})` : ''}`);
      return {
        mode: config.pathMode,
        customPath: config.customPath,
      };
    }
  } catch (error) {
  }

  console.log('\n✨ Welcome to FlexTail Component Installer!');
  const response = await prompts({
    type: 'select',
    name: 'pathMode',
    message: 'How would you like to specify the component save path?',
    choices: [
      { title: 'Auto (Recommended)', value: 'auto', description: 'Automatically determines the path (e.g., src or current directory).' },
      { title: 'Custom', value: 'custom', description: 'Allows you to enter a custom relative path.' },
    ],
    initial: 0
  });

  if (response.pathMode === undefined) {
    console.log('\n👋 Operation cancelled.');
    process.exit(0);
  }

  let customPath = '';

  if (response.pathMode === 'custom') {
    const customPathResponse = await prompts({
      type: 'text',
      name: 'path',
      message: 'Enter the custom relative root path (e.g., src or app or pages):',
      validate: value => value.trim() !== '' ? true : 'Path cannot be empty.',
      initial: 'src'
    });

    if (customPathResponse.path === undefined) {
      console.log('\n👋 Operation cancelled.');
      process.exit(0);
    }

    customPath = customPathResponse.path.trim().replace(/\\/g, '/');
  } else if (response.pathMode === 'auto') {
    const baseDir = await getComponentBaseDir();
    customPath = baseDir || '.';
    console.log(`\n🤖 Auto-detected root path: ${customPath}`);
  }

  try {
    config.pathMode = response.pathMode;
    if (customPath) {
      config.customPath = customPath;
    } else {
      delete config.customPath;
    }
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    console.log(`\n💾 Preference saved to ${path.basename(CONFIG_FILE)} for future use.`);
  } catch (error) {
    console.error('\n⚠️ Warning: Could not save path preference. Operation will proceed but preference is not stored.');
  }

  return { mode: response.pathMode, customPath: customPath };
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
    console.error(`\n🚨 Fatal Error: Could not process file for path ${targetPath}.`);
    console.error(`Reason: ${error.message}`);
    process.exit(1);
  }
}