import path from 'path';
import fs from 'fs/promises';
import { getRegistry, getTsConfigPathAlias, downloadAndSaveFile, getComponentPathPreference } from './cli-utils.js';

const checkFileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (e) {
    return false;
  }
};

let installedComponents = new Set();
let componentSaveDir = '';
let registry = [];
let pathAlias = '';

async function installComponentAndDeps(componentName, isDependency = false) {
  if (installedComponents.has(componentName)) {
    return;
  }

  const component = registry.find(c => c.name.toLowerCase() === componentName.toLowerCase());

  if (!component) {
    console.error(`\n❌ Error: Dependency "${componentName}" not found in the registry.`);
    throw new Error('Missing Dependency');
  }

  if (!isDependency) {
    console.log(`\n🔍 Found component "${componentName}". Fetching files...`);
  } else {
    console.log(`\n  🔗 Installing dependency: "${componentName}"...`);
  }

  if (component.deps && component.deps.length > 0) {
    for (const depName of component.deps) {
      await installComponentAndDeps(depName, true);
    }
  }

  for (const file of component.files) {
    const finalTargetPath = path.normalize(path.join(componentSaveDir, file.target_path));

    if (isDependency && await checkFileExists(finalTargetPath)) {
      console.log(`  ⏩ Dependency file already present: ${finalTargetPath}`);
      continue;
    }

    await downloadAndSaveFile(file.content_url, finalTargetPath, pathAlias);
  }

  installedComponents.add(componentName);
}

export async function addComponent(componentName) {
  installedComponents = new Set();

  console.log(`\n📦 FlexTail CLI: Adding component "${componentName}"...`);

  registry = await getRegistry();
  const primaryComponent = registry.find(c => c.name.toLowerCase() === componentName.toLowerCase());

  if (!primaryComponent) {
    console.error(`\n❌ Error: Component "${componentName}" not found in the registry.`);
    console.log(`Available components: ${registry.map(c => c.name).join(', ')}`);
    process.exit(1);
  }

  const preference = await getComponentPathPreference();
  componentSaveDir = preference.customPath;

  if (!componentSaveDir) {
    console.error('\n🚨 Error: Failed to determine component save path.');
    process.exit(1);
  }

  if (preference.mode === 'custom') {
    console.log(`\n🛠️ Custom path selected: ${componentSaveDir}`);
  } else {
    console.log(`\n🤖 Auto root path determined: ${componentSaveDir}`);
  }

  pathAlias = await getTsConfigPathAlias();
  if (pathAlias) {
    console.log(`🔗 Found project path alias in tsconfig.json: '${pathAlias}'`);
  } else {
    console.log(`🔗 No path alias detected in tsconfig.json. Imports will use relative paths.`);
  }

  try {
    await installComponentAndDeps(componentName);
    console.log(`\n🎉 Success! Component "${componentName}" and all dependencies are installed.`);
  } catch (error) {
    console.error(`\n❌ Installation failed for component "${componentName}".`);
    if (error.message !== 'Missing Dependency') {
      console.error(`Reason: ${error.message}`);
    }
    process.exit(1);
  }
}