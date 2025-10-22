import path from 'path';
import { getRegistry, getComponentBaseDir, getTsConfigPathAlias, downloadAndSaveFile } from './cli-utils.js';

export async function addComponent(componentName) {
    console.log(`\n📦 FlexTail CLI: Adding component "${componentName}"...`);
    
    const registry = await getRegistry();
    const component = registry.find(c => c.name.toLowerCase() === componentName.toLowerCase());

    if (!component) {
        console.error(`\n❌ Error: Component "${componentName}" not found in the registry.`);
        console.log(`Available components: ${registry.map(c => c.name).join(', ')}`);
        process.exit(1);
    }

    console.log(`\n🔍 Found component in registry. Fetching ${component.files.length} required files...`);

    const baseDir = await getComponentBaseDir();
    if (baseDir) {
        console.log(`📝 Detected 'src' directory. Using installation path prefix: '${baseDir}/'`);
    } else {
        console.log(`📝 No 'src' directory detected. Using installation path prefix: './'`);
    }

    const pathAlias = await getTsConfigPathAlias();
    if (pathAlias) {
        console.log(`🔗 Found project path alias in tsconfig.json: '${pathAlias}'`);
    } else {
        console.log(`🔗 No path alias detected in tsconfig.json. Imports will use relative paths.`);
    }

    try {
        for (const file of component.files) {
            const finalTargetPath = path.normalize(path.join(baseDir, file.target_path));
            
            await downloadAndSaveFile(file.content_url, finalTargetPath, pathAlias);
        }
        console.log(`\n🎉 Success! Component "${componentName}" and its dependencies are installed.`);
    } catch (error) {
        console.error(`\n❌ Installation failed for component "${componentName}".`);
        process.exit(1);
    }
}
