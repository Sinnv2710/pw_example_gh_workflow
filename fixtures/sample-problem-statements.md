# Test Data Library - Sample Problem Statements

This document contains comprehensive test data for validating custom Copilot coding agents.

## Table of Contents
- [Sample Problem Statements](#sample-problem-statements)
- [Sample Filenames](#sample-filenames)
- [Sample Commit Messages](#sample-commit-messages)
- [Mock API Responses](#mock-api-responses)
- [Test Images Descriptions](#test-images-descriptions)

---

## Sample Problem Statements

### 1. Minimal Problem Statement
**Test ID:** PS-MIN-001  
**Purpose:** Validate agent handles minimal requirements

```
Add TODO.md
```

**Expected Behavior:**
- Agent should ask clarifying questions
- Should not assume file structure or content
- Should request template or requirements

---

### 2. Detailed Problem Statement
**Test ID:** PS-DETAIL-001  
**Purpose:** Validate comprehensive requirement handling

```
Refactor the authentication system to use OAuth2 instead of basic auth.

Requirements:
- Implement OAuth2 authorization code flow
- Support GitHub and Google providers
- Store tokens securely in encrypted database
- Add token refresh mechanism
- Update all API endpoints to use OAuth2
- Maintain backward compatibility for 2 releases
- Add comprehensive unit and integration tests
- Update API documentation

Technical Constraints:
- Use existing JWT library (jsonwebtoken v9.0.0)
- Database: PostgreSQL 14+
- Target branch: feature/oauth2-migration
- Due date: Sprint 23 (Dec 15, 2024)

Acceptance Criteria:
- All existing tests pass
- New test coverage >= 85%
- Security scan passes
- Performance impact < 100ms p95
```

**Expected Behavior:**
- Agent should create structured implementation plan
- Should identify all affected files
- Should propose phased migration approach

---

### 3. Problem Statement with Constraints
**Test ID:** PS-CONSTRAINT-001  
**Purpose:** Validate handling of specific constraints

```
Fix bug #1234: User avatars not loading on profile page

Constraints:
- Target branch: hotfix/avatar-loading
- Must be production-ready within 4 hours
- Cannot modify database schema
- Must work with existing CDN (CloudFront)
- Zero downtime deployment required

Context:
- Bug introduced in commit abc123
- Affects 15% of users (Safari browser only)
- Error logs show CORS policy violations
```

**Expected Behavior:**
- Agent should focus on minimal, targeted fix
- Should identify root cause quickly
- Should propose quick validation steps

---

### 4. Ambiguous Problem Statement
**Test ID:** PS-AMBIGUOUS-001  
**Purpose:** Validate agent requests clarification

```
Make it better
```

**Expected Behavior:**
- Agent MUST ask clarifying questions
- Should request specific goals
- Should ask about scope and constraints
- Should not proceed without clarification

---

### 5. Problem Statement with Images
**Test ID:** PS-IMAGE-001  
**Purpose:** Validate image-based requirements

```
Update the dashboard UI to match the new design mockup.

See attached mockup: dashboard-redesign-v3.png

Requirements:
- Implement responsive grid layout (12 columns)
- Update color scheme to match brand guidelines
- Add dark mode support
- Ensure WCAG 2.1 AA compliance
```

**Expected Behavior:**
- Agent should process image in reverse order (newest first)
- Should extract design requirements from mockup
- Should identify UI components to modify

---

### 6. Multi-Step Problem Statement
**Test ID:** PS-MULTISTEP-001  
**Purpose:** Validate phased migration handling

```
Migrate from MongoDB to PostgreSQL

Phase 1: Setup
- Install PostgreSQL 14
- Create migration scripts
- Set up dual-write mode

Phase 2: Migration
- Migrate historical data
- Validate data integrity
- Performance testing

Phase 3: Cutover
- Switch reads to PostgreSQL
- Disable MongoDB writes
- Archive MongoDB data

Each phase requires approval before proceeding.
```

**Expected Behavior:**
- Agent should acknowledge multi-phase approach
- Should complete Phase 1 only
- Should wait for approval before Phase 2

---

## Sample Filenames

### ASCII Filenames
```
README.md
package.json
tsconfig.json
.gitignore
app.py
main.go
index.html
styles.css
script.js
test_utils.py
```

### Unicode Filenames
```
说明.md                    # Chinese
документация.txt          # Russian
ファイル.json              # Japanese
설명서.md                  # Korean
tài_liệu.txt              # Vietnamese
مستند.md                  # Arabic
```

### Filenames with Spaces
```
"file with spaces.md"
"My Document.txt"
"Test Case 001.spec.ts"
"Release Notes v2.pdf"
```

### Filenames with Emoji
```
README🎉.md
TODO✅.txt
🚀launch.sh
📝notes.md
```

### Edge Case Filenames
```
.hidden-file
..double-dot
file-with-many-hyphens-in-the-name.txt
ALLCAPS.MD
mixedCase.Js
very-long-filename-that-exceeds-normal-expectations-and-tests-path-length-limits-in-various-filesystems.configuration.yaml
file.multiple.dots.in.name.txt
```

---

## Sample Commit Messages

### Conventional Commits
```
feat: add OAuth2 authentication support

Implemented OAuth2 authorization code flow with GitHub and Google providers.
Includes token refresh mechanism and encrypted storage.

Breaking Change: Removes basic auth support after 2 releases.

Refs: #123, #456
```

```
fix: resolve CORS issue in avatar loading

Fixed Safari-specific CORS policy violations by updating CloudFront
distribution settings and adding proper headers.

Closes: #1234
```

```
docs: update API documentation for OAuth2 endpoints

Added comprehensive OAuth2 flow documentation with sequence diagrams
and example requests/responses.
```

```
test: add integration tests for OAuth2 flow

Covers authorization, token refresh, and error scenarios.
Test coverage increased to 87%.
```

```
refactor: extract authentication logic to separate module

No functional changes. Improved code organization and testability.
```

### Commits with Emoji
```
✨ feat: add dark mode support

🐛 fix: resolve memory leak in event handlers

📝 docs: update README with installation instructions

♻️ refactor: simplify error handling logic

🔥 remove: deprecated authentication methods
```

### Multi-line with Co-authors
```
feat: implement real-time collaboration features

Added WebSocket support for real-time document editing.
Includes conflict resolution and presence indicators.

Co-authored-by: Jane Developer <jane@example.com>
Co-authored-by: Bob Tester <bob@example.com>

Refs: PROJ-789
```

---

## Mock API Responses

### Success Response
```json
{
  "status": "success",
  "data": {
    "id": "12345",
    "type": "pull_request",
    "attributes": {
      "title": "Add OAuth2 support",
      "state": "open",
      "created_at": "2024-12-10T10:30:00Z",
      "updated_at": "2024-12-10T15:45:00Z",
      "author": {
        "username": "developer",
        "avatar_url": "https://avatars.example.com/u/12345"
      },
      "files_changed": 23,
      "additions": 456,
      "deletions": 89
    }
  },
  "meta": {
    "request_id": "req_abc123xyz",
    "timestamp": "2024-12-10T15:45:30Z"
  }
}
```

### Error Response - Permission Denied
```json
{
  "status": "error",
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You do not have permission to access this repository",
    "details": "User 'developer' requires 'write' access to create pull requests",
    "documentation_url": "https://docs.example.com/errors/permission-denied"
  },
  "meta": {
    "request_id": "req_error_123",
    "timestamp": "2024-12-10T15:45:30Z"
  }
}
```

### Error Response - Rate Limit
```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "API rate limit exceeded",
    "details": "You have exceeded the rate limit of 5000 requests per hour",
    "retry_after": 3600,
    "limit": 5000,
    "remaining": 0,
    "reset_at": "2024-12-10T17:00:00Z"
  },
  "meta": {
    "request_id": "req_ratelimit_456",
    "timestamp": "2024-12-10T16:15:30Z"
  }
}
```

### Error Response - Not Found
```json
{
  "status": "error",
  "error": {
    "code": "NOT_FOUND",
    "message": "Repository not found",
    "details": "The repository 'example/nonexistent-repo' does not exist or you don't have access",
    "documentation_url": "https://docs.example.com/errors/not-found"
  },
  "meta": {
    "request_id": "req_notfound_789",
    "timestamp": "2024-12-10T16:20:00Z"
  }
}
```

---

## Test Images Descriptions

### UI Mockup - Dashboard
**Filename:** `dashboard-redesign-v3.png`  
**Description:** High-fidelity mockup of dashboard redesign
- 1920x1080 resolution
- Shows 3-column layout with sidebar navigation
- Includes dark mode variant
- Annotations showing spacing (8px grid system)
- Color palette: Primary #0066FF, Secondary #00CC88, Neutral #F5F5F5

### Screenshot - Bug Report
**Filename:** `bug-avatar-not-loading.png`  
**Description:** Screenshot demonstrating avatar loading issue
- Shows broken image icon in Safari browser
- Browser console visible with CORS error
- Network tab showing failed request (403 status)
- URL bar showing production domain

### Architecture Diagram
**Filename:** `oauth2-sequence-diagram.svg`  
**Description:** Sequence diagram for OAuth2 flow
- Shows interaction between Client, Auth Server, Resource Server
- Includes authorization code exchange
- Shows token refresh flow
- Annotations explaining each step

### Wireframe - Mobile View
**Filename:** `mobile-layout-wireframe.png`  
**Description:** Low-fidelity wireframe for mobile responsive design
- 375x812 resolution (iPhone X size)
- Shows collapsed navigation menu
- Single column layout
- Touch target sizes annotated (minimum 44x44px)

### Data Model Diagram
**Filename:** `database-schema-v2.png`  
**Description:** Entity relationship diagram
- Shows tables: users, auth_tokens, oauth_providers
- Foreign key relationships highlighted
- Indexes marked with special notation
- Includes data types and constraints

---

## Usage Guidelines

### For Test Automation
1. Reference test data by Test ID in automated tests
2. Use mock API responses for integration tests
3. Validate filename handling across all character sets

### For Manual Testing
1. Copy problem statements into agent interface
2. Observe agent behavior and responses
3. Verify agent asks appropriate clarifying questions

### For Performance Testing
1. Use large problem statements to test parsing limits
2. Test with multiple images to validate processing order
3. Measure response time for complex multi-phase requests

---

**Version:** 1.0  
**Last Updated:** 2024-12-10  
**Maintained By:** QA Team
