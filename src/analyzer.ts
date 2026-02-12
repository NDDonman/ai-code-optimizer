import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { AIService } from './ai-service';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

export const analyze = async () => {
    const ai = new AIService();
    const spinner = ora('Scanning files...').start();

    // glob v8 uses callback or sync, but has a promise wrapper in 'glob-promise' or requires promisify.
    // Let's use util.promisify
    const globPromise = require('util').promisify(glob);

    // Ignore node_modules, dist, .git by default
    const files = await globPromise('**/*.{js,ts}', {
        ignore: ['node_modules/**', 'dist/**', '.git/**', 'bin/**'],
        cwd: process.cwd()
    });

    spinner.succeed(`Found ${files.length} files to analyze.`);

    for (const file of files) {
        const filePath = path.join(process.cwd(), file);
        const code = fs.readFileSync(filePath, 'utf-8');

        spinner.text = `Analyzing ${file}...`;

        try {
            const result = await ai.analyzeCode(code, file);
            const analysis = JSON.parse(result);

            if (analysis.issues && analysis.issues.length > 0) {
                spinner.stop();
                console.log(chalk.bold.yellow(`\nIssues found in ${file}:`));

                for (const issue of analysis.issues) {
                    console.log(chalk.red(`[${issue.severity.toUpperCase()}] Line ${issue.line}: ${issue.description}`));
                    console.log(chalk.gray(`Suggestion: ${issue.suggestion}`));

                    if (issue.fixedCode) {
                        const answers = await inquirer.prompt([{
                            type: 'confirm',
                            name: 'apply',
                            message: 'Do you want to apply this fix?',
                            default: false
                        }]);

                        if (answers.apply) {
                            try {
                                fs.writeFileSync(filePath, issue.fixedCode, 'utf-8');
                                console.log(chalk.green('Fix applied successfully!'));
                            } catch (err) {
                                console.error(chalk.red('Failed to write fix to file.'), err);
                            }
                        }
                    }
                    console.log('---');
                }
                spinner.start();
            }
        } catch (error: any) {
            spinner.fail(`Failed to analyze ${file}`);
            if (error.status === 401) {
                console.error(chalk.red('Error: Invalid API Key. Please check your configuration.'));
                process.exit(1);
            } else {
                console.error(chalk.red(`Error details: ${error.message}`));
            }
        }
    }

    spinner.succeed('Analysis complete.');
};
