import { getRegistry } from './helpers.js';

export async function listComponents() {
    console.log('\n✨ FlexTail Component Registry ✨');
    console.log('---------------------------------');

    const registry = await getRegistry();

    if (!registry || registry.length === 0) {
        console.log('No components found in the registry.');
        console.log('Please check your network connection or the registry URL.');
        return;
    }
    
    const sortedRegistry = registry.slice().sort((a, b) => a.name.localeCompare(b.name));

    const maxNameLength = sortedRegistry.reduce((max, c) => Math.max(max, c.name.length), 0);

    console.log(`\nFound ${sortedRegistry.length} available components:\n`);

    for (const component of sortedRegistry) {
        const paddedName = component.name.padEnd(maxNameLength + 4);
        const description = component.description || 'No description available.';

        console.log(`📦 ${paddedName} - ${description}`);
    }

    console.log('\n---------------------------------');
    console.log('To install a component, use:');
    console.log('flextail add <component-name>');
    console.log('---------------------------------');
}