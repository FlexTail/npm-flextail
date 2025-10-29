import { Command } from 'commander';
import { addComponent } from './add.js';
import { removeComponent } from './remove.js';
import { listComponents } from './list.js';

const program = new Command();

program
    .name('version')
    .version('0.0.8');

program
    .name('description')
    .description('FlexTail CLI for managing, installing, and removing components.')

program.command('add')
    .description('Add a component to your project.')
    .argument('<component-name>', 'The name of the component to add (e.g., button, card).')
    .action(addComponent);

program.command('remove')
    .description('Remove a component from your project.')
    .argument('<component-name>', 'The name of the component to remove (e.g., button, card).')
    .action(removeComponent);

program.command('list')
    .description('Display all available components in the registry.')
    .action(listComponents);

program.parse(process.argv);
