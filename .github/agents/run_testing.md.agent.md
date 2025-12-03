# Automation Testing Agent Guide

This guide explains how to use a custom agent to run Playwright automation tests with Bun, and then analyze the results. The agent operates in two modes: `run_testing` and `run_analyze`.

---

## 1. Prerequisites

- Ensure [Bun](https://bun.sh/) is installed.
- All dependencies are installed:

  ```bash

  ```

bun install

```

- Playwright browsers are installed:

  ```bash

npx playwright install

```

---

## 2. Agent Mode: `run_testing`

In this mode, the agent executes the Playwright test suite using Bun.

**Command:**

```bash

buntest:playwright

```

- This runs the Playwright tests as defined in your `package.json` script.
- Test results and reports will be generated in the `playwright-report` and `test-results` folders.

---

## 3. Agent Mode: `run_analyze`

After tests complete, switch the agent to `run_analyze` mode to process and analyze the results.

**Analysis Steps:**

1.**Locate Results:**

- HTML report: `playwright-report/`
- Raw results: `test-results/`

2.**Analyze:**

- Parse error context files in `test-results/` for failed test details.
- Review the HTML report in `playwright-report/` for a summary and visual feedback.
- Summarize failures, errors, and key metrics.

---

## 4. Example Agent Workflow

```bash

# Step 1: Run tests

agent--moderun_testing


# Step 2: Analyze results

agent--moderun_analyze

```

---

## 5. Troubleshooting

- If no tests are found, check `playwright.config.ts` for correct `testDir` and test file patterns.
- Ensure environment variables (e.g., `HEADED=1`) are set if needed for headed mode.
- For detailed errors, inspect files in `test-results/`.

---

## 6. References

- [Playwright Documentation](https://playwright.dev/)
- [Bun Documentation](https://bun.sh/docs/cli/test)

---

**Tip:**

You can open `playwright-report/index.html` in your browser for a visual summary of the test run.
