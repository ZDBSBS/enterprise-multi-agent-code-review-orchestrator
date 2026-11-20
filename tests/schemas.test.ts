import { describe, expect, it } from 'vitest';
import {
  CodeQualityResultSchema,
  TestCoverageResultSchema,
  RefactoringSuggestionSchema,
  ReviewReportSchema
} from '../src/types/index.js';

describe('Analysis schemas', () => {
  it('accepts a valid code quality result', () => {
    const result = CodeQualityResultSchema.safeParse({
      file: 'src/example.ts',
      issues: [],
      overallScore: 100,
      summary: 'No issues found'
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid code quality score', () => {
    const result = CodeQualityResultSchema.safeParse({
      file: 'src/example.ts',
      issues: [],
      overallScore: 101,
      summary: 'Invalid score'
    });

    expect(result.success).toBe(false);
  });

  it('accepts a valid test coverage result', () => {
    const result = TestCoverageResultSchema.safeParse({
      file: 'src/example.ts',
      hasTests: false,
      testFiles: [],
      untestedPaths: [],
      coverageEstimate: 0,
      summary: 'No tests found'
    });

    expect(result.success).toBe(true);
  });

  it('accepts a valid refactoring result', () => {
    const result = RefactoringSuggestionSchema.safeParse({
      file: 'src/example.ts',
      suggestions: [],
      summary: 'No refactoring required'
    });

    expect(result.success).toBe(true);
  });
});

describe('ReviewReportSchema', () => {
  it('accepts a valid review report', () => {
    const result = ReviewReportSchema.safeParse({
      pullRequest: {
        owner: 'octocat',
        repo: 'Hello-World',
        number: 1
      },
      fileReviews: [],
      summary: {
        totalFiles: 0,
        overallScore: 100,
        criticalIssues: 0,
        highPriorityTests: 0,
        refactoringOpportunities: 0
      },
      recommendations: [],
      metadata: {
        analyzedAt: new Date().toISOString(),
        duration: 0,
        agentVersions: {}
      }
    });

    expect(result.success).toBe(true);
  });
});