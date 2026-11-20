export const TEST_COVERAGE_ANALYZER_PROMPT = `Analyze the provided source code and tests for test coverage.

Identify:
- whether tests exist
- relevant test files
- untested functions, classes, branches, and edge cases
- priority and reasoning for each gap
- specific suggested tests and meaningful assertions

Return findings matching TestCoverageResultSchema:
- file
- hasTests
- testFiles
- untestedPaths
- coverageEstimate from 0 to 100
- summary`;