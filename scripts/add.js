import path from 'path';
import fs from 'fs/promises';
import { getRegistry, downloadAndSaveFile } from './helpers.js';
import { getConfig } from './config.js';

const checkFileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (e) {
    return false;
  }
};

async function installComponentAndDeps(componentName, context, isDependency = false) {
  if (context.installed.has(componentName)) {
    return;
  }

  const component = context.registry.find(c => c.name.toLowerCase() === componentName.toLowerCase());

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
      await installComponentAndDeps(depName, context, true);
    }
  }

  for (const file of component.files) {
    const finalTargetPath = path.normalize(path.join(context.saveDir, file.target_path));

    if (isDependency && await checkFileExists(finalTargetPath)) {
      console.log(`  ⏩ Dependency file already present: ${finalTargetPath}`);
      continue;
    }
    await downloadAndSaveFile(file.content_url, finalTargetPath, context.alias);
  }
  context.installed.add(componentName);
}

export async function addComponent(componentName) {
  console.log(`\n📦 FlexTail CLI: Adding component "${componentName}"...`);

  const [config, registry] = await Promise.all([
    getConfig(),
    getRegistry()
  ]);

  const primaryComponent = registry.find(c => c.name.toLowerCase() === componentName.toLowerCase());

  if (!primaryComponent) {
    console.error(`\n❌ Error: Component "${componentName}" not found in the registry.`);
    console.log(`Available components: ${registry.map(c => c.name).join(', ')}`);
    process.exit(1);
  }

  const context = {
    registry: registry,
    saveDir: path.normalize(path.join(process.cwd(), config.aliases.components)),
    alias: config.aliases.path,
    installed: new Set()
  };
  
  console.log(`\n🛠️  Installing to: ${config.aliases.components}`);
  if (context.alias) {
    console.log(`🔗  Using alias: '${context.alias}'`);
  }

  try {
    await installComponentAndDeps(componentName, context);
    console.log(`\n🎉 Success! Component "${componentName}" and all dependencies are installed.`);

    if (primaryComponent.npmDependencies && primaryComponent.npmDependencies.length > 0) {
      console.log(`\n🔔 Note: This component requires a manual install:`);
      console.log(`  npm install ${primaryComponent.npmDependencies.join(' ')}`);
    }

  } catch (error) {
    console.error(`\n❌ Installation failed for component "${componentName}".`);
    if (error.message !== 'Missing Dependency') {
      console.error(`Reason: ${error.message}`);
    }
    process.exit(1);
  }
}