import { query } from '@anthropic-ai/claude-agent-sdk';
import {
  ReviewReportSchema,
  ReviewReportJSONSchema
} from './types/index.js';
import { mcpServersConfig } from './config/mcp.config.js';
import {
  codeQualityAnalyzer,
  testCoverageAnalyzer,
  refactoringSuggester
} from './agents/index.js';
import { buildOrchestratorPrompt } from './prompts/index.js';

import { ReviewReport } from './types/report-types';

/**
 * Orchestrator configuration options
 */
export interface OrchestratorOptions {
}

/**
 * Main Code Review Orchestrator
 * Coordinates subagents to analyze pull requests and generate comprehensive reports
 */
export class CodeReviewOrchestrator {


  constructor(options: OrchestratorOptions = {}) {
  }

  /**
   * Review a pull request using parallel subagent analysis
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param prNumber - Pull request number
   * @returns Complete review report
   */
  async reviewPullRequest(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<ReviewReport> {
    const model = process.env.ANTHROPIC_MODEL;

if (!model) {
  throw new Error('ANTHROPIC_MODEL environment variable is required');
}

const agents = {
  'code-quality-analyzer': codeQualityAnalyzer,
  'test-coverage-analyzer': testCoverageAnalyzer,
  'refactoring-suggester': refactoringSuggester
};

const prompt = buildOrchestratorPrompt(owner, repo, prNumber);

for await (const message of query({
  prompt,
  options: {
    mcpServers: mcpServersConfig,
    allowedTools: [
      'Task',
      'mcp__eslint__lint'
    ],
    agents,
    model,
    outputFormat: {
      type: 'json_schema',
      schema: ReviewReportJSONSchema
    },
    maxTurns: 45
  }
})) {
  if (
    message.type === 'result' &&
    message.subtype === 'success' &&
    message.structured_output
  ) {
    const parsed = ReviewReportSchema.safeParse(
      message.structured_output
    );

    if (!parsed.success) {
      throw new Error(
        `Invalid review report: ${parsed.error.message}`
      );
    }

    return parsed.data;
  }

  if (message.type === 'result') {
    throw new Error(`Code review failed: ${message.subtype}`);
  }
}

throw new Error('Failed to generate review report');
  }
}
