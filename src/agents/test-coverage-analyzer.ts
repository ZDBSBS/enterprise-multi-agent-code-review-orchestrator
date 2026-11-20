import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

export const testCoverageAnalyzer: AgentDefinition = {
  description:
    'Analyzes test coverage, untested paths, missing tests, and assertions.',
  prompt: `Analyze the provided code and tests for test coverage.

Identify:
- whether tests exist
- relevant test files
- untested functions, classes, branches, and edge cases
- priority of missing tests
- specific suggested tests and meaningful assertions

Return findings that match the required TestCoverageResult structure,
including file, hasTests, testFiles, untestedPaths, coverageEstimate,
and summary.`,
  tools: ['Read', 'Grep', 'Glob', 'Skill'],
  model: 'inherit',
};