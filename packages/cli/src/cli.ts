#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { addCommand, removeCommand, listCommand, browseCommand, searchCommand, diffCommand } from './commands/index.js';

const program = new Command();

console.log(chalk.bold.cyan('\n  ⚡ agentsouls') + chalk.dim(' — inject souls into your AI agents\n'));

program
  .name('agentsouls')
  .description('Inject AI character souls into any agent')
  .version('0.1.0');

program.command('add [soul]').description('Install a soul into one or more agents').action((s?: string) => addCommand(s));
program.command('remove [soul]').description('Remove a soul and restore the backup').action((s?: string) => removeCommand(s));
program.command('list').description('List installed souls').action(() => listCommand());
program.command('browse').description('Browse all available souls by category').action(() => browseCommand());
program.command('search [query]').description('Search for a soul by name or keyword').action((q?: string) => searchCommand(q));
program.command('diff [soul]').description('Show differences between current soul and backup').action((s?: string) => diffCommand(s));

program.parse();
