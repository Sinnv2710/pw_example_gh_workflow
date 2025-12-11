import { test, expect } from '@playwright/test'

test.describe('ImageGalleryDemo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demos.telerik.com/aspnet-ajax/imagegallery/')
  })

  test('TC-POS-001 - Search for a destination @critical', async ({ page }) => {
    await page.locator('#ctl00_MainContent_DestinationsCombo_Input').fill('Paris')
    await page.locator('#ctl00_MainContent_SearchButton').click()
    await expect(page.locator('#ctl00_MainContent_RadGrid1_ctl00')).toBeVisible()
  })

  test('TC-POS-002 - Select an image @critical', async ({ page }) => {
    await page.locator('img[src*="paris"]').hover()
    await page.locator('button:has-text("select")').click()
    await expect(page.locator('img[src*="paris"]')).toHaveClass(/selected/)
  })

  test('TC-POS-003 - Submit a form @critical', async ({ page }) => {
    await page.locator('#ctl00_MainContent_DestinationsCombo_Input').fill('New York')
    await page.locator('#ctl00_MainContent_SearchButton').click()
    await page.locator('#ctl00_MainContent_SubmitButton').click()
    await expect(page).toHaveURL(/success/)
  })

  test('TC-NEG-001 - Search with invalid input @critical', async ({ page }) => {
    await page.locator('#ctl00_MainContent_DestinationsCombo_Input').fill('12345')
    await page.locator('#ctl00_MainContent_SearchButton').click()
    await expect(page.locator('.t-error')).toBeVisible()
  })

  test('TC-NEG-002 - Select an image with invalid action @medium', async ({ page }) => {
    await page.locator('img[src*="paris"]').hover()
    const beforeClass = await page.locator('img[src*="paris"]').getAttribute('class')
    await page.locator('button:has-text("non-existent")').click({ timeout: 1000 }).catch(() => {})
    const afterClass = await page.locator('img[src*="paris"]').getAttribute('class')
    expect(beforeClass).toEqual(afterClass)
  })

  test('TC-NEG-003 - Submit a form with missing required fields @critical', async ({ page }) => {
    await page.locator('#ctl00_MainContent_SearchButton').click()
    await expect(page.locator('.t-required')).toBeVisible()
  })

  test('TC-EDGE-001 - Search with very long input @medium', async ({ page }) => {
    const longString = 'a'.repeat(500)
    await page.locator('#ctl00_MainContent_DestinationsCombo_Input').fill(longString)
    await page.locator('#ctl00_MainContent_SearchButton').click()
    await expect(page.locator('.t-error')).toContainText('too long')
  })

  test('TC-EDGE-002 - Select an image with special characters @medium', async ({ page }) => {
    await page.locator('img[src*="paris"]').hover()
    const beforeClass = await page.locator('img[src*="paris"]').getAttribute('class')
    await page.locator('button:has-text("select")').click()
    const afterClass = await page.locator('img[src*="paris"]').getAttribute('class')
    expect(beforeClass).not.toEqual(afterClass)
  })

  test('TC-EDGE-003 - Submit a form with XSS payload @critical', async ({ page }) => {
    page.on('dialog', dialog => {
      throw new Error('Unexpected dialog: ' + dialog.message())
    })
    await page.locator('#ctl00_MainContent_DestinationsCombo_Input').fill('<script>alert(\'XSS\')</script>')
    await page.locator('#ctl00_MainContent_SubmitButton').click()
    await expect(page.locator('body')).not.toContainText('<script>')
  })
})