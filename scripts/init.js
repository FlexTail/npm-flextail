import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import { 
    getComponentBaseDir,
    getTsConfigPathAlias
} from './helpers.js';

export const CONFIG_FILE = path.join(process.cwd(), '.flextailrc.json');

export async function initProject() {
    console.log('\n✨ Welcome to FlexTail! Let\'s configure your project.');
    const [autoBasePath, autoAlias] = await Promise.all([
        getComponentBaseDir(),
        getTsConfigPathAlias()
    ]);

    const questions = [
        {
            type: 'text',
            name: 'componentPath',
            message: 'Where should we add new components (e.g., src/<name>)?',
            initial: path.join(autoBasePath, 'components')
        },
        {
            type: 'text',
            name: 'componentAlias',
            message: 'What is your component path alias (e.g., @/<name>)?',
            initial: autoAlias || '@'
        }
    ];

    const answers = await prompts(questions, {
        onCancel: () => {
            console.log('\n🚫 Project initialization cancelled. Configuration file was not created.');
            process.exit(1);
        }
    });
    if (!answers.componentPath || !answers.componentAlias) {
        console.log('\n🚫 Project initialization incomplete. Configuration file was not created.');
        return;
    }

    const config = {
        $schema: "https://raw.githubusercontent.com/FlexTail/npm-flextail/schema.json",
        aliases: {
            path: answers.componentAlias,
            components: answers.componentPath
        }
    };

    try {
        await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
        console.log(`\n✅ Configuration saved to ${path.basename(CONFIG_FILE)}`);
        console.log('Project initialized. You can now run \`flextail add [component]\`');
    } catch (error) {
        console.error('\n🚨 Error: Could not save configuration file.');
        console.error(error.message);
        process.exit(1);
    }
}