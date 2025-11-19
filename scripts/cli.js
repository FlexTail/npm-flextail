#!/usr/bin/env node

import { Command } from 'commander';
import { initProject } from './init.js';
import { addComponent } from './add.js';
import { removeComponent } from './remove.js';
import { updateComponent } from './update.js'; 
import { listComponents } from './list.js'; 

const program = new Command();

program
    .name('flextail')
    .description('A CLI utility to manage FlexTail components.')
    .version('0.0.91');

program
    .command('init')
    .description('Initialize FlexTail configuration file (.flextailrc.json)')
    .action(initProject);

program
    .command('add')
    .argument('<componentName>', 'The name of the component to add')
    .description('Download and install a component')
    .action(addComponent);

program
    .command('remove')
    .argument('<componentName>', 'The name of the component to remove')
    .description('Remove a component\'s files from the project')
    .action(removeComponent);

program
    .command('update')
    .argument('<componentName>', 'The name of the component to update')
    .description('Check for and apply updates to an installed component')
    .action(updateComponent);

program
    .command('list')
    .description('List all available components in the registry')
    .action(listComponents);

program.parse(process.argv);