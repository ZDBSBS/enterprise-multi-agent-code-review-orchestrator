export const CODE_QUALITY_ANALYZER_PROMPT = `Analyze the provided code for code quality issues.

Focus on:
- security vulnerabilities
- performance problems
- maintainability
- bug risks
- style and best practices

Use the javascript-best-practices skill when relevant.

Return findings matching CodeQualityResultSchema:
- file
- issues with line, severity, category, description, and suggestion
- overallScore from 0 to 100
- summary`;