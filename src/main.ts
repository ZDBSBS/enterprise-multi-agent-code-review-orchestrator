import * as dotenv from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';
import { CodeReviewOrchestrator } from './orchestrator.js';
import { ReportGenerator } from './utils/report-generator.js';

// Load environment variables
dotenv.config();

/**
 * Main entry point for the Claude Multi-Agent Code Review System
 * Usage: npm run dev <owner> <repo> <pr-number>
 */
async function main() {
  const [owner, repo, prStr] = process.argv.slice(2);

  // TODO: Validate command line arguments
  // - Check if owner, repo, and prStr are provided
  // - Convert prStr to number and validate it's a valid integer
  // - Exit with error message if validation fails
  if (!owner || !repo || !prStr) {
    console.error('Usage: npm run dev -- <owner> <repo> <pr-number>');
    process.exitCode = 1;
    return;
  }

  const prNumber = Number(prStr);

  if (!Number.isInteger(prNumber) || prNumber <= 0) {
    console.error('Error: PR number must be a positive integer.');
    process.exitCode = 1;
    return;
  }

  // TODO: Validate authentication (choose ONE method)
  // Students must have either:
  //   - ANTHROPIC_API_KEY environment variable, OR
  //   - AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY for Bedrock
  //
  // If using AWS Bedrock:
  //   - Verify AWS_REGION is set
  //   - Log: "🔐 Using AWS Bedrock authentication"
  // If using Anthropic API:
  //   - Log: "🔐 Using Anthropic API authentication"
  // If neither method is configured:
  //   - Exit with clear error message showing both options
  const hasAnthropicApiKey = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasAwsCredentials = Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  );

  if (hasAnthropicApiKey) {
    console.log('🔐 Using Anthropic API authentication');
  } else if (hasAwsCredentials) {
    if (!process.env.AWS_REGION) {
      console.error(
        'Error: AWS_REGION is required when using AWS Bedrock.'
      );
      process.exitCode = 1;
      return;
    }

    console.log('🔐 Using AWS Bedrock authentication');
  } else {
    console.error(
      'Error: Configure ANTHROPIC_API_KEY or AWS_ACCESS_KEY_ID ' +
      'and AWS_SECRET_ACCESS_KEY.'
    );
    process.exitCode = 1;
    return;
  }

  // TODO: Validate ANTHROPIC_MODEL environment variable
  // This is REQUIRED for both authentication methods
  // - For AWS Bedrock: us.anthropic.claude-sonnet-4-5-20250929-v1:0
  // - For Anthropic API: claude-sonnet-4-5-20250929
  // Exit with error if not set
  if (!process.env.ANTHROPIC_MODEL) {
    console.error(
      'Error: ANTHROPIC_MODEL environment variable is required.'
    );
    process.exitCode = 1;
    return;
  }

  console.log('start here', owner, repo, prStr)
  try {
    // TODO: Create orchestrator instance
    // TODO: Call .reviewPullRequest(owner, repo, prNumber);
    // TODO: Generate formatted reports using ReportGenerator
    // Hint: Use ReportGenerator to create Markdown, HTML, and JSON reports
    // Save reports to 'reports/' directory with appropriate filenames
    const orchestrator = new CodeReviewOrchestrator();
    const report = await orchestrator.reviewPullRequest(
      owner,
      repo,
      prNumber
    );

    const reportGenerator = new ReportGenerator();
    const reportDirectory = 'reports';
    const reportName = `${owner}_${repo}_${prNumber}`;

    await mkdir(reportDirectory, { recursive: true });

    await Promise.all([
      writeFile(
        `${reportDirectory}/${reportName}.json`,
        reportGenerator.generateJSONReport(report),
        'utf8'
      ),
      writeFile(
        `${reportDirectory}/${reportName}.md`,
        reportGenerator.generateMarkdownReport(report),
        'utf8'
      ),
      writeFile(
        `${reportDirectory}/${reportName}.html`,
        reportGenerator.generateHTMLReport(report),
        'utf8'
      )
    ]);

    console.log(`Reports generated in ${reportDirectory}/`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    console.error('Error:', message);
    process.exitCode = 1;
  }
}

main();