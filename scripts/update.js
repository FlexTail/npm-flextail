import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import { diffLines } from 'diff';
import prompts from 'prompts';
import { getConfig } from './config.js';
import { getRegistry } from './helpers.js';

export async function updateComponent(componentName) {
    console.log(`\n📦 FlexTail CLI: Checking for updates to "${componentName}"...`);

    const [config, registry] = await Promise.all([
        getConfig(),
        getRegistry()
    ]);

    const component = registry.find(c => c.name.toLowerCase() === componentName.toLowerCase());

    if (!component) {
        console.error(`\n❌ Error: Component "${componentName}" not found in the registry.`);
        process.exit(1);
    }

    const componentSaveDir = path.normalize(path.join(process.cwd(), config.aliases.components));
    const alias = config.aliases.path;
    let filesNeedUpdate = false;

    for (const file of component.files) {
        const localPath = path.normalize(path.join(componentSaveDir, file.target_path));
        let localContent = '';

        try {
            localContent = await fs.readFile(localPath, 'utf8');
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.error(`\n⚠️ File not found locally: ${localPath}`);
                console.log(`Run \`flextail add ${componentName}\` to install it.`);
            } else {
                console.error(`\n🚨 Error reading local file ${localPath}:`, error.message);
            }
            continue;
        }
        const fileUrl = file.content_url; 
        
        const response = await fetch(fileUrl);
        if (!response.ok) {
            console.error(`\n🚨 Error fetching remote file: ${fileUrl}`);
            continue;
        }
        
        const newContentRaw = await response.text();
        const newContent = newContentRaw.replace(/(@\/)([\w\-./]+)/g, `${alias}$2`);

        const fileDiff = diffLines(localContent, newContent);
        const changes = fileDiff.filter(part => part.added || part.removed);

        if (changes.length > 0) {
            filesNeedUpdate = true;
            console.log(`\n--- Changes for ${file.target_path} ---`);
            fileDiff.forEach(part => {
                const color = part.added ? '\x1b[32m' : part.removed ? '\x1b[31m' : '\x1b[90m';
                process.stdout.write(color + part.value + '\x1b[0m');
            });

            const { confirm } = await prompts({
                type: 'confirm',
                name: 'confirm',
                message: `\nApply these changes and overwrite ${localPath}?`,
                initial: false
            });

            if (confirm) {
                await fs.writeFile(localPath, newContent, 'utf8');
                console.log(`✅ File updated: ${localPath}`);
            } else {
                console.log(`🚫 Update skipped for: ${localPath}`);
            }
        }
    }

    if (!filesNeedUpdate) {
        console.log(`\n🎉 Component "${componentName}" is already up to date.`);
    }
}