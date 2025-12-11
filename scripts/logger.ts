/**
 * Logger Utility - Consistent logging across all scripts
 * 
 * Provides standardized logging with timestamps, symbols, and formatting
 * to make pipeline execution transparent and easy to follow.
 */

export class Logger {
  private step: string = '';
  
  constructor(stepName?: string) {
    if (stepName) {
      this.step = stepName;
    }
  }

  /**
   * Get current timestamp in readable format
   */
  private timestamp(): string {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * Log informational message
   */
  info(message: string): void {
    console.log(`[${this.timestamp()}] ${message}`);
  }

  /**
   * Log success message with checkmark
   */
  success(message: string): void {
    console.log(`[${this.timestamp()}] ✓ ${message}`);
  }

  /**
   * Log error message with X symbol
   */
  error(message: string): void {
    console.error(`[${this.timestamp()}] ✗ ${message}`);
  }

  /**
   * Log warning message
   */
  warn(message: string): void {
    console.warn(`[${this.timestamp()}] ⚠️  ${message}`);
  }

  /**
   * Log progress/ongoing action
   */
  progress(message: string): void {
    console.log(`[${this.timestamp()}] → ${message}`);
  }

  /**
   * Print section header
   */
  header(title: string): void {
    console.log('\n================================================');
    console.log(`${title}`);
    console.log('================================================\n');
  }

  /**
   * Print sub-section title
   */
  section(title: string): void {
    console.log(`\n--- ${title} ---`);
  }

  /**
   * Print bullet point (with optional indentation)
   */
  bullet(message: string, indent: number = 1): void {
    const spaces = '   '.repeat(indent);
    console.log(`${spaces}- ${message}`);
  }

  /**
   * Print key-value pair
   */
  keyValue(key: string, value: string | number, indent: number = 1): void {
    const spaces = '   '.repeat(indent);
    console.log(`${spaces}${key}: ${value}`);
  }

  /**
   * Print completion message for a step
   */
  complete(stepNumber?: number): void {
    if (stepNumber) {
      console.log(`\n✓ STEP ${stepNumber} COMPLETE`);
    } else {
      console.log('\n✓ COMPLETE');
    }
  }

  /**
   * Print summary table
   */
  summary(items: Array<{ label: string; value: string | number }>): void {
    console.log('\n📊 SUMMARY:');
    items.forEach(item => {
      this.keyValue(item.label, item.value);
    });
  }
}

export default Logger;
