import OpenAI from 'openai';
import { getConfig } from './config';

export class AIService {
    private openai: OpenAI;
    private model: string;

    constructor() {
        const config = getConfig();
        const apiKey = config.model === 'grok' ? config.grokApiKey : config.openaiApiKey;
        const baseURL = config.model === 'grok' ? 'https://api.x.ai/v1' : undefined;

        this.openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
        });

        // Default models
        this.model = config.model === 'grok' ? (config.grokModel || 'grok-2') : 'gpt-4-turbo';
    }

    async analyzeCode(code: string, filename: string): Promise<string> {
        const prompt = `
    You are an expert Node.js performance optimizer. Analyze the following code from "${filename}" for performance bottlenecks, inefficiencies, and anti-patterns (e.g., synchronous I/O in hot paths, N+1 queries, linear searches in large arrays, memory leaks).

    Rules:
    1. Focus ONLY on performance and severe quality issues. Ignore style/formatting.
    2. Suggest specific, actionable fixes.
    3. If no issues are found, return a JSON object with an empty "issues" array.
    4. If providing a fix, "fixedCode" MUST be the COMPLETE file content with the fix applied. Do not return snippets.
    
    Response Format (JSON only):
    {
      "issues": [
        {
          "line": <number>,
          "description": "<string>",
          "suggestion": "<string>",
          "severity": "high" | "medium" | "low",
          "fixedCode": "<string|null>" 
        }
      ]
    }
    
    Code:
    ${code}
    `;

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'system', content: "You are a code analysis tool. Output valid JSON only." }, { role: 'user', content: prompt }],
                model: this.model,
                response_format: { type: "json_object" },
                temperature: 0.1,
            });

            return completion.choices[0].message.content || '{"issues": []}';
        } catch (error) {
            console.error('AI Analysis failed:', error);
            throw error;
        }
    }
}
