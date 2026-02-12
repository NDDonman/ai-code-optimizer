# AI Code Optimizer

![npm version](https://img.shields.io/npm/v/ai-code-optimizer)
![License](https://img.shields.io/npm/l/ai-code-optimizer)

**AI Code Optimizer** is a CLI tool that uses AI (OpenAI or Grok) to scan your Node.js codebase for performance issues and automatically suggests or applies fixes.

## Features

- 🚀 **AI-Powered Scanning**: Detects performance bottlenecks, anti-patterns, and inefficiencies.
- 🤖 **Multi-Model Support**: Works with OpenAI (GPT-4) and xAI (Grok-2, Grok-3).
- 🛠️ **Auto-Fix**: Interactively apply AI-suggested fixes directly to your code.
- ⚙️ **Configurable**: use `.env` or `.ai-optimizer-rc` for flexible configuration.

## Installation

```bash
npm install -g ai-code-optimizer
```

## Usage

### 1. Configuration

Create a `.env` file in your project root:

```env
# Choose your AI provider
AI_MODEL=grok  # or openai

# API Keys
GROK_API_KEY=your_xai_api_key
# OPENAI_API_KEY=your_openai_api_key

# Optional: Specific Model Version
# GROK_MODEL=grok-2
```

### 2. Run a Scan

To scan the current directory for issues:

```bash
ai-code-optimizer scan
```

The tool will analyze `.js` and `.ts` files, report issues, and offer to fix them.

### 3. Check Configuration

```bash
ai-code-optimizer config
```

## Development

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Run locally: `npm run dev` (requires `ts-node`)

## License

ISC
