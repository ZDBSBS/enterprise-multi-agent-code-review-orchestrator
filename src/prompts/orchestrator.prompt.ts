export function buildOrchestratorPrompt(
  owner: string,
  repo: string,
  prNumber: number
): string {
  return `Review pull request #${prNumber} from ${owner}/${repo}.

Fetch the pull request data and changed files using the available GitHub MCP tools.

Explicitly invoke all three subagents:
1. code-quality-analyzer
2. test-coverage-analyzer
3. refactoring-suggester

Use the subagent findings to create exactly one final result matching
ReviewReportSchema.

The final result must contain:

pullRequest:
- owner: string
- repo: string
- number: number

fileReviews:
- one entry for each analyzed file
- file: string
- codeQuality: complete CodeQualityResult
- testCoverage: complete TestCoverageResult
- refactorings: complete RefactoringSuggestion

summary:
- totalFiles: number
- overallScore: number
- criticalIssues: number
- highPriorityTests: number
- refactoringOpportunities: number

recommendations:
- priority: critical, high, medium, or low
- category: string
- description: string
- files: array of strings

metadata:
- analyzedAt: string
- duration: number
- agentVersions: object containing string values

Every required field must be present.
Use only values allowed by the schemas.
Do not add fields outside ReviewReportSchema.
Do not return Markdown or explanatory text as the final result.

If one subagent fails, handle the failure gracefully and continue when possible.`;
}