console.log("CLI TS executing...");
import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import { getConfig } from './config';
import { analyze } from './analyzer';

export const program = new Command();

console.log(
    chalk.cyan(
        figlet.textSync('AI Code Optimizer', { horizontalLayout: 'full' })
    )
);

program
    .version('1.0.0')
    .description('AI-powered code optimizer for Node.js');

program
    .command('scan')
    .description('Scan the current directory for performance issues')
    .action(async () => {
        const config = getConfig();
        if (!config.openaiApiKey && !config.grokApiKey) {
            console.error(chalk.red('Error: API Key not found. Please set OPENAI_API_KEY or GROK_API_KEY in .env or .ai-optimizer-rc'));
            return;
        }
        console.log(chalk.green(`Starting scan using ${config.model}...`));
        await analyze();
    });

program
    .command('config')
    .description('Display current configuration')
    .action(() => {
        const config = getConfig();
        console.log(chalk.blue('Current Configuration:'));
        console.log(`Model: ${config.model}`);
        if (config.model === 'grok') {
            console.log(`Grok Model ID: ${config.grokModel}`);
        }
        console.log(`OpenAI Key: ${config.openaiApiKey ? 'Set' : 'Not Set'}`);
        console.log(`Grok Key: ${config.grokApiKey ? 'Set' : 'Not Set'}`);
    });

program.parse(process.argv);
