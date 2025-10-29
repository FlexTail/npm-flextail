import path from 'path';
import fs from 'fs/promises';
import { getRegistry, getComponentPathPreference } from './cli-utils.js';

export async function removeComponent(componentName) {
    console.log(`\n📦 FlexTail CLI: Removing component "${componentName}"...`);

    const registry = await getRegistry();
    const component = registry.find(c => c.name.toLowerCase() === componentName.toLowerCase());

    if (!component) {
        console.error(`\n❌ Error: Component "${componentName}" not found in the registry.`);
        console.log(`Available components: ${registry.map(c => c.name).join(', ')}`);
        process.exit(1);
    }

    const preference = await getComponentPathPreference();
    const componentSaveDir = preference.customPath;

    if (!componentSaveDir) {
        console.error('\n🚨 Error: Failed to determine component save path.');
        process.exit(1);
    }

    if (preference.mode === 'custom') {
        console.log(`\n🛠️ Custom path selected: ${componentSaveDir}`);
    } else {
        console.log(`\n🤖 Auto root path determined: ${componentSaveDir}`);
    }

    console.log(`\n🔍 Found component in registry. Attempting to remove ${component.files.length} files...`);

    let filesRemovedCount = 0;
    let errorsOccurred = false;

    try {
        for (const file of component.files) {
            const finalTargetPath = path.normalize(path.join(componentSaveDir, file.target_path));

            try {
                await fs.unlink(finalTargetPath);
                console.log(`🗑️ File removed successfully: ${finalTargetPath}`);
                filesRemovedCount++;
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log(`⚠️ File already removed or not found: ${finalTargetPath}`);
                } else {
                    console.error(`\n🚨 Error removing file ${finalTargetPath}:`);
                    console.error(`Reason: ${error.message}`);
                    errorsOccurred = true;
                }
            }
        }

        if (filesRemovedCount > 0 && !errorsOccurred) {
            console.log(`\n✅ Success! Component "${componentName}" files were removed.`);
        } else if (errorsOccurred) {
            console.log(`\n⚠️ Finished removal, but some errors occurred. See messages above.`);
            process.exit(1);
        } else {
            console.log(`\n⚠️ Finished removal, but no files were found or removed for "${componentName}".`);
        }

    } catch (error) {
        console.error(`\n❌ Removal failed for component "${componentName}".`);
        console.error(`Reason: ${error.message}`);
        process.exit(1);
    }
}