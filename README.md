# Custom Copilot Coding Agent - QA Test Suite

[![CI/CD](https://github.com/Sinnv2710/pw_example_gh_workflow/actions/workflows/qa-test-suite.yml/badge.svg)](https://github.com/Sinnv2710/pw_example_gh_workflow/actions/workflows/qa-test-suite.yml)
[![Test Coverage](https://img.shields.io/badge/test%20coverage-60%2B%20cases-brightgreen)](./docs/custom-agent-qa-test-cases-enhanced.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive quality assurance framework for validating custom GitHub Copilot coding agents with 60+ test cases, automated execution tracking, and CI/CD integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Test Coverage](#test-coverage)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [CI/CD Integration](#cicd-integration)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This repository contains a production-ready QA test suite designed to validate custom GitHub Copilot coding agents across multiple dimensions including functionality, security, performance, and compliance.

### Key Features

✅ **60+ Comprehensive Test Cases** across 15 categories  
✅ **CSV-Based Execution Tracking** for test management  
✅ **GitHub Actions Automation** with PR gates and nightly runs  
✅ **Sample Test Data & Fixtures** for diverse scenarios  
✅ **Security & Performance Testing** built-in  
✅ **Detailed Documentation** with examples and templates  

### What's Included

```
pw_example_gh_workflow/
├── README.md                                    # This file
├── docs/
│   └── custom-agent-qa-test-cases-enhanced.md  # 60+ test specifications
├── tracking/
│   └── test-execution-tracking.csv             # Test execution tracker
├── tests/
│   ├── blocker/      # Critical tests (must pass for release)
│   ├── critical/     # High-priority tests
│   ├── high/         # Important tests
│   ├── medium/       # Standard tests
│   └── low/          # Nice-to-have tests
├── fixtures/
│   └── sample-problem-statements.md            # Test data library
├── .github/
│   └── workflows/
│       └── qa-test-suite.yml                   # CI/CD automation
└── requirements-test.txt                        # Python dependencies
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Git
- GitHub account with repository access
- (Optional) Docker for containerized testing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sinnv2710/pw_example_gh_workflow.git
   cd pw_example_gh_workflow
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements-test.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Verify installation**
   ```bash
   pytest --version
   python -c "import PyGithub; print('GitHub library ready')"
   ```

### Running Your First Test

```bash
# Run blocker tests (quick smoke test)
pytest tests/blocker/ -v

# Run all tests
pytest tests/ -v

# Run with coverage report
pytest tests/ --cov --cov-report=html
```

---

## 📊 Test Coverage

### Test Categories Overview

| Category | Test Count | Priority | Automation | Description |
|----------|-----------|----------|------------|-------------|
| 🔴 **Blocker** | 4 | Critical | ✅ Automated | Must pass before release |
| 🤖 **Custom Agent** | 3 | High | ✅ Automated | Agent parameter validation |
| 📝 **Problem Statement** | 4 | High | ✅ Automated | Requirement parsing |
| 🖼️ **Image Handling** | 5 | Medium | 🟨 Partial | Image processing & ordering |
| 📁 **Repository Operations** | 11 | High | ✅ Automated | Repo inference & CRUD |
| 🔀 **Pull Requests** | 5 | High | ✅ Automated | PR creation & validation |
| ⚠️ **Conflict/State** | 6 | Medium | 🟨 Partial | State management |
| 🔒 **Security** | 8 | Critical | ✅ Automated | Auth, secrets, injections |
| ⚡ **Performance** | 6 | High | ✅ Automated | Latency, concurrency |
| 💥 **Failure Injection** | 5 | Medium | ✅ Automated | Resilience testing |
| 📈 **Observability** | 5 | Medium | 🟨 Partial | Logging, telemetry |
| 🔄 **Workflows** | 4 | High | ✅ Automated | E2E integration |
| ✅ **Compliance** | 5 | Medium | ❌ Manual | GDPR, accessibility |
| 🎲 **Edge Cases** | 7 | Low | 🟨 Partial | Chaos engineering |
| **TOTAL** | **68** | — | **~75%** | — |

### Test Coverage Matrix

For detailed test case specifications, see [Test Cases Documentation](./docs/custom-agent-qa-test-cases-enhanced.md).

**By Risk Category:**
- **CP (Critical Path):** 15 tests
- **SEC (Security):** 12 tests  
- **PERF (Performance):** 10 tests
- **COMP (Compliance):** 8 tests
- **EC (Edge Cases):** 23 tests

**By Priority:**
- 🔴 Blocker: 12 tests (must pass)
- 🟠 Critical: 18 tests (high importance)
- 🟡 High: 22 tests (important)
- 🟢 Medium: 12 tests (standard)
- 🔵 Low: 4 tests (nice-to-have)

---

## 💻 Installation

### System Requirements

| Component | Requirement |
|-----------|-------------|
| Python | 3.11 or higher |
| RAM | 4GB minimum (8GB recommended) |
| Disk Space | 2GB for dependencies and artifacts |
| OS | Linux, macOS, Windows (WSL2) |

### Detailed Setup

#### 1. Python Environment

**Using venv:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements-test.txt
```

**Using conda:**
```bash
conda create -n copilot-qa python=3.11
conda activate copilot-qa
pip install -r requirements-test.txt
```

#### 2. GitHub Authentication

Create a GitHub Personal Access Token (PAT) with these scopes:
- `repo` (full repository access)
- `workflow` (for CI/CD integration)
- `read:org` (for organization access)

Set up authentication:
```bash
export GITHUB_TOKEN="your_pat_token_here"
export TEST_REPO_OWNER="your_github_username"
export TEST_REPO_NAME="test-repository"
```

#### 3. Test Repository Setup

The test suite requires access to 8 test repositories:

1. **test-repo-minimal** - Minimal Node.js project
2. **test-repo-python** - Python project with Flask
3. **test-repo-large** - Large monorepo (10k+ files)
4. **test-repo-unicode** - Unicode filenames
5. **test-repo-conflicts** - Pre-configured merge conflicts
6. **test-repo-security** - Security test scenarios
7. **test-repo-archived** - Archived repository
8. **test-repo-template** - Template repository

See [Test Environment Requirements](./docs/custom-agent-qa-test-cases-enhanced.md#test-environment-requirements) for setup instructions.

#### 4. Optional: Docker Setup

```bash
docker build -t copilot-qa-suite .
docker run -e GITHUB_TOKEN=$GITHUB_TOKEN copilot-qa-suite pytest tests/
```

---

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
pytest tests/

# Run specific priority level
pytest tests/blocker/
pytest tests/critical/

# Run with verbose output
pytest tests/ -v

# Run specific test by ID
pytest tests/ -k "TC_BL_001"

# Run with parallel execution (faster)
pytest tests/ -n auto
```

### Advanced Options

```bash
# Generate HTML coverage report
pytest tests/ --cov --cov-report=html
open htmlcov/index.html

# Generate JUnit XML (for CI)
pytest tests/ --junitxml=test-results/junit.xml

# Run with timeout (fail tests running > 300s)
pytest tests/ --timeout=300

# Run only failed tests from last run
pytest tests/ --lf

# Run in failfast mode (stop on first failure)
pytest tests/ -x

# Show local variables on failure
pytest tests/ -l
```

### Test Filters

```bash
# By marker
pytest tests/ -m "security"
pytest tests/ -m "performance"

# By risk category
pytest tests/ -k "SEC"  # Security tests
pytest tests/ -k "PERF" # Performance tests

# Exclude tests
pytest tests/ -m "not manual"
```

### Interactive Mode

```bash
# Drop into debugger on failure
pytest tests/ --pdb

# Drop into debugger on first failure
pytest tests/ -x --pdb
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflows

The repository includes automated testing via GitHub Actions:

#### 1. **PR Gate - Blocker Tests**
- Triggered on: Pull requests
- Runs: Blocker tests only (fast feedback)
- Must pass: Yes (blocks merge)
- Timeout: 60 seconds

#### 2. **Nightly Full Suite**
- Triggered on: Schedule (2 AM UTC)
- Runs: All test categories
- Parallel execution: 5 jobs (blocker, critical, high, medium, low)
- Timeout: 300 seconds
- Artifacts: Test reports, coverage, logs

#### 3. **Manual Dispatch**
- Triggered on: Manual workflow dispatch
- Runs: Full suite with options
- Configurable: Test level, timeout

### Workflow Configuration

Location: `.github/workflows/qa-test-suite.yml`

**Key Features:**
- ✅ Automated test execution
- ✅ JUnit XML & HTML reports
- ✅ Code coverage tracking (Codecov)
- ✅ Security scanning (Trivy)
- ✅ Slack/email notifications (optional)
- ✅ Test result summary in PR comments

### Status Badges

Add these badges to your repository README:

```markdown
[![Tests](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/qa-test-suite.yml/badge.svg)](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/qa-test-suite.yml)
[![Coverage](https://codecov.io/gh/YOUR_ORG/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_ORG/YOUR_REPO)
```

### Local CI Simulation

Test your changes locally before pushing:

```bash
# Simulate PR gate
pytest tests/blocker/ --junitxml=results.xml

# Simulate nightly run
pytest tests/ --cov --timeout=300 -n auto
```

---

## 📚 Documentation

### Core Documentation

| Document | Description | Link |
|----------|-------------|------|
| **Test Specifications** | 60+ detailed test cases | [docs/custom-agent-qa-test-cases-enhanced.md](./docs/custom-agent-qa-test-cases-enhanced.md) |
| **Execution Tracking** | CSV-based test tracker | [tracking/test-execution-tracking.csv](./tracking/test-execution-tracking.csv) |
| **Test Data Library** | Sample problem statements | [fixtures/sample-problem-statements.md](./fixtures/sample-problem-statements.md) |
| **Workflow Config** | CI/CD automation | [.github/workflows/qa-test-suite.yml](./.github/workflows/qa-test-suite.yml) |

### Test Case Structure

Each test case includes:

```markdown
#### TC-XX-NNN: Test Title

**Priority:** 🔴 Blocker  
**Risk Category:** CP (Critical Path)  
**Automation:** ✅ Automated

**Preconditions:**
- System is in known state
- Test data is available

**Test Steps:**
1. Perform action A
2. Perform action B
3. Verify result C

**Expected Result:**
- Outcome A occurs
- System state is B

**Test Data:**
- Input: `example-input.json`
- Expected output: `expected-output.json`
```

### Test Execution Tracking

Track test execution in `tracking/test-execution-tracking.csv`:

| Field | Description |
|-------|-------------|
| Test Case ID | Unique identifier (TC-XX-NNN) |
| Status | Not Run / Pass / Fail / Blocked |
| Execution Date | When test was run |
| Tester | Who executed the test |
| Defect ID | Link to bug tracker |
| Notes | Additional context |

**Import into:**
- Microsoft Excel
- Google Sheets
- Jira Test Management
- TestRail

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the repository**
   ```bash
   gh repo fork Sinnv2710/pw_example_gh_workflow
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-test-category
   ```

3. **Add your tests**
   ```bash
   # Add test file to appropriate directory
   tests/high/test_new_feature.py
   ```

4. **Update documentation**
   - Add test case to `docs/custom-agent-qa-test-cases-enhanced.md`
   - Add entry to `tracking/test-execution-tracking.csv`
   - Update this README if needed

5. **Run tests locally**
   ```bash
   pytest tests/ -v
   pytest tests/ --cov
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new test category for XYZ"
   git push origin feature/new-test-category
   ```

7. **Create pull request**
   - Use PR template
   - Link related issues
   - Wait for CI checks to pass

### Code Style

- **Python:** Follow PEP 8
- **Commit messages:** Use Conventional Commits
- **Test naming:** `test_<feature>_<scenario>_<expected_result>`
- **Documentation:** Update all affected docs

### Adding New Test Cases

1. Choose appropriate priority directory (`tests/blocker/` etc.)
2. Create test file: `test_TC_XX_NNN.py`
3. Add to enhanced test spec document
4. Add to CSV tracking sheet
5. Update test coverage matrix in README

### Review Process

All contributions require:
- ✅ Blocker tests passing
- ✅ Code review approval (1+ maintainer)
- ✅ Documentation updated
- ✅ No security vulnerabilities
- ✅ Test coverage maintained/improved

---

## 📊 Test Execution Tracking

### Using the CSV Tracker

The `tracking/test-execution-tracking.csv` file provides:

✅ **Test execution status tracking**  
✅ **Defect linkage**  
✅ **Tester assignment**  
✅ **Execution metrics**  
✅ **Release gate tracking**  

### CSV Columns

```csv
Test Case ID,Test Case Title,Priority,Risk Category,Automation Status,
Test Type,Assigned To,Planned Date,Execution Date,Status,Pass/Fail,
Execution Time (s),Tester,Environment,Build/Version,Precondition Met,
Expected Result,Actual Result,Defect ID,Notes,Retest Required,
Retest Date,Retest Status,Blocker for Release
```

### Status Values

- **Not Run** - Test not yet executed
- **Pass** - Test passed successfully
- **Fail** - Test failed, defect filed
- **Blocked** - Cannot execute due to dependency
- **Skip** - Intentionally skipped

### Importing into Tools

**Excel:**
```
File > Import > CSV > Select tracking/test-execution-tracking.csv
```

**Google Sheets:**
```
File > Import > Upload > Select CSV file
```

**Jira:**
Use Jira CSV import with field mapping

---

## 🎯 Release Gates

### Blocker Tests (Must Pass)

These tests MUST pass before release:

- **TC-BL-001:** End-to-end agent workflow
- **TC-BL-002:** Custom agent parameter validation
- **TC-BL-003:** Security credential handling
- **TC-BL-004:** Performance baseline (< 30s)

See `tests/blocker/` directory.

### Critical Tests (Should Pass)

High-priority tests (exceptions require signoff):

- All Security tests (TC-SC-*)
- Core functionality tests (TC-FA-*)
- PR workflow tests (TC-PR-*)

### Test Metrics

Target metrics for release:
- **Pass rate:** ≥ 95% (blocker/critical)
- **Execution time:** < 10 minutes (full suite)
- **Code coverage:** ≥ 80%
- **Security scan:** 0 high/critical vulnerabilities

---

## 🔧 Troubleshooting

### Common Issues

**Issue: GitHub authentication fails**
```bash
# Solution: Verify token has correct scopes
gh auth status
gh auth login --scopes repo,workflow
```

**Issue: Tests timeout**
```bash
# Solution: Increase timeout or run with more workers
pytest tests/ --timeout=600 -n 4
```

**Issue: Import errors**
```bash
# Solution: Reinstall dependencies
pip install --force-reinstall -r requirements-test.txt
```

**Issue: CSV won't import**
```
# Solution: Check encoding
file -I tracking/test-execution-tracking.csv
# Should show: charset=utf-8
```

### Getting Help

- 📖 [Read the docs](./docs/custom-agent-qa-test-cases-enhanced.md)
- 🐛 [Report a bug](https://github.com/Sinnv2710/pw_example_gh_workflow/issues/new)
- 💬 [Ask a question](https://github.com/Sinnv2710/pw_example_gh_workflow/discussions)
- 📧 Email: qa-team@example.com

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- GitHub Copilot team for agent framework
- QA community for best practices
- Contributors and testers

---

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2024-12-10 | Enhanced test suite with 60+ cases |
| 1.0 | 2024-11-01 | Initial release |

---

**Maintained by:** QA Team  
**Last Updated:** 2024-12-10  
**Status:** ✅ Production Ready

For the latest updates, see [CHANGELOG.md](./CHANGELOG.md)
