import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

export const refactoringSuggester: AgentDefinition = {
  description:
    'Identifies focused refactoring opportunities and code modernization improvements.',
  prompt: `Analyze the provided code for useful refactoring opportunities.

Focus on:
- extracting functions
- clearer naming
- modernization
- simplifying complex code
- design-pattern improvements

Provide actionable recommendations with before and after examples.

Return findings that match the required RefactoringSuggestion structure,
including file, suggestions, and summary.`,
  tools: ['Read', 'Grep', 'Skill'],
  model: 'inherit',
};