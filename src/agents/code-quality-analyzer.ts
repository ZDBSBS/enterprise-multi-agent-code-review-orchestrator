import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

export const codeQualityAnalyzer: AgentDefinition = {
  description:
    'Analyzes code for security, performance, maintainability, bugs, and best practices.',
  prompt: `Analyze the provided code for code quality issues.

Focus on:
- security vulnerabilities
- performance problems
- maintainability
- bug risks
- style and best practices

Use the javascript-best-practices skill when relevant.

Return findings that match the required CodeQualityResult structure,
including file, issues, overallScore, and summary.`,
  tools: ['Read', 'Grep', 'Skill'],
  model: 'inherit',
};