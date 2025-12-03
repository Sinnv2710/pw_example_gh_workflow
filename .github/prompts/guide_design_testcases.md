# 🧾 Prompt Guide: Generate Test Cases in Markdown

## 🎯 Objective

Generate **test cases in Markdown format** for automation testing based on:

- Page content scraped by **Playwright-MCP** (DOM elements, selectors, attributes).
- Or **uploaded image attachments** showing UI components.

---

## 🛠️ Instructions for Copilot

1. **Analyze Inputs**

   - If Playwright-MCP provides DOM structure → extract input fields, buttons, labels.
   - If image attachment is uploaded → interpret visible UI elements (inputs, buttons, forms).
2. **Design Test Cases**

   - Use **Markdown format** with headings and sections.
   - Organize into:
     - ✅ Positive Cases
     - ❌ Negative Cases
     - ⚠️ Edge Cases
3. **Structure of Each Test Case**

   ```markdown
   ### TCXXX - [Title of Test Case]

   - **Steps**:
     1. [Step 1]
     2. [Step 2]
   - **Expected Result**: [Expected outcome]
   - **Checkpoint**: [Validation point]
   ```


4. **Guidelines**
   * Ensure **dynamic values** (no hardcoded strings).
   * Include **clear checkpoints** for validation.
   * Keep steps concise but actionable.
   * Use  **consistent naming convention** : `TC001`, `TC002`, etc.

## 📑 Example (from scraped inputs page)

markdown

```
### TC001 - Verify Number Input Accepts Valid Number
-**Steps**:
  1.Enter `123`into the Number input field.
  2.Click "Display Inputs".
-**Expected Result**: Number input displays `123`.
-**Checkpoint**: Validate that the displayed value matches the entered number.

---

### TC006 - Enter Alphabetic Characters in Number Field
-**Steps**:
  1.Enter `abc`into the Number input field.
  2.Click "Display Inputs".
-**Expected Result**: Error or rejection of input.
-**Checkpoint**: Validate that non-numeric input is not accepted.
```

## ✅ Deliverable

* A **Markdown file** (`test_cases.md`) containing all generated test cases.
* Organized by  **Positive** ,  **Negative** , and **Edge** scenarios.
* Each case includes  **Steps, Expected Result, and Checkpoint** .
