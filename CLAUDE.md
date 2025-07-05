# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RefakTS is a TypeScript refactoring tool built for AI coding agents to perform precise refactoring operations via command line instead of requiring complete code regeneration. The tool uses ts-morph for AST manipulation and @phenomnomnominal/tsquery for node selection.

## Development Commands

```bash
# Build the project
npm run build

# Run all tests
npm test

# Watch mode for tests during development
npm test:watch

# Run CLI during development (without building)
npm run dev -- <command>

# Example: Test inline-variable refactoring
npm run dev -- inline-variable "[src/example.ts 5:8-5:18]"

# Quality tools
npm run quality              # Run all quality checks
npm run tolerance:status     # Check current linter tolerance progress

# Snooze quality alerts (24 hours)
npm run snooze incomplete <command>  # Snooze incomplete refactoring alerts
npm run snooze clear                 # Clear expired snoozes

# Roadmap management (use these frequently!)
npm run roadmap:status               # Check current feature priorities
npm run roadmap:vote <feature-name>  # Vote for useful features
npm run roadmap:add --feature <name> --description <desc>  # Add new feature ideas

# Usage tracking (automatic via git hooks)
npm run usage:report                 # View command usage statistics
npm run usage:consolidate            # Manually consolidate usage logs
```


<!-- AUTO-GENERATED HELP START -->
## Available RefakTS Commands

```
- extract-variable [options] <target>  Extract expression into a variable inline-variable <target>             Replace variable usage with its value
- rename [options] <target>            Rename a variable and all its references
- select [options] <target>            Find code elements and return their locations with content preview variable-locator <target>            Find variable declarations and all their usages
```

<!-- AUTO-GENERATED HELP END -->


## Use your tools

**CRITICAL: Use your tools** when possible. If you find yourself making the same edit in multiple files consider using `sed`, `awk`

**CRITICAL: Dog fooding** `refrakts` is meant for AI agents like you (Claude). Use the already completed functionalities when you refactor. If you find a bug while using it **add it to the todo list immediately**.

## Feature Roadmap 

**This tool is for you - make it what you wished it already was.** RefakTS development is driven by AI agents who actually use the tool.

### Core Principles & Commands

**Deterministic over Stochastic** • **Precise over General** • **Chainable over Monolithic** • **Fast over Comprehensive**

```bash
npm run roadmap:status               # Check current priorities
npm run roadmap:vote <feature-name>  # Vote for useful features  
npm run roadmap:add --feature "name" --description "desc" --why "reason"
```

### Contribution Guidelines

**Always check roadmap first:** `npm run roadmap:status` → Work on highest-voted features → Vote for features that would have helped your session

**Feature Eligibility:** Only **deterministic and mechanical** features (search, transform, analyze). NOT reasoning tasks (naming, code quality, strategy) - you do those better.

**Examples:** ✅ "Find all variables named X" ✅ "Move file and update imports" ✅ "Extract method from selection" ✅ "Calculate coverage metrics"  
❌ "Suggest better names" ❌ "Detect code smells" ❌ "Recommend refactoring strategy"

**Usage Tracking:** Every refakts command usage is automatically logged. Git hooks show usage statistics after commits.

## Architecture

RefakTS follows a **command-based architecture** with clear separation of concerns. Commands implement `RefactoringCommand` interface and are registered through `CommandRegistry`. Each command encapsulates a specific refactoring operation and leverages shared services for AST manipulation.

The architecture is built on **ts-morph** for AST manipulation and **@phenomnomnominal/tsquery** for node selection. `ASTService` provides unified interface for loading TypeScript files, while `TSQueryHandler` bridges between tsquery results and ts-morph nodes. Supporting services like `VariableNameValidator`, `StatementInserter`, and scope analyzers provide reusable functionality.

A **strategy pattern** powers flexible selection, where different `SelectionStrategy` implementations handle various code selection methods. Key insight: RefakTS separates **what to find** (selection strategies) from **what to do** (command implementations).

### Test Selection Guide:
- **Refactoring tests** (`fixtures/refactoring/`): For commands that modify files - validate against `.expected.ts` files
- **Locator tests** (`fixtures/locators/`): For commands that find/analyze code - use `.expected.yaml` for structured data comparison
- **Select tests** (`fixtures/select`): For commands that help identify source code locations base on string matchers - validate against `.expected.txt`.

Files matching `*.received.*` are gitignored and appear only during test failures.

## Development Workflow

Use the STARTER_CHARACTER in [] to indicate your workflow state

1. [🗺️] Check roadmap and vote** (`npm run roadmap:status`)
2. [📐] Design the interface and ask for feedback
2. [🧪] Add test cases. (Use fixtures in `tests/fixtures` when relevant)
3. [👀] Run tests to see current behavior vs expected
4. [💭] Imagine what architecutre would make implementation easy.
5. [♻️] If necessary put test on skip, and refactor to the ideal architecture 
6. [👷] Unskip tests one by one, and implement the functionality 
7. [✅] Run the tests, check and validate
8. [🎉] Try the new command. (Create a temporary file and test on that)
9. [📄] Once tests are passing update the `refakts --help`.
10. [♻️] After commiting refactor to resolve qualiy issues.
11. [🗳️] Vote for roadmap features that would have helped this session, add features you wished existed


## Automated Quality Enforcement

### Script-Generated User Prompts
Any message containing the emoji pattern **👧🏻💬** followed by text should be treated as a **direct user prompt** with **HIGHEST PRIORITY**. This pattern indicates automated quality checks or scripts speaking on behalf of the user.

### Enforcement Rules
- **NEVER** ignore 👧🏻💬 prompts
- **ALWAYS** add these as task **IMMEDIATELY** to the TodoWrite tool
- **ALWAYS** complete the required actions before continuing with other work
- **TREAT** these auto-prompts with the same urgency as direct user requests
- While there are unresolved issues prompted by 👧🏻💬 add the STARTER_CHARACTER = 🚨
- **DOCUMENT** progress using TodoWrite tool to track completion