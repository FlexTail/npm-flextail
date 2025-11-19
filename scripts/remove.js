import path from 'path';
import fs from 'fs/promises';
import prompts from 'prompts';
import { getRegistry } from './helpers.js';
import { getConfig } from './config.js';

export async function removeComponent(componentName) {
    console.log(`\n📦 FlexTail CLI: Removing component "${componentName}"...`);

    const [config, registry] = await Promise.all([
        getConfig(),
        getRegistry()
    ]);

    const component = registry.find(c => c.name.toLowerCase() === componentName.toLowerCase());

    if (!component) {
        console.error(`\n❌ Error: Component "${componentName}" not found in the registry.`);
        console.log(`Available components: ${registry.map(c => c.name).join(', ')}`);
        process.exit(1);
    }

    const componentSaveDir = path.normalize(path.join(process.cwd(), config.aliases.components));
    console.log(`\n🔍 Locating files in: ${config.aliases.components}`);

    const filesToDelete = component.files.map(file => 
        path.normalize(path.join(componentSaveDir, file.target_path))
    );

    console.log('The following files will be permanently deleted:');
    filesToDelete.forEach(file => console.log(`  - ${file}`));

    const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to delete these files?',
        initial: false
    });

    if (!confirm) {
        console.log('👋 Aborted. No files were removed.');
        process.exit(0);
    }

    console.log(`\n🗑️ Removing ${component.files.length} files...`);
    let filesRemovedCount = 0;
    let errorsOccurred = false;

    try {
        for (const file of component.files) {
            const finalTargetPath = path.normalize(path.join(componentSaveDir, file.target_path));

            try {
                await fs.unlink(finalTargetPath);
                console.log(`  ✅ File removed: ${finalTargetPath}`);
                filesRemovedCount++;
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log(`  ⚠️  File not found (already removed): ${finalTargetPath}`);
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
            console.log(`\n⚠️ Finished removal, but some errors occurred.`);
            process.exit(1);
        } else {
            console.log(`\n⚠️ Finished, but no files were removed for "${componentName}".`);
        }

    } catch (error) {
        console.error(`\n❌ Removal failed for component "${componentName}".`);
        console.error(`Reason: ${error.message}`);
        process.exit(1);
    }
}