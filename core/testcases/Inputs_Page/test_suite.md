# Positive Test Cases


### TC001 - Verify Number Input Accepts Valid Number

- **Steps**:
  1. Enter `123` into the Number input field.
  2. Click "Display Inputs".
- **Expected Result**: Number input displays `123`.
- **Checkpoint**: Validate that the displayed value matches the entered number.

---

### TC002 - Verify Text Input Accepts Valid Text

- **Steps**:
  1. Enter `Hello World` into the Text input field.
  2. Click "Display Inputs".
- **Expected Result**: Text input displays `Hello World`.
- **Checkpoint**: Confirm the displayed text matches the input.

---

### TC003 - Verify Password Input Masks Characters

- **Steps**:
  1. Enter `Secret123` into the Password input field.
  2. Click "Display Inputs".
- **Expected Result**: Password field masks input (e.g., shows dots or asterisks).
- **Checkpoint**: Ensure masking is applied and input is stored correctly.

---

### TC004 - Verify Date Input Accepts Valid Date

- **Steps**:
  1. Enter `25/12/2025` or select from calendar.
  2. Click "Display Inputs".
- **Expected Result**: Date input displays `25/12/2025`.
- **Checkpoint**: Validate correct date format and value.

---

### TC005 - Verify Clear Inputs Button Clears All Fields

- **Steps**:
  1. Fill all input fields with valid data.
  2. Click "Clear Inputs".
- **Expected Result**: All fields are reset to empty.
- **Checkpoint**: Confirm all input fields are cleared.


# Negative Test Cases


### TC006 - Enter Alphabetic Characters in Number Field

- **Steps**:
  1. Enter `abc` into the Number input field.
  2. Click "Display Inputs".
- **Expected Result**: Error or rejection of input.
- **Checkpoint**: Validate that non-numeric input is not accepted.

---

### TC007 - Leave Required Fields Blank

- **Steps**:
  1. Leave all fields empty.
  2. Click "Display Inputs".
- **Expected Result**: Warning or no output displayed.
- **Checkpoint**: Ensure system handles empty inputs gracefully.

---

### TC008 - Enter Invalid Date Format

- **Steps**:
  1. Enter `2025-12-25` into the Date field.
  2. Click "Display Inputs".
- **Expected Result**: Error or rejection due to incorrect format.
- **Checkpoint**: Validate date format enforcement (`dd/mm/yyyy`).

---

### TC009 - Enter Special Characters in Text Field

- **Steps**:
  1. Enter `@#$%^&*()` into the Text input field.
  2. Click "Display Inputs".
- **Expected Result**: Either accepted or sanitized.
- **Checkpoint**: Confirm handling of special characters.


# Edge Test Cases


### TC010 - Enter Maximum Length Text

- **Steps**:
  1. Enter a long string (e.g., 255 characters) into the Text field.
  2. Click "Display Inputs".
- **Expected Result**: Input is accepted or truncated.
- **Checkpoint**: Validate max length handling and display.

---

### TC011 - Enter Zero in Number Field

- **Steps**:
  1. Enter `0` into the Number input field.
  2. Click "Display Inputs".
- **Expected Result**: `0` is accepted and displayed.
- **Checkpoint**: Confirm zero is treated as valid input.

---

### TC012 - Enter Future Date Beyond Current Year

- **Steps**:
  1. Enter `01/01/2100` into the Date field.
  2. Click "Display Inputs".
- **Expected Result**: Date is accepted or flagged.
- **Checkpoint**: Validate system's date range handling.

---

### TC013 - Rapid Input and Clear Sequence

- **Steps**:
  1. Quickly fill all fields and click "Clear Inputs" repeatedly.
- **Expected Result**: Inputs are cleared without error.
- **Checkpoint**: Confirm UI responsiveness and no crash.
