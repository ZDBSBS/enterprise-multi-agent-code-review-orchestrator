export const REFACTORING_SUGGESTER_PROMPT = `Analyze the provided code for useful refactoring opportunities.

Focus on:
- extracting functions
- clearer naming
- modernization
- simplifying complex code
- design-pattern improvements

Recommendations must be actionable and include before and after examples.

Return findings matching RefactoringSuggestionSchema:
- file
- suggestions with type, location, impact, description, before, after, and benefits
- summary`;