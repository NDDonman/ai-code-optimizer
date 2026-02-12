import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import os from 'os';

dotenv.config();

interface Config {
    openaiApiKey?: string;
    grokApiKey?: string;
    model: 'openai' | 'grok';
    grokModel?: string;
}

const CONFIG_FILE_NAME = '.ai-optimizer-rc';

export const getConfig = (): Config => {
    let fileConfig: Partial<Config> = {};

    // Check local config
    const localConfigPath = path.join(process.cwd(), CONFIG_FILE_NAME);
    if (fs.existsSync(localConfigPath)) {
        try {
            fileConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf-8'));
        } catch (e) {
            console.warn('Failed to parse local config file.');
        }
    } else {
        // Check home config
        const homeConfigPath = path.join(os.homedir(), CONFIG_FILE_NAME);
        if (fs.existsSync(homeConfigPath)) {
            try {
                fileConfig = JSON.parse(fs.readFileSync(homeConfigPath, 'utf-8'));
            } catch (e) {
                console.warn('Failed to parse home config file.');
            }
        }
    }

    return {
        openaiApiKey: process.env.OPENAI_API_KEY || fileConfig.openaiApiKey,
        grokApiKey: process.env.GROK_API_KEY || fileConfig.grokApiKey,
        model: (process.env.AI_MODEL as 'openai' | 'grok') || fileConfig.model || 'openai',
        grokModel: process.env.GROK_MODEL || fileConfig.grokModel || 'grok-code-fast-1',
    };
};
