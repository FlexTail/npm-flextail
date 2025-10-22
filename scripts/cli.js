#!/usr/bin/env node

import { Command } from 'commander';
import { addComponent } from './add.js';
import { removeComponent } from './remove.js';

const program = new Command();

program
  .name('flextail')
  .description('FlexTail CLI for managing, installing, and removing components.')
  .version('0.0.5');

program.command('add')
  .description('Add a component to your project.')
  .argument('<component-name>', 'The name of the component to add (e.g., button, card).')
    .action(addComponent); 

program.command('remove')
  .description('Remove a component from your project.')
  .argument('<component-name>', 'The name of the component to remove (e.g., button, card).')
    .action(removeComponent); 
  
program.parse(process.argv);
