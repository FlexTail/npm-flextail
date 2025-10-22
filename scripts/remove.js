import path from 'path';
import fs from 'fs/promises';
import { process } from 'process';
import { getRegistry, getComponentBaseDir } from './cli-utils.js';

export async function removeComponent(componentName) {
    console.log(`\n📦 FlexTail CLI: Removing component "${componentName}"...`);
    
    const registry = await getRegistry();
    const component = registry.find(c => c.name.toLowerCase() === componentName.toLowerCase());

    if (!component) {
        console.error(`\n❌ Error: Component "${componentName}" not found in the registry.`);
        console.log(`Available components: ${registry.map(c => c.name).join(', ')}`);
        process.exit(1);
    }

    console.log(`\n🔍 Found component in registry. Preparing to remove ${component.files.length} files...`);

    const baseDir = await getComponentBaseDir();
    if (baseDir) {
        console.log(`📝 Detected 'src' directory. Using installation path prefix: '${baseDir}/'`);
    } else {
        console.log(`📝 No 'src' directory detected. Using installation path prefix: './'`);
    }

    let allRemoved = true;

    try {
        for (const file of component.files) {
            const finalTargetPath = path.normalize(path.join(baseDir, file.target_path));
            
            try {
                await fs.unlink(finalTargetPath);
                console.log(`🗑️ File removed successfully: ${finalTargetPath}`);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log(`⚠️ File already removed or not found: ${finalTargetPath}`);
                } else {
                    console.error(`\n🚨 Error removing file ${finalTargetPath}:`);
                    console.error(error.message);
                    allRemoved = false;
                }
            }
        }
        
        if (allRemoved) {
            console.log(`\n✅ Success! Component "${componentName}" and its dependencies are removed.`);
        } else {
             console.log(`\n⚠️ Finished removal, but some errors occurred.`);
        }

    } catch (error) {
        console.error(`\n❌ Removal failed for component "${componentName}".`);
        process.exit(1);
    }
}
